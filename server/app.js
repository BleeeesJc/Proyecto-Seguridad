const express = require('express');
const sequelize = require('./src/config/db');
const cors = require('cors');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();

app.disable('x-powered-by');

app.use(express.json());

// Seguridad CSP manual
const cspHeaderValue = "default-src 'self' data:; " +
  "script-src 'self' https://www.google.com https://www.gstatic.com; " +
  "style-src 'self' https://fonts.googleapis.com https://cdn.jsdelivr.net; " +
  "img-src 'self' https://images.pexels.com https://cdn.hellofresh.com https://i.pinimg.com https://media.citybeat.com https://www.agoda.com https://images.unsplash.com https://mir-s3-cdn-cf.behance.net https://img.icons8.com https://www.gstatic.com https://www.google.com data:; " +
  "connect-src 'self' ws://172.18.4.101:8081 http://localhost:5000 data: https://www.google.com; " +
  "font-src 'self' https://fonts.gstatic.com data:; " +
  "object-src 'none'; " +
  "frame-ancestors 'none'; " +
  "frame-src https://www.google.com https://www.gstatic.com; " +
  "form-action 'self'; " +
  "base-uri 'self';";

const allowedOrigins = ['http://localhost:8081', 'http://localhost:5000'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', cspHeaderValue);
  next();
});

app.use('/api', cors(corsOptions));

const blockedPaths = ['.hg', '.bzr', '._darcs', 'bitkeeper'];

app.use((req, res, next) => {
  const urlPath = req.path.toLowerCase();
  const isBlocked = blockedPaths.some(p => urlPath.startsWith(`/${p}`));

  if (isBlocked) {
    return res.status(403).send('Access Denied');
  }

  next();
});

app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=()');
  next();
});

// API routes
const ofertasRoutes = require('./src/api/ofertas/oferta.routes');
const usuarioRoutes = require('./src/api/usuario/usuario.routes');
const authRoutes = require('./src/api/autenticacion/authRoutes');
const actividadRoutes = require('./src/api/usuario/actividadRoutes');
const mesasRoutes = require('./src/api/mesas/mesasRoutes');
const categoriasRoutes = require('./src/api/categorias/categoria.routes');
const reservaRoutes = require('./src/api/reservas/reservas.routes');
const pedidosRoutes = require('./src/api/pedidos/pedido.routes');
const detalle_pedidoRoutes = require('./src/api/detalle_pedido/detalle_pedido.routes');
const pagosRoutes = require('./src/api/pagos/pago.routes');
const dashboardRoutes = require('./src/api/dashboard/dashboard.routes');
const rolRoutes = require('./src/api/rol/rol.routes');
const platillosRoutes = require('./src/api/platillos/platillo.routes');
const calificacionRoutes = require('./src/api/calificacion/calificacion.routes');

app.use('/api/ofertas', ofertasRoutes);
app.use('/api/rol', rolRoutes);
app.use('/api/platillos', platillosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/usuario', usuarioRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reservas', reservaRoutes);
app.use('/api/actividad', actividadRoutes);
app.use('/api/mesas', mesasRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/detalle_pedido', detalle_pedidoRoutes);
app.use('/api/pagos', pagosRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/calificaciones', calificacionRoutes);

// Archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/css', express.static(path.join(__dirname, 'dist/css')));

app.use(
  express.static(path.join(__dirname, 'dist'), {
    setHeaders: (res, path) => {
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8081');
    },
  })
);


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.get('/favicon.ico', cors(corsOptions), (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'favicon.ico'));
});

// Errores
app.use((req, res) => {
  res.status(404).send(`Cannot GET ${req.originalUrl}`);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});

// DB
sequelize.sync()
  .then(() => console.log("Base de datos conectada"))
  .catch((error) => console.error("Error al conectar a la base de datos:", error));

// Cron jobs
require('./src/cron');

module.exports = app;