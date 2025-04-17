// src/api/rol.routes.js
const express = require('express');
const router = express.Router();
const actividadController = require('./actividadController');

// Define las rutas
router.post('/', actividadController.crearActividad);
router.get('/', actividadController.obtenerActividades);

module.exports = router;
