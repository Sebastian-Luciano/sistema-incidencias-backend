// src/routes/historialRoutes.js
import express from 'express';
import { 
    getHistoriales,
    getHistorial,
    postHistorial,
    putHistorial,
    deleteHistorial
} from '../controllers/historialController.js';
import { requireAuth, requireRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

// lectura: usuarios y admins logueados
// require: obliga a la persona que esté logueado con un token válido

/**
 * @swagger
 * tags:
 *   name: Historiales
 *   description: Cambios de estado de una incidencia (auditoría)
 */

/**
 * @swagger
 * /historiales:
 *   get:
 *     summary: Listar todos los historiales (cualquier usuario autenticado)
 *     tags: [Historiales]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de historiales
 */
router.get("/", requireAuth, getHistoriales);

/**
 * @swagger
 * /historiales/{id}:
 *   get:
 *     summary: Obtener un historial por ID (cualquier usuario autenticado)
 *     tags: [Historiales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID del historial
 *     responses:
 *       200:
 *         description: Historial encontrado
 *       404:
 *         description: Historial no encontrado
 */
router.get("/:id", requireAuth, getHistorial);

// Escritura: solo admins
// requireAuth: obliga a la persona que esté logueado con un token válido
// requireRole: revisa que el rol en el token sea "admin"

/**
 * @swagger
 * /historiales:
 *   post:
 *     summary: Crear un historial (solo admin)
 *     tags: [Historiales]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               [fecha_cambio, estado_anterior_id, estado_nuevo_id, incidencia_id, realizado_por_id]
 *             properties:
 *               fecha_cambio: { type: string, example: "2025-08-12" }
 *               descripcion:   { type: string, example: "Incidencia revisada por soporte" }
 *               estado_anterior_id: { type: integer, example: 1 }
 *               estado_nuevo_id:    { type: integer, example: 2 }
 *               incidencia_id:      { type: integer, example: 3 }
 *               realizado_por_id:   { type: integer, example: 1 }
 *     responses:
 *       201:
 *         description: Historial creado
 */
router.post("/", requireAuth, requireRole('admin'), postHistorial);

/**
 * @swagger
 * /historiales/{id}:
 *   put:
 *     summary: Actualizar un historial (solo admin)
 *     tags: [Historiales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID del historial
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha_cambio: { type: string, example: "2025-08-12" }
 *               descripcion:   { type: string, example: "Actualización manual" }
 *               estado_anterior_id: { type: integer, example: 1 }
 *               estado_nuevo_id:    { type: integer, example: 2 }
 *               incidencia_id:      { type: integer, example: 3 }
 *               realizado_por_id:   { type: integer, example: 1 }
 *     responses:
 *       200:
 *         description: Historial actualizado
 *       404:
 *         description: No encontrado
 */
router.put("/:id", requireAuth, requireRole('admin'), putHistorial);

/**
 * @swagger
 * /historiales/{id}:
 *   delete:
 *     summary: Eliminar un historial (solo admin)
 *     tags: [Historiales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Historial eliminado
 *       404:
 *         description: No encontrado
 */
router.delete("/:id", requireAuth, requireRole('admin'), deleteHistorial);

export default router;