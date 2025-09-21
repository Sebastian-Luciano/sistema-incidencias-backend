import express from 'express';
import cors from 'cors';
import { swaggerSpec, swaggerUiMiddleware } from "./config/swagger.js";

import usuarioRoutes from './routes/usuarioRoutes.js';
import administradorRoutes from './routes/administradorRoutes.js';
import estadoRoutes from './routes/estadoRoutes.js';
import categoriaRoutes from './routes/categoriaRoutes.js';
import incidenciaRoutes from './routes/incidenciaRoutes.js';
import historialRoutes from './routes/historialRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Swagger UI
app.use("/api-docs", swaggerUiMiddleware.serve, swaggerUiMiddleware.setup(swaggerSpec));

// Auth
app.use('/api/auth', authRoutes);

// Resto de recursos
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/administradores', administradorRoutes);
app.use('/api/estados', estadoRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/incidencias', incidenciaRoutes);
app.use('/api/historiales', historialRoutes);


app.get('/', (req, res) => {
    res.send('API del Sistema de Incidencias funcionando ✔')
});

export default app;