// src/controller/administradorController.js
import { obtenerAdministradores, obtenerAdministradorPorId } from "../models/administradorModel.js";

export const getAdministradores = async (req, res) => {
    try {
        const administradores = await obtenerAdministradores();
        res.json(administradores);
    } catch (error) {
        res.status(500).json({mensaje: 'Error al obtener administradores', error });
    }
};

export const getAdministrador = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if(Number.isNaN(id)) return res.status(400).json({ mensaje: "ID inválido" });
        const administrador = await obtenerAdministradorPorId(id);
        if(!administrador) return res.status(404).json({ mensaje: "Administrador no encontrado" });
        res.json(administrador);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener administrador", error });
    }
};