// src/middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';

export const requireAuth = (req, res, next) => {
    try {
        const auth = req.headers.authorization || '';
        const [, token] = auth.split(' '); // "Bearer token"
        if (!token) {
            return res.status(401).json({ mensaje: 'Token no provisto' });
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET);
        // payload = { sub: <id>, role: 'usuario'|'admin', email, iat,exp }
        req.user = payload;
        next();
    } catch (error) {
        return res.status(401).json({ mensaje: 'Token inválido o expirado' });
    }
};

export const requireRole = (...rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ mensaje: 'No autenticado' });
        if (!rolesPermitidos.includes(req.user.role)) {
            return res.status(403).json({ mensaje: 'No autorizado' });
        }
        next();
    }
};