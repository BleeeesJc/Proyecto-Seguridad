const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Log = sequelize.define('log', {
  idlog: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  accion: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  medio: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  origen: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  idusuario: {
    type: DataTypes.INTEGER,
    references: {
      model: 'usuario',
      key: 'idusuario',
    },
  },
  codigo: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'logs',
  timestamps: false,
});

module.exports = Log;