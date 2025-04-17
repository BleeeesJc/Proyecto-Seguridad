//src/api/detalle_pedido/detalle_pedido.controller.js
const sequelize = require('../../config/db');

// Crear un nuevo detalle de pedido
exports.crearDetallePedido = async (req, res) => {
    const { cantidad, idplato, idpedido, idreserva } = req.body;

    try {
        await sequelize.query(
            `INSERT INTO detalle_pedido (cantidad, idplato, idpedido, idreserva)
             VALUES (:cantidad, :idplato, :idpedido, :idreserva)`,
            {
                replacements: { cantidad, idplato, idpedido, idreserva },
                type: sequelize.QueryTypes.INSERT,
            }
        );

        res.status(201).json({ message: 'Detalle de pedido creado exitosamente' });
    } catch (error) {
        console.error("Error al crear el detalle del pedido:", error);
        res.status(500).json({ error: 'Error al crear el detalle del pedido' });
    }
};

// Obtener todos los detalles de pedido
exports.obtenerDetallesPedido = async (req, res) => {
    try {
        const detalles = await sequelize.query(
            `SELECT dp.iddetalle, dp.cantidad, dp.idplato, dp.idpedido, dp.idreserva, 
                    pl.nombre AS platillo, r.fecha AS reserva_fecha
             FROM detalle_pedido dp
             JOIN platillo pl ON dp.idplato = pl.idplato
             LEFT JOIN reserva r ON dp.idreserva = r.idreserva`,
            { type: sequelize.QueryTypes.SELECT }
        );

        res.json(detalles);
    } catch (error) {
        console.error("Error al obtener los detalles de pedido:", error);
        res.status(500).json({ error: 'Error al obtener los detalles de pedido' });
    }
};

// Actualizar un detalle de pedido
exports.actualizarDetallePedido = async (req, res) => {
    const { id } = req.params;
    const { cantidad, idplato, idpedido, idreserva } = req.body;

    try {
        const [actualizado] = await sequelize.query(
            `UPDATE detalle_pedido 
             SET cantidad = :cantidad, idplato = :idplato, idpedido = :idpedido, idreserva = :idreserva
             WHERE iddetalle = :id`,
            {
                replacements: { id, cantidad, idplato, idpedido, idreserva },
                type: sequelize.QueryTypes.UPDATE,
            }
        );

        if (actualizado) {
            res.json({ message: 'Detalle de pedido actualizado exitosamente' });
        } else {
            res.status(404).json({ error: 'Detalle de pedido no encontrado' });
        }
    } catch (error) {
        console.error("Error al actualizar el detalle del pedido:", error);
        res.status(500).json({ error: 'Error al actualizar el detalle del pedido' });
    }
};

// Eliminar un detalle de pedido
exports.eliminarDetallePedido = async (req, res) => {
    const { id } = req.params;

    try {
        const eliminado = await sequelize.query(
            `DELETE FROM detalle_pedido WHERE iddetalle = :id`,
            { replacements: { id }, type: sequelize.QueryTypes.DELETE }
        );

        if (eliminado) {
            res.status(204).json();
        } else {
            res.status(404).json({ error: 'Detalle de pedido no encontrado' });
        }
    } catch (error) {
        console.error("Error al eliminar el detalle del pedido:", error);
        res.status(500).json({ error: 'Error al eliminar el detalle del pedido' });
    }
};

exports.obtenerDetallesPedidoPorPedido = async (req, res) => {
    const { pedido } = req.query; // Leer el idPedido de los parámetros de consulta

    if (!pedido) {
        return res.status(400).json({ error: 'El parámetro "pedido" es obligatorio.' });
    }

    try {
        const detalles = await sequelize.query(
            `SELECT dp.iddetalle, dp.cantidad, dp.idplato, dp.idpedido, dp.idreserva, 
                    pl.nombre AS platillo, r.fecha AS reserva_fecha
             FROM detalle_pedido dp
             JOIN platillo pl ON dp.idplato = pl.idplato
             LEFT JOIN reserva r ON dp.idreserva = r.idreserva
             WHERE dp.idpedido = :pedido`, // Filtrar por idPedido
            { 
                replacements: { pedido }, // Reemplazar el valor en la consulta
                type: sequelize.QueryTypes.SELECT 
            }
        );

        res.json(detalles);
    } catch (error) {
        console.error("Error al obtener los detalles del pedido:", error);
        res.status(500).json({ error: 'Error al obtener los detalles del pedido' });
    }
};
