//src/api/pedidos/pedido.controller.js
const sequelize = require('../../config/db');

exports.crearPedido = async (req, res) => {
  const { fecha, hora, estado, idusuario, precio_total, detalles } = req.body;

  if (!detalles || detalles.length === 0) {
    return res.status(400).json({ error: "Debe seleccionar al menos un platillo." });
  }

  try {
    // Insertar pedido
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
      throw new Error("No se pudo obtener el ID del pedido generado.");
    }

    // Array para guardar los detalles completos del pedido
    const detallesCompletos = [];

    for (const detalle of detalles) {
      const { idplato, cantidad } = detalle;

      if (!idplato || !cantidad) {
        throw new Error("Los detalles del pedido deben incluir idplato y cantidad.");
      }

      // Obtener información completa del platillo
      const [platilloInfo] = await sequelize.query(
        `SELECT nombre, precio FROM platillo WHERE idplato = :idplato`,
        {
          replacements: { idplato },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      // Insertar detalle del pedido
      await sequelize.query(
        `INSERT INTO detalle_pedido (idplato, cantidad, idpedido, idreserva)
         VALUES (:idplato, :cantidad, :idpedido, NULL)`,
        {
          replacements: { idplato, cantidad, idpedido },
          type: sequelize.QueryTypes.INSERT,
        }
      );

      // Agregar información completa al array de detalles
      detallesCompletos.push({
        nombre: platilloInfo.nombre,
        cantidad: cantidad,
        precio: platilloInfo.precio
      });
    }

    // Enviar respuesta con información del pedido y detalles
    res.status(201).json({
      message: "Pedido creado exitosamente",
      idpedido,
      idusuario,
      precio_total,
      detalles: detallesCompletos
    });
  } catch (error) {
    console.error("Error al crear el pedido:", error);
    res.status(500).json({ error: "Error al crear el pedido." });
  }
};

exports.obtenerPedidos = async (req, res) => {
  try {
    const pedidos = await sequelize.query(
      `SELECT p.idpedido, p.fecha, p.hora, p.estado, p.precio_total, u.nombre AS usuario
       FROM pedido p
       JOIN usuario u ON p.idusuario = u.idusuario`,
      { type: sequelize.QueryTypes.SELECT }
    );

    res.json(pedidos);
  } catch (error) {
    console.error("Error al obtener los pedidos:", error);
    res.status(500).json({ error: 'Error al obtener los pedidos' });
  }
};

exports.actualizarPedido = async (req, res) => {
  const { id } = req.params;
  const { fecha, hora, estado, idusuario, precio_total } = req.body;

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
      res.json({ message: 'Pedido actualizado exitosamente' });
    } else {
      res.status(404).json({ error: 'Pedido no encontrado' });
    }
  } catch (error) {
    console.error("Error al actualizar el pedido:", error);
    res.status(500).json({ error: 'Error al actualizar el pedido' });
  }
};

exports.eliminarPedido = async (req, res) => {
  const { id } = req.params;

  try {
    const eliminado = await sequelize.query(
      `DELETE FROM pedido WHERE idpedido = :id`,
      { replacements: { id }, type: sequelize.QueryTypes.DELETE }
    );

    if (eliminado) {
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Pedido no encontrado' });
    }
  } catch (error) {
    console.error("Error al eliminar el pedido:", error);
    res.status(500).json({ error: 'Error al eliminar el pedido' });
  }
};

// Cambia el estado de un pedido a entregado (1)
exports.entregarPedido = async (req, res) => {
  const { id } = req.params;

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
      res.json({ message: 'Pedido entregado exitosamente' });
    } else {
      res.status(404).json({ error: 'Pedido no encontrado' });
    }
  } catch (error) {
    console.error("Error al entregar el pedido:", error);
    res.status(500).json({ error: 'Error al entregar el pedido' });
  }
};

// Cambia el estado de un pedido a cancelado (2)
exports.cancelarPedido = async (req, res) => {
  const { id } = req.params;

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
      res.json({ message: 'Pedido cancelado exitosamente' });
    } else {
      res.status(404).json({ error: 'Pedido no encontrado' });
    }
  } catch (error) {
    console.error("Error al cancelar el pedido:", error);
    res.status(500).json({ error: 'Error al cancelar el pedido' });
  }
};

// Cambia el estado de un pedido a pagado (3)
exports.registrarPagoPedido = async (req, res) => {
  const { id } = req.params;
  console.log("Registrando pago para el pedido ID:", id);

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
      res.json({ message: 'Pedido pagado exitosamente' });
    } else {
      res.status(404).json({ error: 'Pedido no encontrado' });
    }
  } catch (error) {
    console.error("Error al pagar el pedido:", error);
    res.status(500).json({ error: 'Error al pagar el pedido' });
  }
};

exports.obtenerPedidosPorUsuario = async (req, res) => {
  const { idUsuario } = req.params;

  if (!idUsuario) {
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

    res.json(pedidos);
  } catch (error) {
    console.error('Error al obtener los pedidos por usuario:', error);
    res.status(500).json({ error: 'Error al obtener los pedidos.' });
  }
};
