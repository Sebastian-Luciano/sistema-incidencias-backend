// src/routes/estadoRoutes.js
import express from "express";
import { 
    getEstados,
    getEstado,
    postEstado,
    putEstado,
    deleteEstado
 } from "../controllers/estadoController.js";
 import { requireAuth, requireRole } from "../middlewares/authMiddleware.js";

 const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Estados
 *   description: Catálogo de estados (Pendiente, En proceso, Resuelto, etc.)
 */

/**
 * @swagger
 * /estados:
 *   get:
 *     summary: Listar todos los estados (cualquier usuario autenticado)
 *     tags: [Estados]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de estados
 */
 router.get("/", requireAuth, getEstados);

/**
 * @swagger
 * /estados/{id}:
 *   get:
 *     summary: Obtener un estado por ID (cualquier usuario autenticado)
 *     tags: [Estados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID del estado
 *     responses:
 *       200:
 *         description: Estado encontrado
 *       404:
 *         description: Estado no encontrado
 */
 router.get("/:id", requireAuth, getEstado);

 // Solo ADMIN puede crear, editar o eliminar --> requireRole('admin')
 // requireAuth --> obliga a que la persona esté logueado con un token válido
 // requireRole --> revisa que el rol en el token sea "admin"

/**
 * @swagger
 * /estados:
 *   post:
 *     summary: Crear estado (solo admin)
 *     tags: [Estados]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre]
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: En revisión
 *     responses:
 *       201:
 *         description: Estado creado
 *       400:
 *         description: Datos inválidos
 */
 router.post("/", requireAuth, requireRole('admin'), postEstado);

/**
 * @swagger
 * /estados/{id}:
 *   put:
 *     summary: Actualizar estado (solo admin)
 *     tags: [Estados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID del estado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre]
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Resuelto
 *     responses:
 *       200:
 *         description: Estado actualizado
 *       404:
 *         description: Estado no encontrado
 */
 router.put("/:id", requireAuth, requireRole('admin'), putEstado);

/**
 * @swagger
 * /estados/{id}:
 *   delete:
 *     summary: Eliminar estado (solo admin)
 *     tags: [Estados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID del estado
 *     responses:
 *       200:
 *         description: Estado eliminado
 *       404:
 *         description: Estado no encontrado
 */
 router.delete("/:id", requireAuth, requireRole('admin'), deleteEstado);

 export default router;