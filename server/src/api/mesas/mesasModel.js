const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Mesa = sequelize.define('Mesa', {
  idmesa: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true, // Corresponde al SERIAL en la tabla
  },
  capacidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  nombre: {
    type: DataTypes.STRING(255),
    allowNull: false, 
  },
  posx: {
    type: DataTypes.FLOAT,
    allowNull: false, // Opcional, se puede dejar `allowNull: true` para que permita valores nulos
  },
  posy: {
    type: DataTypes.FLOAT,
    allowNull: false, // Opcional, se puede dejar `allowNull: true` para que permita valores nulos
  },
  visible: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  }
}, 
{
  timestamps: false, // Desactiva createdAt y updatedAt
  tableName: 'mesa' // Asegura que el nombre de la tabla sea correcto
});

module.exports = Mesa;
