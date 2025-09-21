// src/controllers/authController.js
import jwt from 'jsonwebtoken';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { obtenerUsuarioPorCorreo, crearUsuario } from '../models/usuarioModel.js';
import { obtenerAdminPorCorreo } from '../models/administradorModel.js';

const signToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '8h',
    });
};

// POST /api/auth/register (crear USUARIO normal)
export const register = async (req, res) => {
    try {
        const { nombre, correo, contraseña } = req.body;

        if (!nombre || !correo || !contraseña) {
            return res.status(400).json({ mensaje: 'Falta campos obligatorios' });
        }

        // ¿correo ya usado por el usuario o admin?
        const existeU = await obtenerUsuarioPorCorreo(correo);
        const existeA = await obtenerAdminPorCorreo(correo);
        if (existeU || existeA) {
            return res.status(409).json({ mensaje: 'El correo ya está registrado' });
        }

        const passwordHash = await hashPassword(contraseña);
        const nuevo = await crearUsuario({ nombre, correo, passwordHash });

        const token = signToken({
            sub: nuevo.id_usuario,
            role: 'usuario',
            email: correo,
        });

        res.status(201).json({
            mensaje: 'Usuario resgistrado correctamente',
            usuario: nuevo,
            token,
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el resgistro', error });
    }
};

// POST /api/auth/login (usuario o admin)
export const login = async (req, res) => {
    try {
        const { correo, contraseña } = req.body;
        if (!correo || !contraseña) {
            return res.status(400).json({ mensaje: 'Faltan credenciales' })
        }

        // 1) Intenta como usuario
        const u = await obtenerUsuarioPorCorreo(correo);
        if (u) {
            const ok = await comparePassword(contraseña, u['contraseña']);
            if (!ok) return res.status(401).json({ mensaje: 'Credenciales invalidas' });

            const token = signToken({ sub: u.id_usuario, role: 'usuario', email: u.correo });
            return res.json({
                mensaje: 'Login correcto (usuario',
                token,
                perfil: { id: u.id_usuario, nombre: u.nombre, correo: u.correo, role: 'usuario' },
            });
        }

        // 2) Intento como ADMIN
        const a = await obtenerAdminPorCorreo(correo);
        if (a) {
            const ok = await comparePassword(contraseña, a['contraseña']); // ✅ Compara hash
            if (!ok) return res.status(401).json({ mensaje: 'Credenciales inválidas' });

            const token = signToken({ sub: a.id_admin, role: 'admin', email: a.correo });
            return res.json({
                mensaje: 'Login correcto (admin)',
                token,
                perfil: { id: a.id_admin, nombre: a.nombre, correo: a.correo, role: 'admin' },
            });
        }

        // 3) Correo no existe en ningún lado
        return res.status(404).json({ mensaje: 'Correo no registrado. Regístrate para continuar.' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en login', error });
    }
};

// GET /api/auth/me (requiere token)
export const me = async (req, res) => {
    // req.user viene del middleware requireAuth
    res.json({ user: req.user });
};