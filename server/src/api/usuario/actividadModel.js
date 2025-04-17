const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Actividad = sequelize.define('Actividad', {
  idactividad: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true, // Corresponde al SERIAL en la tabla
  },
  usuario: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, // Corresponde a TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  },
  estado: {
    type: DataTypes.STRING(50),
    allowNull: true, // Opcional, se puede dejar `allowNull: true` para que permita valores nulos
  }
}, 
{
  timestamps: false, // Desactiva createdAt y updatedAt
  tableName: 'actividades' // Asegura que el nombre de la tabla sea correcto
});

module.exports = Actividad;
