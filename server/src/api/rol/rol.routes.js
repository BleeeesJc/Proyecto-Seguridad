// src/api/rol.routes.js
const express = require('express');
const router = express.Router();
const rolController = require('./rol.controller');

// Define las rutas
router.post('/', rolController.crearRol);
router.get('/', rolController.obtenerRoles);
router.put('/:id', rolController.actualizarRol);
router.delete('/:id', rolController.eliminarRol);

module.exports = router;
