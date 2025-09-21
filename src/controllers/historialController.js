// scr/controllers/historialController.js
import { 
    obtenerHistoriales,
    obtenerHistorialPorId,
    obtenerHistorialesPorIncidencia,
    crearHistorial,
    actualizarHistorial,
    eliminarHistorial
} from "../models/historialModel.js";

// GET: Historiales
export const getHistoriales = async (req, res) => {
    try {
        const historiales = await obtenerHistoriales();
        res.json(historiales);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener historiales", error });
    }
};

// GET: Historial por ID
export const getHistorial = async (req, res) => {
    try {
        // validar el ID en número
        const id = parseInt(req.params.id, 10);
        if (Number.isNaN(id)) return res.status(400).json({ mensaje: "ID inválida. No es un número" });

        // validacion si existe el ID del historial 
        const historial = await obtenerHistorialPorId(id);
        if (!historial) return res.status(404).json({ mensaje: "Historial no encontrado" });

        res.json(historial);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener historial", error })
    }
};


// GET: Historial filtrado por incidencia
export const getHistorialPorIncidencia = async (req, res) => {
    try {
        const incidenciaId = parseInt(req.params.incidenciaId, 10);
        if (Number.isNaN(incidenciaId)) return res.status(400).json({ mensaje: "ID inválida" });

        const historiales = await obtenerHistorialesPorIncidencia(incidenciaId);
        res.json(historiales);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener historial por incidencia", error });
    }
};


// POST: Crear historial
export const postHistorial = async (req, res) => {
    try {
        const { fecha_cambio, descripcion, estado_anterior_id, estado_nuevo_id, incidencia_id, realizado_por_id } =  req.body;
        if (!fecha_cambio || !descripcion || !estado_anterior_id || !estado_nuevo_id || !incidencia_id || !realizado_por_id) {
            return res.status(400).json({ mensaje: "Faltan campos obligatorios" });
        }

        const nuevo = await crearHistorial(req.body);
        res.status(201).json(nuevo);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al crear historial", error });
    }
};

// PUT: actulizar historial
export const putHistorial = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (Number.isNaN(id)) return res.status(400).json({ mensaje: "ID inválido. No es un número" });

        const actualizado = await actualizarHistorial(id, req.body);
        if (!actualizado) return res.status(404).json({ mensaje: "Historial no encontrado" });

        res.json({ mensaje: "Historial actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar historial", error });
    }
};

// DELETE: eliminar el registro por ID
export const deleteHistorial = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (Number.isNaN(id)) return res.status(400).json({ mensaje: "ID inválido. No es un número" });

        const eliminado = await eliminarHistorial(id);
        if (!eliminado) return res.status(404).json({ mensaje: "Historial no encontrado" });

        res.json({ mensaje: "Historial eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar historial", error });
    }
};