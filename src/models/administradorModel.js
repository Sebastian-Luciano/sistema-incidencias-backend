// src/models/administradorModel.js
import pool from "../config/db.js";

export const obtenerAdministradores = async () => {
    const [rows] = await pool.query("SELECT * FROM administrador");
    return rows;
};

export const obtenerAdminPorCorreo = async (correo) => {
    const [rows] = await pool.query(
        'SELECT * FROM administrador WHERE correo = ?',
        [correo]
    );
    return rows[0];
};

export const obtenerAdministradorPorId = async () => {
    const [rows] = await pool.query("SELECT * FROM administrador WHERE id_admin = ?", [id]);
    return rows[0];
};