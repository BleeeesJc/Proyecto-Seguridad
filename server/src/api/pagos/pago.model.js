const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Pago = sequelize.define('Pago', {
  idpago: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fecha: {
    type: DataTypes.DATE, // Cambiado a DATE
    allowNull: false,
  },
  monto: {
    type: DataTypes.REAL,
    allowNull: false,
  },
  idpedido: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'pedido',
      key: 'idpedido',
    },
  },
  idusuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuario',
      key: 'idusuario',
    },
  },
});

module.exports = Pago;
