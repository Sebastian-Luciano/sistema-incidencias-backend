// src/routes/categoriaRoutes.js

import express from "express";
import { 
    getCategorias,
    getCategoria,
    postCategoria,
    putCategoria,
    deleteCategoria
} from "../controllers/categoriaController.js";
import { requireAuth, requireRole } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Categorias
 *   description: Endpoints para gestionar categorías
 */

/**
 * @swagger
 * /categorias:
 *   get:
 *     summary: Listar todas las categorías
 *     tags: [Categorias]
 *     responses:
 *       200:
 *         description: Lista de categorías
 */
router.get("/", getCategorias);

/**
 * @swagger
 * /categorias/{id}:
 *   get:
 *     summary: Obtener una categoría por ID
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría
 *     responses:
 *       200:
 *         description: Datos de la categoría
 *       404:
 *         description: Categoría no encontrada
 */
router.get("/:id", getCategoria);

 // Solo ADMIN puede crear, editar o eliminar --> requireRole('admin')
 // requireAuth --> obliga a que la persona esté logueado con un token válido
 // requireRole --> revisa que el rol en el token sea "admin"
 
/**
 * @swagger
 * /categorias:
 *   post:
 *     summary: Crear una categoría (solo admin)
 *     tags: [Categorias]
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
 *                 example: Hardware
 *     responses:
 *       201:
 *         description: Categoría creada
 *       400:
 *         description: Datos inválidos
 *       409:
 *         description: Ya existe una categoría con ese nombre
 */
router.post("/", requireAuth, requireRole('admin'), postCategoria);

/**
 * @swagger
 * /categorias/{id}:
 *   put:
 *     summary: Actualizar una categoría por ID (solo admin)
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría
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
 *                 example: Software
 *     responses:
 *       200:
 *         description: Categoría actualizada correctamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Categoría no encontrada
 *       409:
 *         description: Conflicto (por ejemplo, nombre duplicado)
 */
router.put("/:id", requireAuth, requireRole('admin'), putCategoria);


/**
 * @swagger
 * /categorias/{id}:
 *   delete:
 *     summary: Eliminar una categoría (solo admin)
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría
 *     responses:
 *       200:
 *         description: Categoría eliminada correctamente
 *       404:
 *         description: Categoría no encontrada
 *       409:
 *         description: No se puede eliminar porque está en uso
 */
router.delete("/:id", requireAuth, requireRole('admin'), deleteCategoria);

export default router;