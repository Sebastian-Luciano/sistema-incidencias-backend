# 🛠️ Sistema de Incidencias - Backend

Este proyecto es un **sistema de gestión de incidencias técnicas** desarrollado con **Node.js, Express y MySQL**.
Incluye autenticación con **JWT**, roles (usuario y administrador), documentación con **Swagger**, y soporte para paginación y filtros.


---

## 🚀 Tecnologías principales
- Node.js (ESM)
- Express
- MySQL2
- JWT (Json Web Token)
- Bcrypt
- Swagger UI (documentación de API)
- Nodemon (dev)


---


## 📂 estructura del proyecto
sistema-incidencias-backend/
│── src/
│ ├── config/ # Configuración (DB, Swagger)
│ ├── controllers/ # Lógica de negocio
│ ├── middlewares/ # Middlewares (auth, roles)
│ ├── models/ # Consultas SQL
│ ├── routes/ # Rutas de la API
│ └── app.js # App Express
│── .env # Variables de entorno
│── package.json
│── README.md


---


## 🔑 Autenticación
- Los usuarios se registran y loguean con correo + contraseña.
- Se genera un **JWT** que se usa en los headers:

---

## 📖 Endpoint principales
- `/api/auth/register` → Registrar usuario
- `/api/auth/login` → Iniciar sesión
- `/api/incidencias` → CRUD de incidencias (con roles y permisos)
- `/api/categorias` → CRUD de categorías
- `/api/estados` → CRUD de estados
- `/api/usuarios` → Listar usuarios
- `/api/administradores` → Listar administradores

---

## 📝 Documentación con Swagger
La documentación interactiva está disponible en:

👉 [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## ⚙️ Instalación y ejecución

1. Clonar el repositorio
 ```bash
 git clone https://github.com/TUUSUARIO/sistema-incidencias-backend.git
 cd sistema-incidencias-backend

2. Instalar dependencias
npm install

3. Configurar variables de entorno .env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_clave
DB_NAME=SistemaIncidencias
JWT_SECRET=tu_secreto

4. Ejecutar en modo desarrollo
npm run dev
```
---

# 👨‍💻 Autor

Luciano Marceliano Sebastián Javier
Ingeniero de Sistemas | Full Stack Developer


✅ Este `README.md` lo puedes **usar tal cual y luego mejorar** conforme avances.

---

# 🔹 2. ¿Qué pasa después del botón **Create Pull Request**?

Cuando presionas el botón verde:

1. GitHub te pide un **título** (ya lo pone por defecto con el nombre del commit, pero puedes mejorarlo).
   - Ejemplo: `"docs: agregar README inicial del proyecto"`

2. Hay un cuadro de descripción:  
   - Aquí explicas qué cambios hiciste en esa rama.  
   - Ejemplo:  
     ```
     Este PR agrega un archivo README.md inicial con la descripción del proyecto,
     tecnologías utilizadas, instrucciones de instalación y uso.
     ```

3. Presionas nuevamente el botón verde **Create pull request**.

4. Ahora tu PR está abierto 🚀.  
   - Si trabajaras en equipo, los demás lo revisarían.  
   - Como es tu repo personal, tú mismo puedes **darle "Merge pull request"**.

5. Cuando merges, tus cambios de la rama `feature/swagger-docs` pasan a `main`.

6. Luego puedes **borrar la rama** (GitHub te ofrece un botón para eso, aunque no es obligatorio).

---

## 📌 Resumen:  
- **Pull Request** = una propuesta de cambio.  
- **Merge Pull Request** = aceptar e integrar el cambio en la rama principal.  


