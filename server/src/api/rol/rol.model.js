// server/src/api/rol/rol.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Rol = sequelize.define('Rol', {
  idrol: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {  // <-- CAMBIADO: era "rol", debe ser "nombre"
    type: DataTypes.STRING(25),
    allowNull: false
  },
  pagos: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  reservas: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  menu: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  ofertas: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  usuarios: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  platillos: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  mesas: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  paneladmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  roles: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  reportes: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
}, {
  tableName: 'rol', // nombre exacto de la tabla en la base de datos
  timestamps: false
});

module.exports = Rol;
