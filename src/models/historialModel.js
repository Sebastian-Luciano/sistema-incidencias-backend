// src/models/historialModel.js
import pool from '../config/db.js';

// Obtener todos los historiales con información relacionada
export const obtenerHistoriales = async () => {
    const [rows] = await pool.query(`
        SELECT h.id_historial, 
                h.fecha_cambio, 
                h.descripcion,
                e1.nombre AS estado_anterior,
                e2.nombre AS estado_nuevo,
                i.titulo AS incidencia_titulo,
                a.nombre AS administrador_nombre
        FROM historial h
        INNER JOIN estado e1 ON h.estado_anterior_id = e1.id_estado
        INNER JOIN estado e2 ON h.estado_nuevo_id = e2.id_estado
        INNER JOIN incidencia i ON h.incidencia_id = i.id_incidencia
        INNER JOIN administrador a ON h.realizado_por_id = a.id_admin
        ORDER BY h.fecha_cambio DESC
        `);
    return rows;
};

// Obtener historial por ID
export const obtenerHistorialPorId = async (id) => {
    const [rows] = await pool.query(`
        SELECT h.id_historial, 
                h.fecha_cambio, 
                h.descripcion,
                e1.nombre AS estado_anterior,
                e2.nombre AS estado_nuevo,
                i.titulo AS incidencia_titulo,
                a.nombre AS administrador_nombre
        FROM historial h
        INNER JOIN estado e1 ON h.estado_anterior_id = e1.id_estado
        INNER JOIN estado e2 ON h.estado_nuevo_id = e2.id_estado
        INNER JOIN incidencia i ON h.incidencia_id = i.id_incidencia
        INNER JOIN administrador a ON h.realizado_por_id = a.id_admin
        WHERE h.id_historial = ?
        `, [id]);
    return rows[0];
};

// Nueva función para filtrar por incidencia_id
export const obtenerHistorialesPorIncidencia = async (incidenciaId) => {
    const [rows] = await pool.query(`
        SELECT h.id_historial, 
                h.fecha_cambio, 
                h.descripcion,
                e1.nombre AS estado_anterior,
                e2.nombre AS estado_nuevo,
                i.titulo AS incidencia_titulo,
                a.nombre AS administrador_nombre
        FROM historial h
        INNER JOIN estado e1 ON h.estado_anterior_id = e1.id_estado
        INNER JOIN estado e2 ON h.estado_nuevo_id = e2.id_estado
        INNER JOIN incidencia i ON h.incidencia_id = i.id_incidencia
        INNER JOIN administrador a ON h.realizado_por_id = a.id_admin
        WHERE h.incidencia_id = ?
        ORDER BY h.fecha_cambio DESC
    `, [incidenciaId]);
    return rows;
};


// Crear nuevo historial
export const crearHistorial = async (data) => {
    const { fecha_cambio, descripcion, estado_anterior_id, estado_nuevo_id, incidencia_id, realizado_por_id } = data;
    const [result] = await pool.query(`
        INSERT INTO historial(fecha_cambio, descripcion, estado_anterior_id, estado_nuevo_id, incidencia_id, realizado_por_id)
        VALUES (?, ?, ?, ?, ?, ?)
        `, [fecha_cambio, descripcion, estado_anterior_id, estado_nuevo_id, incidencia_id, realizado_por_id]);
    return { id_historial: result.insertId, ...data };
};

// Actualizar historial
export const actualizarHistorial = async (id, data) => {
    const { fecha_cambio, descripcion, estado_anterior_id, estado_nuevo_id, incidencia_id, realizado_por_id } = data;
    const [result] = await pool.query(`
        UPDATE historial
        SET fecha_cambio = ?, descripcion = ?, estado_anterior_id = ?, estado_nuevo_id = ?, incidencia_id = ?, realizado_por_id = ?
        WHERE id_historial = ?
        `, [fecha_cambio, descripcion, estado_anterior_id, estado_nuevo_id, incidencia_id, realizado_por_id, id]);
    return result.affectedRows;
};

// Eliminar historial
export const eliminarHistorial = async (id) => {
    const [result] = await pool.query('DELETE FROM historial WHERE id_historial = ?', [id]);
    return result.affectedRows;
};