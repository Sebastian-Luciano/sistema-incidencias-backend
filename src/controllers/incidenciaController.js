// src/controllers/incidenciaController.js
import { 
    obtenerIncidenciasPaginadas,
    obtenerIncidenciasPorUsuarioPaginadas,
    obtenerIncidenciaPorId,
    crearIncidencia,
    actualizarIncidencia,
    eliminarIncidencia,
    incidenciaEnUso
 } from "../models/incidenciaModel.js";

 /**
  * 🔹 GET: Todas las incidencias (ADMIN, con paginación y filtros)
  */
 export const getIncidencias = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ mensaje: 'No autorizado' });
        }

        const { page = 1, limit = 10, estado_id, categoria_id, q } = req.query;
        const { rows, total } = await obtenerIncidenciasPaginadas({
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            estado_id,
            categoria_id,
            q,
        });

        res.json({
            meta: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(total / limit),
            },
            data: rows,
        });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener incidencias", error });
    }
 };

 /**
  * 🔹 GET: Incidencias del usuario autenticodo (paginadas)
  */
 // GET las mias (USUARIO ve solo las suyas)
 export const getIncidenciasDelUsuario = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const { rows, total } = await obtenerIncidenciasPorUsuarioPaginadas({
            usuarioId: req.user.sub,
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
        });

        res.json({
            meta: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(total / limit),
            },
            data: rows,
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener mis incidencias', error });
    }
 };

 /**
  * 🔹 GET: incidencia por ID
  */
export const getIncidencia = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (Number.isNaN(id)) return res.status(400).json({ mensaje: "ID inválido" });

        const incidencia = await obtenerIncidenciaPorId(id);
        if (!incidencia) return res.status(404).json({ mensaje: "Incidencia no encontrada" });

        // Autorización por el rol/propiedad
        if(req.user.role === 'usuario' && incidencia.usuario_id !== req.user.sub) {
            return res.status(403).json({ mensaje: 'No puedes ver incidencias de otros usuarios' });
        }
        
        res.json(incidencia);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener incidencia", error });
    }
};

// POST: Crear incidencia (usuario y admin)
export const postIncidencia = async (req, res) => {
    try {
        const { titulo, descripcion, estado_id, categoria_id, usuario_id, administrador_id } = req.body;

        if (!titulo || !descripcion || !estado_id || !categoria_id ) {
            return res.status(400).json({ mensaje: 'Faltan campos obligatorios' })
        }

        // Si es usuario normal, forzamos usuario_id desde el token
        let usuarioPropietario = usuario_id;
        if (req.user.role === 'usuario') {
            usuarioPropietario = req.user.sub;
        }else{
            // admin creando: exigimos usuario_id explicito
            if (!usuario_id) return res.status(400).json({ mensaje: 'usuario_id es obligatorio (admin creando)' });
        }

        // administrador_id: normalmente el que atiende (siempre admin). Si eres usuario, puede venir null
        const adminId = req.user.role === 'admin' ? (administrador_id || req.user.sub): (administrador_id ?? null);

        const nuevo = await crearIncidencia({
            titulo,
            descripcion,
            estado_id,
            categoria_id,
            usuario_id: usuarioPropietario,
            administrador_id: adminId
        });
        res.status(201).json(nuevo);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al crear incidente", error });
    }
};

// PUT: Actualizar
export const putIncidencia = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (Number.isNaN(id)) return res.status(400).json({ mensaje: "ID inválido" });
        
        const actualizado = await actualizarIncidencia(id, req.body);
        if (!actualizado) return res.status(404).json({ mensaje: "Incidencia no encontrada" });

        res.json({ mensaje: "Incidencia actualizada correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar incidencia", error });
    }
};

// DELETE: Eliminar incidencia
export const deleteIncidencia = async (req, res) => {
    try {
        const id = Number(req.params.id);
        //validar el ID es un número válido
        if (Number.isNaN(id)) return res.status(400).json({ mensaje: "ID inválido. Debe ser un número" });

        //validar si la incidenicia está en uso
        if (await incidenciaEnUso(id)) return res.status(409).json({ mensaje: "No se puede eliminar la incidencia porque tiene historial asociado"});

        const eliminado = await eliminarIncidencia(id);
        if (!eliminado) return res.status(404).json({ mensaje: "Incidencia no encontrada" });
        
        res.json({ mensaje: "Incidencia eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar incidencia", error });
    }
};