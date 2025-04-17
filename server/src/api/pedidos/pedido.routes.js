const express = require('express');
const router = express.Router();
const pedidoController = require('./pedido.controller');

// Rutas existentes
router.get('/', pedidoController.obtenerPedidos);
router.post('/', pedidoController.crearPedido);
router.put('/:id', pedidoController.actualizarPedido);
router.delete('/:id', pedidoController.eliminarPedido);

// Nuevas rutas para entregar y cancelar pedidos
router.put('/entregar/:id', pedidoController.entregarPedido); // Ruta para entregar un pedido
router.put('/cancelar/:id', pedidoController.cancelarPedido); // Ruta para cancelar un pedido
router.put('/pagar/:id', pedidoController.registrarPagoPedido); // ruta para registrar pago


router.get('/usuario/:idUsuario', pedidoController.obtenerPedidosPorUsuario); 
module.exports = router;
