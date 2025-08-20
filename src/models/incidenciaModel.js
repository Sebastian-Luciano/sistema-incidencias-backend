// src/models/incidenciaModel.js
import pool from '../config/db.js';

/**
 * 🔹 Obtener incidencias (ADMIN) con filtros y paginación
 */
export const obtenerIncidenciasPaginadas = async ({ page = 1, limit = 10, estado_id, categoria_id, q }) =>{
    const offset = (page - 1) * limit;

    let where = "WHERE 1=1";
    const params = [];

    // Filtros dinámicos
    if (estado_id) {
        where += " AND i.estado_id = ?";
        params.push(estado_id);
    }

    if (categoria_id) {
        where += " AND i.categoria_id = ?";
        params.push(estado_id);
    }

    if (q) {
        where += " AND (i.titulo LIKE ? OR i.description LIKE ?)";
        params.push(`%${q}%`, `%${q}%`);
    }

    // Consultar principal
    const [rows] = await pool.query(
        `
        SELECT I.id_incidencia, 1.titulo, i.descripcion, i.fecha_registro, 
            e.nombre AS estado_nombre, c.nombre AS categoria_nombtre,
            u.nombre AS usuario_nombre, a.nombre AS administrador_nombre
        FROM incidencia i
        INNER JOIN estado e ON i.estado_id = e.id_estado
        INNER JOIN categoria c ON i.categoria_id = c.id_categoria
        INNER JOIN usuario u ON i.usuario_id = u.id_usuario
        INNER JOIN administrador a ON i.administrador_id = a.id_admin
        ${where}
        ORDER BY i.fecha_registro DESC
        LIMIT ? OFFSET ?
        `,
        [...params, limit, offset]
    );

    //Total de paginación
    const [countRows] = await pool.query(
        `SELECT COUNT(*) AS total FROM incidencia i ${where}`,
        params
    );
   
    return { rows, total: countRows[0].total};
};

/**
 * 🔹 Obtener incidencias del USUARIO autenticado (con paginación)
 */
export const obtenerIncidenciasPorUsuarioPaginadas = async ({ usuarioId, page = 1, limit = 10 }) => {
    const offset = (page - 1) * limit;

    const [rows] = await pool.query(
        `
        SELECT i.id_incidencia, i.titulo, i.descripcion, i.fecha_registro,
                e.nombre AS estado_nombre, c.nombre AS categoria_nombre
        FROM incidencia i
        INNER JOIN estado e ON i.estado_id = e.id_estado
        INNER JOIN categoria c ON i.categoria_id = c.id_categoria
        WHERE i.usuario_id = ?
        ORDER BY i.fecha_registro DESC
        LIMIT ? OFFSET ? 
        `,
        [usuarioId, limit, offset]
    );

    const [countRows] = await pool.query(
        "SELECT COUNT(*) AS total FROM incidencia WHERE usuario_id = ?",
        [usuarioId]
    );

    return { rows, total: countRows[0].total };
};

/**
 * 🔹 Obtener una incidencia por ID
*/
// Obtener una incidencia por ID
// Una incidencia por ID (incluyendo dueño)
export const obtenerIncidenciaPorId = async (id) => {
    const [rows] = await pool.query(`
        SELECT
            i.id_incidencia, i.titulo, i.descripcion, i.fecha_registro,
            i.estado_id, i.categoria_id, i.usuario_id, i.administrador_id,
            e.nombre As estado_nombre, c.nombre As categoria_nombre
        FROM incidencia i
        INNER JOIN estado e ON i.estado_id = e.id_estado
        INNER JOIN categoria c ON i.categoria_id = c.id_categoria
        WHERE i.id_incidencia = ?
        `, [id]);
        return rows[0];
};

/**
 * 🔹 Crear nueva incidencia
 */
// crear nueva incidencia
export const crearIncidencia = async (data) => {
    const { titulo, descripcion, estado_id, categoria_id, usuario_id, administrador_id } = data;
    const [result] = await pool.query(`
        INSERT INTO incidencia (titulo, descripcion, fecha_registro, estado_id, categoria_id, usuario_id, administrador_id)
        VALUES (?, ?, NOW(), ?, ?, ?, ?)
        `, [titulo, descripcion, estado_id, categoria_id, usuario_id, administrador_id]);
    return { id_incidencia: result.insertId, ...data, fecha_registro: new Date() };
};

// Actualizar incidencia
export const actualizarIncidencia = async (id, data) => {
    const { titulo, descripcion, estado_id, categoria_id, usuario_id, administrador_id } = data;
    const [result] = await pool.query(`
        UPDATE incidencia
        SET titulo = ?, descripcion = ?, estado_id = ?, categoria_id = ?, usuario_id = ?, administrador_id = ? 
        WHERE id_incidencia = ?
        `, [titulo, descripcion, estado_id, categoria_id, usuario_id, administrador_id, id]);
        return result.affectedRows;
};

// Eliminar incidencia
export const eliminarIncidencia = async (id) => {
    const [result] = await pool.query('DELETE FROM incidencia WHERE id_incidencia = ?', [id]);
    return result.affectedRows;
};

export const incidenciaEnUso = async (id) => {
    const [rows] = await pool.query("SELECT COUNT(*) AS total FROM historial WHERE incidencia_id = ?", [id]);
    return rows[0].total > 0;
};