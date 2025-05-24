// server/src/config/db.js
const { Sequelize } = require('sequelize');

// Si existe DATABASE_URL, lo usamos; si no, caemos en modo "local"
const connectionString = process.env.DATABASE_URL;

const sequelize = connectionString
  ? new Sequelize(connectionString, {
      dialect: 'postgres',
      protocol: 'postgres',
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    })
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: false
      }
    );

sequelize
  .authenticate()
  .then(() => console.log('✅ DB conectada'))
  .catch(err => console.error('❌ Error al conectar a la base de datos:', err));

module.exports = sequelize;
