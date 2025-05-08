// src/api/rol.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Rol = sequelize.define('Rol', {
  idrol: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  rol: {
    type: DataTypes.STRING(25),
    allowNull: false,
  },
  asignacionroles: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  dashboard: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  ofertas: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  usuarios: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  platillos: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  pedidos: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  reservas: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  mapainteractivo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  ofertacliente: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  pedidocliente: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  mapacliente: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  menucliente: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, {
  timestamps: false,
  tableName: 'rol'
});

module.exports = Rol;