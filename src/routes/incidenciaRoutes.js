// src/routes/incidenciaRoutes.js
import express from "express";
import { 
    getIncidencias,
    getIncidenciasDelUsuario,
    getIncidencia,
    postIncidencia,
    putIncidencia,
    deleteIncidencia
 } from "../controllers/incidenciaController.js";
 import { requireAuth, requireRole } from "../middlewares/authMiddleware.js";

 const router = express.Router();

 // ADMIN puede ver todas las incidencias
// requireAuth --> obliga a la persona que esté logueado con un token válido
// requireRole ('admin')--> revisa que el rol en el token sea "admin"
/**
 * @swagger
 * tags:
 *   name: Incidencias
 *   description: Endpoints para gestionar incidencias
 */

/**
 * @swagger
 * /incidencias:
 *   get:
 *     summary: Obtener todas las incidencias (solo admin)
 *     tags: [Incidencias]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de incidencias
 */
 router.get("/", requireAuth, requireRole('admin'), getIncidencias);

 // Usuario solo puede ver las suyas
 /**
 * @swagger
 * /incidencias/mias:
 *   get:
 *     summary: Obtener incidencias del usuario autenticado
 *     tags: [Incidencias]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de incidencias del usuario
 */
 router.get('/mias', requireAuth, requireRole('usuario'), getIncidenciasDelUsuario);


/**
 * @swagger
 * /incidencias/{id}:
 *   get:
 *     summary: Obtener una incidencia por ID
 *     tags: [Incidencias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la incidencia
 *     responses:
 *       200:
 *         description: Datos de la incidencia
 *       404:
 *         description: Incidencia no encontrada
 */
 router.get("/:id", requireAuth, getIncidencia);  // Ver una por ID (admin cuqlquiera; usuario solo si es suya)

// Crear (permitido para ambos)
/**
 * @swagger
 * /incidencias:
 *   post:
 *     summary: Crear una nueva incidencia
 *     tags: [Incidencias]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: Error en el sistema
 *               descripcion:
 *                 type: string
 *                 example: La aplicación se cierra inesperadamente
 *               estado_id:
 *                 type: integer
 *                 example: 1
 *               categoria_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Incidencia creada
 */            
 router.post("/", requireAuth, postIncidencia);

 // Editar y eliminar (solo admin)
/**
 * @swagger
 * /incidencias/{id}:
 *   put:
 *     summary: Actualizar una incidencia por ID (solo admin)
 *     tags: [Incidencias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la incidencia
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: Error corregido
 *               descripcion:
 *                 type: string
 *                 example: Se solucionó el error en la aplicación
 *               estado_id:
 *                 type: integer
 *                 example: 2
 *               categoria_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Incidencia actualizada correctamente
 *       404:
 *         description: Incidencia no encontrada
 */
 router.put("/:id", requireAuth, requireRole('admin'), putIncidencia);

/**
 * @swagger
 * /incidencias/{id}:
 *   delete:
 *     summary: Eliminar una incidencia (solo admin)
 *     tags: [Incidencias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la incidencia
 *     responses:
 *       200:
 *         description: Incidencia eliminada correctamente
 *       404:
 *         description: Incidencia no encontrada
 */
 router.delete("/:id", requireAuth, requireRole('admin'), deleteIncidencia);

 export default router;