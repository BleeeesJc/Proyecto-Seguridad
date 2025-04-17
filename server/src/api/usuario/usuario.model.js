// src/api/usuario.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Usuario = sequelize.define('Usuario', {
  idusuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  apellidos: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  correo: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  idrol: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'rol',
      key: 'idrol',
    },
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true, // Asegura que el valor por defecto sea `true`
  },
}, {
  timestamps: false, // Desactiva createdAt y updatedAt
  tableName: 'usuario'
});

module.exports = Usuario;
