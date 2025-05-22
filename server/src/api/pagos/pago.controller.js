const sequelize = require('../../config/db');

// Controlador: Crear un nuevo pago y actualizar el estado del pedido
exports.crearPago = async (req, res) => {
    const { idpedido, idusuario, monto } = req.body;
    const fecha = new Date();
    console.log(`💳 [Pago] Crear | Pedido: ${idpedido}, Usuario: ${idusuario}, Monto: ${monto}, Fecha: ${fecha.toISOString()}`);

    const transaction = await sequelize.transaction();
    try {
        const [pedido] = await sequelize.query(
            `SELECT estado FROM pedido WHERE idpedido = :idpedido`,
            {
                replacements: { idpedido },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        if (!pedido) {
            console.warn(`[Pago] Pedido no encontrado | ID: ${idpedido}`);
            throw new Error('Pedido no encontrado');
        }

        if (pedido.estado === 1) {
            console.warn(`[Pago] Pedido ya pagado | ID: ${idpedido}`);
            throw new Error('El pedido ya ha sido pagado');
        }

        await sequelize.query(
            `INSERT INTO pago (idpedido, idusuario, monto, fecha)
             VALUES (:idpedido, :idusuario, :monto, :fecha)`,
            {
                replacements: { idpedido, idusuario, monto, fecha },
                type: sequelize.QueryTypes.INSERT,
                transaction,
            }
        );
        console.log(`[Pago] Registro de pago insertado | Pedido: ${idpedido}`);

        await sequelize.query(
            `UPDATE pedido SET estado = 1 WHERE idpedido = :idpedido`,
            {
                replacements: { idpedido },
                type: sequelize.QueryTypes.UPDATE,
                transaction,
            }
        );
        console.log(`[Pago] Estado de pedido actualizado a PAGADO | Pedido: ${idpedido}`);

        await transaction.commit();
        console.log(`[Pago] Transacción completada | Pedido: ${idpedido}`);
        res.status(201).json({ message: 'Pago creado y pedido actualizado exitosamente' });
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

// Obtener todos los pagos
exports.obtenerPagos = async (req, res) => {
    console.log('[Pago] Obtener todos los pagos');
    try {
        const pagos = await sequelize.query(
            `SELECT p.idpago, p.monto, p.fecha, p.idpedido, p.idusuario, 
                    u.nombre AS usuario, ped.fecha AS fecha_pedido
             FROM pago p
             JOIN usuario u ON p.idusuario = u.idusuario
             JOIN pedido ped ON p.idpedido = ped.idpedido`,
            { type: sequelize.QueryTypes.SELECT }
        );
        console.log(`[Pago] Pagos obtenidos: ${pagos.length}`);
        res.json(pagos);
    } catch (error) {
        next(error);
    }
};

// Actualizar un pago
exports.actualizarPago = async (req, res) => {
    const { id } = req.params;
    const { idpedido, idusuario, monto, fecha } = req.body;
    console.log(`[Pago] Actualizar | Pago ID: ${id}, Pedido: ${idpedido}, Usuario: ${idusuario}, Monto: ${monto}`);

    try {
        const [actualizado] = await sequelize.query(
            `UPDATE pago 
             SET idpedido = :idpedido, idusuario = :idusuario, monto = :monto, fecha = :fecha
             WHERE idpago = :id`,
            {
                replacements: { id, idpedido, idusuario, monto, fecha },
                type: sequelize.QueryTypes.UPDATE,
            }
        );

        if (actualizado) {
            console.log(`[Pago] Pago actualizado | Pago ID: ${id}`);
            res.json({ message: 'Pago actualizado exitosamente' });
        } else {
            console.warn(`⚠️ [Pago] Pago no encontrado para actualizar | Pago ID: ${id}`);
            res.status(404).json({ error: 'Pago no encontrado' });
        }
    } catch (error) {
        next(error);
    }
};

// Eliminar un pago
exports.eliminarPago = async (req, res) => {
    const { id } = req.params;
    console.log(`🗑️ [Pago] Eliminar | Pago ID: ${id}`);

    try {
        const eliminado = await sequelize.query(
            `DELETE FROM pago WHERE idpago = :id`,
            { replacements: { id }, type: sequelize.QueryTypes.DELETE }
        );

        if (eliminado) {
            console.log(`[Pago] Pago eliminado | Pago ID: ${id}`);
            res.status(204).json();
        } else {
            console.warn(`[Pago] Pago no encontrado para eliminar | Pago ID: ${id}`);
            res.status(404).json({ error: 'Pago no encontrado' });
        }
    } catch (error) {
        next(error);
    }
};
