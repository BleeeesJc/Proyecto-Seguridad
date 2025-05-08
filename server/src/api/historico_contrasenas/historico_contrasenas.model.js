// server/src/api/historico_contrasenas/historico_contrasenas.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const HistoricoContrasenas = sequelize.define('HistoricoContrasenas', {
  idhistorico: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idusuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  fecha_cambio: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'historico_contrasenas',
  timestamps: false
});

module.exports = HistoricoContrasenas;
