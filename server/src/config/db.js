// server/src/config/db.js
const { Sequelize } = require('sequelize');
const config = require('./dotenv');

const sequelize = new Sequelize(config.dbName, config.dbUser, config.dbPassword, {
  host: config.dbHost,
  port: config.dbPort,
  dialect: 'postgres',
  logging: false,
});

module.exports = sequelize;