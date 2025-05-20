// src/api/categorias/categoria.controller.js
const sequelize = require('../../config/db');

// Crear una nueva categoría
exports.crearCategoria = async (req, res) => {
    const { tipo, descripcion } = req.body;
    console.log(`Crear categoría | Tipo: ${tipo}, Descripción: ${descripcion}`);

    try {
        await sequelize.query(
            `INSERT INTO categoria (tipo, descripcion)
             VALUES (:tipo, :descripcion)`,
            {
                replacements: { tipo, descripcion },
                type: sequelize.QueryTypes.INSERT,
            }
        );
        console.log(`Categoría creada exitosamente | Tipo: ${tipo}`);
        res.status(201).json({ message: 'Categoría creada exitosamente' });
    } catch (error) {
        console.error(`Error al crear la categoría | Tipo: ${tipo} | ${error.message}`);
        res.status(500).json({ error: 'Error al crear la categoría', details: error.message });
    }
};

// Obtener todas las categorías
exports.obtenerCategorias = async (req, res) => {
    console.log('Obtener todas las categorías');

    try {
        const categorias = await sequelize.query(
            `SELECT * FROM categoria`,
            { type: sequelize.QueryTypes.SELECT }
        );

        console.log(`Categorías obtenidas: ${categorias.length}`);
        res.json(categorias);
    } catch (error) {
        console.error(`Error al obtener las categorías: ${error.message}`);
        res.status(500).json({ error: 'Error al obtener las categorías' });
    }
};

// Actualizar una categoría
exports.actualizarCategoria = async (req, res) => {
    const { id } = req.params;
    const { tipo, descripcion } = req.body;

    console.log(`Actualizar categoría | ID: ${id}, Tipo: ${tipo}, Descripción: ${descripcion}`);

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
            console.log(`Categoría actualizada | ID: ${id}`);
            res.json({ message: 'Categoría actualizada exitosamente' });
        } else {
            console.warn(`Categoría no encontrada para actualizar | ID: ${id}`);
            res.status(404).json({ error: 'Categoría no encontrada' });
        }
    } catch (error) {
        console.error(`Error al actualizar la categoría | ID: ${id} | ${error.message}`);
        res.status(500).json({ error: 'Error al actualizar la categoría' });
    }
};

// Eliminar una categoría
exports.eliminarCategoria = async (req, res) => {
    const { id } = req.params;
    console.log(`📥 Eliminar categoría | ID: ${id}`);

    try {
        const eliminado = await sequelize.query(
            `DELETE FROM categoria WHERE idcategoria = :id`,
            {
                replacements: { id },
                type: sequelize.QueryTypes.DELETE,
            }
        );

        if (eliminado) {
            console.log(`Categoría eliminada | ID: ${id}`);
            res.status(204).json();
        } else {
            console.warn(`Categoría no encontrada para eliminar | ID: ${id}`);
            res.status(404).json({ error: 'Categoría no encontrada' });
        }
    } catch (error) {
        console.error(`Error al eliminar la categoría | ID: ${id} | ${error.message}`);
        res.status(500).json({ error: 'Error al eliminar la categoría' });
    }
};
