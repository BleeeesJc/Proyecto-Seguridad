const express = require('express');
const router = express.Router();
const pagoController = require('./pago.controller');

router.get('/', pagoController.obtenerPagos);
router.post('/', pagoController.crearPago);
router.put('/:id', pagoController.actualizarPago);
router.delete('/:id', pagoController.eliminarPago);

module.exports = router;
