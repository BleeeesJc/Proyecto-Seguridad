const sequelize = require('../../config/db');

// Crear un nuevo detalle de pedido
exports.crearDetallePedido = async (req, res, next) => {
    const { cantidad, idplato, idpedido, idreserva } = req.body;
    console.log(`[DetallePedido] Crear | Plato: ${idplato}, Pedido: ${idpedido}, Reserva: ${idreserva}, Cantidad: ${cantidad}`);

    try {
        await sequelize.query(
            `INSERT INTO detalle_pedido (cantidad, idplato, idpedido, idreserva)
             VALUES (:cantidad, :idplato, :idpedido, :idreserva)`,
            {
                replacements: { cantidad, idplato, idpedido, idreserva },
                type: sequelize.QueryTypes.INSERT,
            }
        );

        console.log(`Detalle de pedido creado con éxito | Pedido ID: ${idpedido}`);
        res.status(201).json({ message: 'Detalle de pedido creado exitosamente' });
    } catch (error) {
        next(error);
    }
};

// Obtener todos los detalles de pedido
exports.obtenerDetallesPedido = async (req, res, next) => {
    console.log(`📦 [DetallePedido] Obtener todos`);

    try {
        const detalles = await sequelize.query(
            `SELECT dp.iddetalle, dp.cantidad, dp.idplato, dp.idpedido, dp.idreserva, 
                    pl.nombre AS platillo, r.fecha AS reserva_fecha
             FROM detalle_pedido dp
             JOIN platillo pl ON dp.idplato = pl.idplato
             LEFT JOIN reserva r ON dp.idreserva = r.idreserva`,
            { type: sequelize.QueryTypes.SELECT }
        );

        console.log(`Detalles de pedido obtenidos (${detalles.length} registros)`);
        res.json(detalles);
    } catch (error) {
        next(error);
    }
};

// Actualizar un detalle de pedido
exports.actualizarDetallePedido = async (req, res, next) => {
    const { id } = req.params;
    const { cantidad, idplato, idpedido, idreserva } = req.body;
    console.log(`🔧 [DetallePedido] Actualizar | ID: ${id}`);

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
            console.log(`Detalle de pedido actualizado | ID: ${id}`);
            res.json({ message: 'Detalle de pedido actualizado exitosamente' });
        } else {
            console.warn(`Detalle de pedido no encontrado | ID: ${id}`);
            res.status(404).json({ error: 'Detalle de pedido no encontrado' });
        }
    } catch (error) {
        next(error);
    }
};

// Eliminar un detalle de pedido
exports.eliminarDetallePedido = async (req, res, next) => {
    const { id } = req.params;
    console.log(`[DetallePedido] Eliminar | ID: ${id}`);

    try {
        const eliminado = await sequelize.query(
            `DELETE FROM detalle_pedido WHERE iddetalle = :id`,
            { replacements: { id }, type: sequelize.QueryTypes.DELETE }
        );

        if (eliminado) {
            console.log(`Detalle de pedido eliminado | ID: ${id}`);
            res.status(204).json();
        } else {
            console.warn(`⚠️ Detalle de pedido no encontrado para eliminar | ID: ${id}`);
            res.status(404).json({ error: 'Detalle de pedido no encontrado' });
        }
    } catch (error) {
        next(error);
    }
};

// Obtener detalles por ID de pedido
exports.obtenerDetallesPedidoPorPedido = async (req, res, next) => {
    const { pedido } = req.query;

    if (!pedido) {
        console.warn('Falta parámetro obligatorio "pedido"');
        return res.status(400).json({ error: 'El parámetro "pedido" es obligatorio.' });
    }

    console.log(`[DetallePedido] Obtener por pedido | Pedido ID: ${pedido}`);

    try {
        const detalles = await sequelize.query(
            `SELECT dp.iddetalle, dp.cantidad, dp.idplato, dp.idpedido, dp.idreserva, 
                    pl.nombre AS platillo, r.fecha AS reserva_fecha
             FROM detalle_pedido dp
             JOIN platillo pl ON dp.idplato = pl.idplato
             LEFT JOIN reserva r ON dp.idreserva = r.idreserva
             WHERE dp.idpedido = :pedido`,
            {
                replacements: { pedido },
                type: sequelize.QueryTypes.SELECT
            }
        );

        console.log(`Detalles por pedido obtenidos | Pedido ID: ${pedido} | Registros: ${detalles.length}`);
        res.json(detalles);
    } catch (error) {
        next(error);
    }
};
