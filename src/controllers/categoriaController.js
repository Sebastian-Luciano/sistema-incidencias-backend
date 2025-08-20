import { 
    obtenerCategorias,
    obtenerCategoriaPorId,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
    categoriaEnUso
} from "../models/categoriaModel.js";

// GET todas
export const getCategorias = async (req, res) => {
    try {
        const categorias = await obtenerCategorias();
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener categorias", error });
    }
};

//GET por ID
export const getCategoria = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (Number.isNaN(id)) return res.status(400).json({ mensaje: "ID inválido" });

        const categoria = await obtenerCategoriaPorId(id);
        if (!categoria) {
            return res.status(404).json({ mensaje: "Categoria no encontrada" });
        }
        res.json(categoria);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener la categoria", error });
    }
};

// POST: crear
export const postCategoria = async (req, res) => {
    try {
        const { nombre } = req.body;
        if (!nombre) return res.status(400).json({ mensaje: "Falta el nombre" });

        const nuevaCategoria = await crearCategoria(nombre);
        res.status(201).json(nuevaCategoria);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al crear categoria", error });
    }
};

//PUT: actualizar
export const putCategoria = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const {nombre} = req.body;
        if (Number.isNaN(id)) return res.status(400).json({ mensaje: "IDinválido" });
        if (!nombre) return res.status(400).json({ mensaje: "Falta el nombre"});

        const actualizado = await actualizarCategoria(id, nombre);
        if (!actualizado) {
            return res.status(404).json({ mensaje: "Categoria no encontrada" });
        }
        res.json({ mensaje: "Categoria actualizada correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar categoria", error });
    }
};

// DELETE: eliminar
export const deleteCategoria = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);

        // Validar si el ID es un número válido
        if (Number.isNaN(id)) return res.status(400).json({ mensaje: "ID inválido. Debe ser un númrro" });

        // Validar si la categoria está en uso
        if (await categoriaEnUso(id)) return res.status(409).json({ mensaje: "No se puede eliminar la categoria por que está asociada a una incidencia."});
        
        // Intentar eliminar
        const eliminado = await eliminarCategoria(id);

        // Verificar si la categoría existía
        if (!eliminado) {
            return res.status(404).json({ mensaje: "Categoría no encontrada" });
        }

        // Respuesta exitosa
        res.json({ mensaje: "Categoría eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar categoria", error });
    }
};