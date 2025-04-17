// src/api/platillo.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Platillo = sequelize.define('Platillo', {
  idPlatillo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  idCategoria: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'categoria', // Asegúrate de que esta referencia existe en tu base de datos
      key: 'idCategoria',
    },
  },
  imagen: {
    type: DataTypes.STRING(255), // Longitud para URLs
    allowNull: true, // Opcional si no es obligatorio
  },
  estado: {
    type: DataTypes.INTEGER, // Tipo entero para representar los estados
    defaultValue: 1, // Si lo deseas, puedes asignar un valor por defecto
    allowNull: false, // Si prefieres que siempre tenga un valor
  },
});

module.exports = Platillo;
