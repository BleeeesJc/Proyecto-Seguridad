// src/api/usuario.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const Rol = require('../rol/rol.model'); 

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
    defaultValue: 5, ///Rol por defecto
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

Usuario.belongsTo(Rol, {
  foreignKey: 'idrol',
  as: 'rol' // 
});

module.exports = Usuario;
