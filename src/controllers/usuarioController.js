// src/controllers/usuarioController.js
import { obtenerUsuarios, obtenerUsuarioPorId } from "../models/usuarioModel.js";

export const getUsuarios = async (req, res) => {
    try {
        const usuarios = await obtenerUsuarios();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener usuarios'. error});
    }
};

export const getUsuario = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (Number.isNaN(id)) return res.status(400).json({ mensaje: "ID inválido" });

        const usuario = await obtenerUsuarioPorId(id);
        if(!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener usuario", error });
    }
};