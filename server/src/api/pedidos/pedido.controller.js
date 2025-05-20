// src/api/pedidos/pedido.controller.js
const sequelize = require('../../config/db');

exports.crearPedido = async (req, res) => {
  const { fecha, hora, estado, idusuario, precio_total, detalles } = req.body;
  console.log(`[Pedido] Crear | Usuario: ${idusuario}, Fecha: ${fecha} ${hora}, Total: ${precio_total}, Ítems: ${detalles?.length}`);

  if (!detalles || detalles.length === 0) {
    console.warn('[Pedido] Intento de crear sin detalles');
    return res.status(400).json({ error: "Debe seleccionar al menos un platillo." });
  }

  try {
    const [result] = await sequelize.query(
      `INSERT INTO pedido (fecha, hora, estado, idusuario, precio_total)
       VALUES (:fecha, :hora, :estado, :idusuario, :precio_total) RETURNING idpedido`,
      {
        replacements: { fecha, hora, estado, idusuario, precio_total },
        type: sequelize.QueryTypes.INSERT,
      }
    );

    const idpedido = result[0]?.idpedido;
    if (!idpedido) {
      console.error('[Pedido] No se obtuvo ID tras inserción');
      throw new Error("No se pudo obtener el ID del pedido generado.");
    }
    console.log(`[Pedido] Pedido creado | ID: ${idpedido}`);

    const detallesCompletos = [];

    for (const detalle of detalles) {
      const { idplato, cantidad } = detalle;
      console.log(`[Pedido] Agregar detalle | Pedido: ${idpedido}, Plato: ${idplato}, Cantidad: ${cantidad}`);

      if (!idplato || !cantidad) {
        console.warn('[Pedido] Detalle inválido sin idplato o cantidad');
        throw new Error("Los detalles del pedido deben incluir idplato y cantidad.");
      }

      const [platilloInfo] = await sequelize.query(
        `SELECT nombre, precio FROM platillo WHERE idplato = :idplato`,
        {
          replacements: { idplato },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      await sequelize.query(
        `INSERT INTO detalle_pedido (idplato, cantidad, idpedido, idreserva)
         VALUES (:idplato, :cantidad, :idpedido, NULL)`,
        {
          replacements: { idplato, cantidad, idpedido },
          type: sequelize.QueryTypes.INSERT,
        }
      );
      console.log(`[Pedido] Detalle insertado | Pedido: ${idpedido}, Plato: ${idplato}`);

      detallesCompletos.push({
        nombre: platilloInfo.nombre,
        cantidad,
        precio: platilloInfo.precio
      });
    }

    console.log(`[Pedido] Todos los detalles agregados | Pedido: ${idpedido}`);
    res.status(201).json({
      message: "Pedido creado exitosamente",
      idpedido,
      idusuario,
      precio_total,
      detalles: detallesCompletos
    });
  } catch (error) {
    console.error(`[Pedido] Error al crear el pedido | ${error.message}`);
    res.status(500).json({ error: "Error al crear el pedido." });
  }
};

exports.obtenerPedidos = async (req, res) => {
  console.log('[Pedido] Obtener todos');
  try {
    const pedidos = await sequelize.query(
      `SELECT p.idpedido, p.fecha, p.hora, p.estado, p.precio_total, u.nombre AS usuario
       FROM pedido p
       JOIN usuario u ON p.idusuario = u.idusuario`,
      { type: sequelize.QueryTypes.SELECT }
    );
    console.log(`[Pedido] Pedidos obtenidos: ${pedidos.length}`);
    res.json(pedidos);
  } catch (error) {
    console.error(`[Pedido] Error al obtener los pedidos | ${error.message}`);
    res.status(500).json({ error: 'Error al obtener los pedidos' });
  }
};

exports.actualizarPedido = async (req, res) => {
  const { id } = req.params;
  const { fecha, hora, estado, idusuario, precio_total } = req.body;
  console.log(`[Pedido] Actualizar | ID: ${id}`);

  try {
    const [actualizado] = await sequelize.query(
      `UPDATE pedido 
       SET fecha = :fecha, hora = :hora, estado = :estado, idusuario = :idusuario, precio_total = :precio_total
       WHERE idpedido = :id`,
      {
        replacements: { id, fecha, hora, estado, idusuario, precio_total },
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    if (actualizado) {
      console.log(`[Pedido] Pedido actualizado | ID: ${id}`);
      res.json({ message: 'Pedido actualizado exitosamente' });
    } else {
      console.warn(`[Pedido] Pedido no encontrado para actualizar | ID: ${id}`);
      res.status(404).json({ error: 'Pedido no encontrado' });
    }
  } catch (error) {
    console.error(`[Pedido] Error al actualizar el pedido | ${error.message}`);
    res.status(500).json({ error: 'Error al actualizar el pedido' });
  }
};

exports.eliminarPedido = async (req, res) => {
  const { id } = req.params;
  console.log(`[Pedido] Eliminar | ID: ${id}`);

  try {
    const eliminado = await sequelize.query(
      `DELETE FROM pedido WHERE idpedido = :id`,
      { replacements: { id }, type: sequelize.QueryTypes.DELETE }
    );

    if (eliminado) {
      console.log(`[Pedido] Pedido eliminado | ID: ${id}`);
      res.status(204).json();
    } else {
      console.warn(`[Pedido] Pedido no encontrado para eliminar | ID: ${id}`);
      res.status(404).json({ error: 'Pedido no encontrado' });
    }
  } catch (error) {
    console.error(`[Pedido] Error al eliminar el pedido | ${error.message}`);
    res.status(500).json({ error: 'Error al eliminar el pedido' });
  }
};

// Cambia el estado de un pedido a entregado (1)
exports.entregarPedido = async (req, res) => {
  const { id } = req.params;
  console.log(`[Pedido] Entregar | ID: ${id}`);

  try {
    const [actualizado] = await sequelize.query(
      `UPDATE pedido 
       SET estado = 1
       WHERE idpedido = :id`,
      {
        replacements: { id },
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    if (actualizado) {
      console.log(`[Pedido] Pedido entregado | ID: ${id}`);
      res.json({ message: 'Pedido entregado exitosamente' });
    } else {
      console.warn(`[Pedido] Pedido no encontrado para entregar | ID: ${id}`);
      res.status(404).json({ error: 'Pedido no encontrado' });
    }
  } catch (error) {
    console.error(`[Pedido] Error al entregar el pedido | ${error.message}`);
    res.status(500).json({ error: 'Error al entregar el pedido' });
  }
};

// Cambia el estado de un pedido a cancelado (2)
exports.cancelarPedido = async (req, res) => {
  const { id } = req.params;
  console.log(`[Pedido] Cancelar | ID: ${id}`);

  try {
    const [actualizado] = await sequelize.query(
      `UPDATE pedido 
       SET estado = 2
       WHERE idpedido = :id`,
      {
        replacements: { id },
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    if (actualizado) {
      console.log(`[Pedido] Pedido cancelado | ID: ${id}`);
      res.json({ message: 'Pedido cancelado exitosamente' });
    } else {
      console.warn(`[Pedido] Pedido no encontrado para cancelar | ID: ${id}`);
      res.status(404).json({ error: 'Pedido no encontrado' });
    }
  } catch (error) {
    console.error(`[Pedido] Error al cancelar el pedido | ${error.message}`);
    res.status(500).json({ error: 'Error al cancelar el pedido' });
  }
};

// Cambia el estado de un pedido a pagado (3)
exports.registrarPagoPedido = async (req, res) => {
  const { id } = req.params;
  console.log(`[Pedido] Registrar pago | ID: ${id}`);

  try {
    const [actualizado] = await sequelize.query(
      `UPDATE pedido 
       SET estado = 3
       WHERE idpedido = :id`,
      {
        replacements: { id },
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    if (actualizado) {
      console.log(`[Pedido] Pedido marcado como pagado | ID: ${id}`);
      res.json({ message: 'Pedido pagado exitosamente' });
    } else {
      console.warn(`[Pedido] Pedido no encontrado para registrar pago | ID: ${id}`);
      res.status(404).json({ error: 'Pedido no encontrado' });
    }
  } catch (error) {
    console.error(`[Pedido] Error al pagar el pedido | ${error.message}`);
    res.status(500).json({ error: 'Error al pagar el pedido' });
  }
};

exports.obtenerPedidosPorUsuario = async (req, res) => {
  const { idUsuario } = req.params;
  console.log(`[Pedido] Obtener por usuario | Usuario: ${idUsuario}`);

  if (!idUsuario) {
    console.warn('[Pedido] Falta idUsuario en parámetros');
    return res.status(400).json({ error: 'El idUsuario es obligatorio.' });
  }

  try {
    const pedidos = await sequelize.query(
      `SELECT p.idpedido, p.fecha, p.hora, p.estado, p.precio_total
       FROM pedido p
       WHERE p.idusuario = :idUsuario`,
      {
        replacements: { idUsuario },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    console.log(`[Pedido] Pedidos obtenidos para usuario ${idUsuario}: ${pedidos.length}`);
    res.json(pedidos);
  } catch (error) {
    console.error(`[Pedido] Error al obtener pedidos por usuario | ${error.message}`);
    res.status(500).json({ error: 'Error al obtener los pedidos.' });
  }
};
