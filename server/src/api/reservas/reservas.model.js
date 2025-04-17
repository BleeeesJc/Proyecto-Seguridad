// src/api/reserva.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Reserva = sequelize.define('Reserva', {
  idReserva: {
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
      key: 'idUsuario',
    },
  },
  idMesa: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'mesa',
      key: 'idMesa',
    },
  },
});

module.exports = Reserva;
