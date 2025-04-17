// src/api/categorias/categoria.controller.js
const sequelize = require('../../config/db');

// Crear una nueva categoría
exports.crearCategoria = async (req, res) => {
    const { tipo, descripcion } = req.body;

    try {
        await sequelize.query(
            `INSERT INTO categoria (tipo, descripcion)
             VALUES (:tipo, :descripcion)`,
            {
                replacements: { tipo, descripcion },
                type: sequelize.QueryTypes.INSERT,
            }
        );
        res.status(201).json({ message: 'Categoría creada exitosamente' });
    } catch (error) {
        console.error("Error al crear la categoría:", error);
        res.status(500).json({ error: 'Error al crear la categoría', details: error.message });
    }
};

// Obtener todas las categorías
exports.obtenerCategorias = async (req, res) => {
    try {
        const categorias = await sequelize.query(
            `SELECT * FROM categoria`,
            { type: sequelize.QueryTypes.SELECT }
        );
        res.json(categorias);
    } catch (error) {
        console.error("Error al obtener las categorías:", error);
        res.status(500).json({ error: 'Error al obtener las categorías' });
    }
};

// Actualizar una categoría
exports.actualizarCategoria = async (req, res) => {
    const { id } = req.params;
    const { tipo, descripcion } = req.body;

    try {
        const [actualizado] = await sequelize.query(
            `UPDATE categoria SET tipo = :tipo, descripcion = :descripcion
             WHERE idcategoria = :id`,
            {
                replacements: { id, tipo, descripcion },
                type: sequelize.QueryTypes.UPDATE,
            }
        );

        if (actualizado) {
            res.json({ message: 'Categoría actualizada exitosamente' });
        } else {
            res.status(404).json({ error: 'Categoría no encontrada' });
        }
    } catch (error) {
        console.error("Error al actualizar la categoría:", error);
        res.status(500).json({ error: 'Error al actualizar la categoría' });
    }
};

// Eliminar una categoría
exports.eliminarCategoria = async (req, res) => {
    const { id } = req.params;

    try {
        const eliminado = await sequelize.query(
            `DELETE FROM categoria WHERE idcategoria = :id`,
            {
                replacements: { id },
                type: sequelize.QueryTypes.DELETE,
            }
        );

        if (eliminado) {
            res.status(204).json();
        } else {
            res.status(404).json({ error: 'Categoría no encontrada' });
        }
    } catch (error) {
        console.error("Error al eliminar la categoría:", error);
        res.status(500).json({ error: 'Error al eliminar la categoría' });
    }
};
