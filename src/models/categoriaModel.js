// src/models/categoriaModel.js
import pool from "../config/db.js";

// Obtener todas la categorias
export const obtenerCategorias = async () => {
    const [rows] = await pool.query("SELECT * FROM categoria");
    return rows;
};


// Obtener una categoria ID
export const obtenerCategoriaPorId = async (id) => {
    const [rows] = await pool.query("SELECT * FROM categoria WHERE id_categoria = ?", [id]);
    return rows[0] || null;
};

// Crear nueva categoria
export const crearCategoria = async (nombre) => {
    const [result] = await pool.query("INSERT INTO categoria (nombre) VALUES (?)", [nombre]);
    return { id_categoria: result.insertId, nombre };
};


// Actualizar categoria
export const actualizarCategoria = async (id, nombre) => {
    const [result] = await pool.query("UPDATE categoria SET nombre = ? WHERE id_categoria = ?", [nombre, id]);
    return result.affectedRows;
};

// Eliminar categoria
export const eliminarCategoria = async (id) => {
    const [result] = await pool.query("DELETE FROM categoria WHERE id_categoria = ?", [id]);
    return result.affectedRows;
};

export const categoriaEnUso = async (id) => {
    const [rows] = await pool.query("SELECT COUNT(*) AS total FROM incidencia WHERE categoria_id = ?", [id]);
    return rows[0].total > 0;
};