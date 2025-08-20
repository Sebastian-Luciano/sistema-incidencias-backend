// src/controllers/estadoController.js
import { 
    obtenerEstados, 
    obtenerEstadoPorId,
    crearEstado,
    actualizarEstado,
    eliminarEstado
} from "../models/estadoModel.js";

// GET: Obtener todos
export const getEstados = async (req, res) => {
    try {
        const estados = await obtenerEstados();
        res.json(estados);
    } catch (error) {
        res.status(500).json({mensaje: "Error al obtener estados", error});
    }
};

// GET: Obtener por ID
export const getEstado = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (Number.isNaN(id)) return res.status(400).json({ mensaje: "ID inválido" });
        
        // debug temporal:
        //console.log("[DEBUG] getEstado - id:", id);

        const estado = await obtenerEstadoPorId(id);

        //console.log("[DEBUG] getEstado - resultado DB:", estado);

        if (!estado) {
            return res.status(404).json({ mensaje: "Estado no encontrado" });
        }
        res.json(estado);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener el estado", error });
    }
};

// POST: Crear
export const postEstado = async (req, res) => {
    try {
        const { nombre } = req.body;
        if (!nombre) return res.status(400).json({ mensaje: "Falla el nombre" });
        const nuevoEstado = await crearEstado(nombre);
        res.status(201).json(nuevoEstado);
    } catch (error) {
        res.status(500).json({mensaje: "Error al crear estado", error});
    }
};

// PUT: Actualizar
export const putEstado = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { nombre } = req.body;
        if (Number.isNaN(id)) return res.status(400).json({ mensaje: "ID inválido" });
        if (!nombre) return res.status(400).json({ mensaje: "Falta el nombre" });

        const actualizado = await actualizarEstado(id, nombre);
        if (!actualizado) {
            return res.status(404).json({mensaje: "Estado no encontrado"});
        }
        res.json({ mensaje: "Estado actualizado correctamente" });
    } catch (error) {
        res.status(500).json({mensaje: "Error al actualizar estado", error});
    }
};

// DELETE: Eliminar
export const deleteEstado = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (Number.isNaN(id)) return res.status(400).json({ mensaje: "ID inválido" });

        const eliminado = await eliminarEstado(id);
        if (!eliminado) {
            return res.status(404).json({ mensaje: "Estado no encontrado" });
        }
        res.json({ mensaje: "Estado eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar estdo", error });
    }
};