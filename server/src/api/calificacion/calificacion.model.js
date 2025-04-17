const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Calificacion = sequelize.define('Resenia', {
  idresenia: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  puntuacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW, 
  },
  idusuario: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'usuario',
      key: 'idusuario',
    },
  },
  idplato: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'platillo',
      key: 'idplato',
    },
  },
});

module.exports = Calificacion;
