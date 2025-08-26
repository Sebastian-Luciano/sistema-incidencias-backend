// src/config/swagger.js
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tomamos la URL del servidor desde variables de entorno o usamos localhost por defecto
const SERVER_URL = process.env.SERVER_URL || "http://localhost:3000/api"

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Sistema de incidencia - API",
            version: "1.0.0",
            description: "Documentación de la API del sistema de incidencias"
        },
        servers: [
            {
                url: SERVER_URL,
                description: "Servidor API",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: [path.join(__dirname, "../routes/*.js")], // siempre encuentra
};

export const swaggerSpec = swaggerJSDoc(options);
export const swaggerUiMiddleware = swaggerUi;