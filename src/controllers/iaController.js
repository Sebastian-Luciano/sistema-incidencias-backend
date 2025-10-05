// src/controllers/iaController.js
import pool from "../config/db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * POST /api/ia/sugerir-categoria
 * Body: { titulo?: string, descripcion?: string }
 * Respuesta: { categoria, categoria_id, confianza, explicacion }
 */
export const sugerirCategoria = async (req, res) => {
    try {
        const { titulo = "", descripcion = "" } = req.body || {};
        const text = `${titulo} ${descripcion}`.toLowerCase().trim();
        if (!text) return res.status(400).json({ mensaje: "Falta titulo o descripcion" });

        // Tomamos categorías desde la BD para que coincida siempre con lo real
        const [cats] = await pool.query("SELECT id_categoria, nombre FROM categoria");

        // Mapa simple de palabras clave por categoría (ajusta según tus categorías reales)
        const KEYWORDS = {
            Redes: ["red", "internet", "wifi", "conexión", "conexion", "latencia", "router", "modem"],
            Hardware: ["mouse", "teclado", "monitor", "pantalla", "disco", "tarjeta", "hardware", "cpu", "ram"],
            Infraestructura: ["servidor", "servicio", "arranca", "arrancar", "caida", "caído", "sistema", "infraestructura"],
            // agrega más según necesites
        };

        // scoramos coincidencias por categoría
        let best = { cat: null, score: 0 };
        for (const cat of cats) {
            const name = cat.nombre;
            const kws = KEYWORDS[name] ?? [name.toLowerCase()];
            let score = 0;
            for (const kw of kws) {
                const re = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
                const m = text.match(re);
                if (m) score += m.length;
            }
            if (score > best.score) best = { cat, score };
        }

        if (best.cat && best.score > 0) {
            // confianza muy simple: normalizamos por nº palabras clave (no es ML, solo heurística)
            const totalKws = (KEYWORDS[best.cat.nombre] || []).length || 1;
            const confianza = Math.min(0.99, Math.round((best.score / totalKws) * 100) / 100);
            return res.json({
                categoria: best.cat.nombre,
                categoria_id: best.cat.id_categoria,
                confianza,
                explicacion: `Se encontraron ${best.score} coincidencias con palabras clave de "${best.cat.nombre}".`
            });
        }

        // fallback: no se determinó categoría
        return res.json({
            categoria: null,
            categoria_id: null,
            confianza: 0,
            explicacion: "No se encontraron coincidencias claras. Seleccione manualmente."
        });
    } catch (error) {
        console.error("Error sugerirCategoria:", error);
        res.status(500).json({ mensaje: "Error al sugerir categoría", error: error.message });
    }
};


// Cargar el archivo JSON una sola vez al iniciar el servidor
const faqsPath = path.join(__dirname, "../data/faqs.json");
let faqs = [];

try {
    const rawData = fs.readFileSync(faqsPath, "utf-8");
    faqs = JSON.parse(rawData);
    console.log("✅ FAQs cargadas correctamente:", faqs.length, "respuestas disponibles.");
} catch (error) {
    console.error("⚠️ Error cargando FAQs:", error.message);
}

export const chatMock = async (req, res) => {
    try {
        const { mensaje } = req.body;
        if (!mensaje) {
            return res.status(400).json({ respuesta: "No enviaste mensaje" });
        }

        const lower = mensaje.toLowerCase();
        let respuesta = "🤔 No entendí tu consulta. ¿Podrías reformularla?";

        for (const item of faqs) {
            const match = item.keywords.some((k) => lower.includes(k));
            if (match) {
                respuesta = item.respuesta;
                break;
            }
        }

        res.json({ respuesta });
    } catch (error) {
        res.status(500).json({ respuesta: "⚠️ Error interno en el servidor" });
    }
};


// Helper para guardar FAQs en el archivo
const guardarFAQs = (data) => {
    fs.writeFileSync(faqsPath, JSON.stringify(data, null, 2), "utf-8");
};

// ✅ Listar FAQs
export const getFAQs = (req, res) => {
    res.json(faqs);
};

// ✅ Crear nueva FAQ (con ID autoincremental)
export const createFAQ = (req, res) => {
    const { keywords, respuesta } = req.body;
    if (!keywords || !Array.isArray(keywords) || !respuesta) {
        return res.status(400).json({ mensaje: "Faltan campos obligatorios" });
    }

    // Generar ID único (si no hay base de datos, lo simulamos)
    const newId = faqs.length > 0 ? Math.max(...faqs.map(f => f.id)) + 1 : 1;

    const nuevaFAQ = { id: newId, keywords, respuesta };
    faqs.push(nuevaFAQ);
    guardarFAQs(faqs);

    res.status(201).json({ mensaje: "FAQ creada", faq: nuevaFAQ });
};

// ✅ Actualizar FAQ por ID
export const updateFAQ = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const index = faqs.findIndex(f => f.id === id);

    if (index === -1) {
        return res.status(404).json({ mensaje: "FAQ no encontrada" });
    }

    const { keywords, respuesta } = req.body;
    faqs[index] = { id, keywords, respuesta };
    guardarFAQs(faqs);

    res.json({ mensaje: "FAQ actualizada", faq: faqs[index] });
};

// ✅ Eliminar FAQ por ID
export const deleteFAQ = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const index = faqs.findIndex(f => f.id === id);

    if (index === -1) {
        return res.status(404).json({ mensaje: "FAQ no encontrada" });
    }

    const eliminada = faqs.splice(index, 1);
    guardarFAQs(faqs);

    res.json({ mensaje: "FAQ eliminada", faq: eliminada[0] });
};
