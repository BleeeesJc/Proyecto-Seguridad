// src/api/mesa.routes.js
const express = require('express');
const router = express.Router();
const mesaController = require('./mesasController');

console.log("corre el mesas routes")

// Define las rutas
router.post('/', mesaController.crearMesa); // Ruta para crear una mesa
router.get('/', mesaController.obtenerMesa); // Ruta para obtener todas las mesas
router.put('/:id', mesaController.actualizarMesa); // Ruta para actualizar una mesa por ID
router.delete('/:id', mesaController.borrarMesa); // Ruta para borrar una mesa por ID
router.put('/:id/estado', mesaController.actualizarEstadoMesa);
router.get('/:id', mesaController.obtenerMesaPorId);


module.exports = router;
