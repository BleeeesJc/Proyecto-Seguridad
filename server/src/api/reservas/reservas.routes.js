// src/api/reserva/reserva.routes.js
const express = require('express');
const router = express.Router();
const reservasController = require('./reservas.controller');

// Define las rutas
router.post('/', reservasController.crearReserva);
router.get('/', reservasController.obtenerReservas);
router.put('/:id', reservasController.actualizarReserva);
router.delete('/:id', reservasController.eliminarReserva);
router.get('/verificar-disponibilidad', reservasController.verificarDisponibilidad)
router.get('/verificar-usuario', reservasController.verificarUsuario);
router.get('/usuario/:idUsuario', reservasController.obtenerReservasPorUsuario);



module.exports = router;
