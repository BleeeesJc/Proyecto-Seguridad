// server/src/config/dotenv.js
const dotenv = require('dotenv');

// Cargar el archivo .env
dotenv.config();

module.exports = {
  dbName: process.env.DB_NAME,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbPort: process.env.DB_PORT,
  port: process.env.PORT || 5000,
};