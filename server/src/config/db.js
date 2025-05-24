const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

sequelize
  .authenticate()
  .then(() => console.log('✅ DB conectada'))
  .catch(err => console.error('❌ Error al conectar a la base de datos:', err));

module.exports = sequelize;
