// src/models/usuarioModel.js
import pool from '../config/db.js';

export const obtenerUsuarios = async () => {
    const [rows] = await pool.query("SELECT * FROM usuario");
    return rows;
};

export const obtenerUsuarioPorCorreo = async (correo) => {
    const [rows] = await pool.query('SELECT * FROM usuario WHERE correo = ?', [correo]);
    return rows[0];
};

export const crearUsuario = async ({ nombre, correo, passwordHash }) => {
    const [result] = await pool.query(
        'INSERT INTO usuario (nombre, correo, `contraseña`) VALUES (?, ?, ?)',
        [nombre, correo, passwordHash]
    );
    return { id_usuario: result.insertId, nombre, correo };
};

export const obtenerUsuarioPorId = async (id) => {
    const [rows] = await pool.query("SELECT * FROM usuario WHERE id_usuario = ?", [id]);
    return rows[0];
};