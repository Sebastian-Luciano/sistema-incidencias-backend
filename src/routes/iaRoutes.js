// src/routes/iaRoutes.js
import express from "express";
import { 
    sugerirCategoria, 
    chatMock, 
    getFAQs, 
    createFAQ, 
    updateFAQ, 
    deleteFAQ 
} from "../controllers/iaController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /ia/sugerir-categoria:
 *   post:
 *     summary: Sugerir categoría para una incidencia (mock IA)
 *     tags: [IA]
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
 *               descripcion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sugerencia de categoría
 */
router.post("/sugerir-categoria", requireAuth, sugerirCategoria);

/**
 * @swagger
 * /ia/chat:
 *   post:
 *     summary: Chat simulado de soporte
 *     tags: [IA]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mensaje:
 *                 type: string
 *                 example: "¿Cómo registro una incidencia?"
 *     responses:
 *       200:
 *         description: Respuesta simulada
 */
router.post("/chat", chatMock);

/**
 * @swagger
 * /ia/faqs:
 *   get:
 *     summary: Obtener todas las FAQs
 *     tags: [IA]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de FAQs
 */
router.get("/faqs", requireAuth, getFAQs);

/**
 * @swagger
 * /ia/faqs:
 *   post:
 *     summary: Crear una nueva FAQ
 *     tags: [IA]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               keywords:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["registrar", "incidencia"]
 *               respuesta:
 *                 type: string
 *                 example: "Para registrar una incidencia ve al menú Nueva Incidencia"
 *     responses:
 *       201:
 *         description: FAQ creada
 */
router.post("/faqs", requireAuth, createFAQ);

/**
 * @swagger
 * /ia/faqs/{index}:
 *   put:
 *     summary: Actualizar una FAQ por índice
 *     tags: [IA]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: index
 *         schema:
 *           type: integer
 *         required: true
 *         description: Índice de la FAQ
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               keywords:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["estado", "proceso"]
 *               respuesta:
 *                 type: string
 *                 example: "Pendiente → En proceso → Resuelto"
 *     responses:
 *       200:
 *         description: FAQ actualizada
 */
router.put("/faqs/:id", requireAuth, updateFAQ);

/**
 * @swagger
 * /ia/faqs/{index}:
 *   delete:
 *     summary: Eliminar una FAQ por índice
 *     tags: [IA]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: index
 *         schema:
 *           type: integer
 *         required: true
 *         description: Índice de la FAQ a eliminar
 *     responses:
 *       200:
 *         description: FAQ eliminada
 */
router.delete("/faqs/:id", requireAuth, deleteFAQ);

export default router;
