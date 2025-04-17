//src/api/detalle_pedido/detalle_pedido.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const DetallePedido = sequelize.define('DetallePedido', {
  idDetalle: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  idPlato: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'platillo',
      key: 'idplato',
    },
  },
  idPedido: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'pedido',
      key: 'idpedido',
    },
  },
  idReserva: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'reserva',
      key: 'idreserva',
    },
  },
});

module.exports = DetallePedido;
