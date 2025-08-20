import express from 'express';
import { getUsuarios, getUsuario } from '../controllers/usuarioController.js';
import { requireAuth, requireRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

// GET /api/usuarios

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Gestión de usuarios (solo visible para administradores)
 */

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Listar usuarios (solo admin)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
router.get('/', requireAuth, requireRole("admin"), getUsuarios);

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Obtener un usuario por ID (solo admin)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 */
router.get("/:id", requireAuth, requireRole("admin"), getUsuario);

export default router;