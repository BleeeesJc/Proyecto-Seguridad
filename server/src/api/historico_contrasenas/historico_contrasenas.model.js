// server/src/models/historico_contrasenas.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const HistoricoContrasena = sequelize.define('HistoricoContrasena', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  idusuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  fecha_cambio: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'historico_contrasenas',
  timestamps: false, // porque usamos manualmente fecha_cambio
});

module.exports = HistoricoContrasena;
