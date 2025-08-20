// src/models/estadoModel.js
import pool from "../config/db.js";

// Obtener todos los estados
export const obtenerEstados = async () =>{
    const [rows] = await pool.query("SELECT * FROM estado");
    return rows;
};

// Obtener un estado por ID
export const obtenerEstadoPorId = async (id) => {
    const [rows] = await pool.query("SELECT * FROM estado WHERE id_estado = ?", [id]);
    return rows[0] || null;
};

// Crear un nuevo estado
export const crearEstado = async (nombre) => {
    const [result] = await pool.query("INSERT INTO estado (nombre) VALUES (?)", [nombre]);
    return {id_estado: result.insertId, nombre};
};

// Actualizar un estado
export const actualizarEstado = async (id, nombre) => {
    const [result] = await pool.query("UPDATE estado SET nombre = ? WHERE id_estado = ?", [nombre, id]);
    return result.affectedRows; // número de filas afectadas
};

// Eliminar un estado
export const eliminarEstado = async (id) => {
    const [result] = await pool.query("DELETE FROM estado WHERE id_estado = ?", [id]);
    return result.affectedRows;
};