//src/api/pedido/pedido.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Pedido = sequelize.define('Pedido', {
  idPedido: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  hora: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  estado: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  idUsuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuario',
      key: 'idusuario',
    },
  },
  precioTotal: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

module.exports = Pedido;
