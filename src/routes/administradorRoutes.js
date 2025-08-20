// src/routes/administradorRoutes.js
import express from 'express';
import { getAdministradores, getAdministrador } from '../controllers/administradorController.js';
import { requireAuth, requireRole } from '../middlewares/authMiddleware.js';

const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Administradores
 *   description: Gestión interna de administradores (solo para admins)
 */

/**
 * @swagger
 * /administradores:
 *   get:
 *     summary: Listar administradores (solo admin)
 *     tags: [Administradores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de administradores
 */
router.get('/', requireAuth, requireRole("admin"), getAdministradores);

/**
 * @swagger
 * /administradores/{id}:
 *   get:
 *     summary: Obtener un administrador por ID (solo admin)
 *     tags: [Administradores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Administrador encontrado
 *       404:
 *         description: Administrador no encontrado
 */
router.get("/:id", requireAuth, requireRole("admin"), getAdministrador);

export default router;