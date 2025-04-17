//src/api/detalle_pedido/detalle_pedido.routes.js
const express = require('express');
const router = express.Router();
const detallePedidoController = require('./detalle_pedido.controller');

router.get('/', detallePedidoController.obtenerDetallesPedido);
router.post('/', detallePedidoController.crearDetallePedido);
router.put('/:id', detallePedidoController.actualizarDetallePedido);
router.delete('/:id', detallePedidoController.eliminarDetallePedido);
router.get('/pedido', detallePedidoController.obtenerDetallesPedidoPorPedido);

module.exports = router;
