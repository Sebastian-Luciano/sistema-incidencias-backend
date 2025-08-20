// src/routes/authRoutes.js
import express from 'express';
import { register, login, me } from '../controllers/authController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Juan Pérez
 *               correo:
 *                 type: string
 *                 example: juan@example.com
 *               contraseña:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 */
router.post('/register', register); // crea USUARIO

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión en el sistema
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               correo:
 *                 type: string
 *                 example: admin1@example.com
 *               contraseña:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Login correcto
 */
router.post('/login', login); // login usuario o admin

/**
 * @swagger
 * /auth/me:
 *   post:
 *     summary: Retorna los datos del usuario autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Información del usuario autenticado
 */
router.post('/me', requireAuth, me); // retorna payload del token

export default router;