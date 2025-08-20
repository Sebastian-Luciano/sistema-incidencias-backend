// src/config/swagger.js
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
                url: "http://localhost:3000/api",
                description: "Servidor local",
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