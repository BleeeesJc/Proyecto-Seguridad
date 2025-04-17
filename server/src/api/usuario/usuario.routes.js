// src/api/usuario.routes.js
const express = require('express');
const router = express.Router();
const usuarioController = require('./usuario.controller');

// Define las rutas
router.post('/registrar', usuarioController.registrarUsuario);
router.get('/', usuarioController.obtenerUsuarios);
router.get('/:id', usuarioController.obtenerUsuarioPorId); // Ruta para obtener un usuario específico
router.get('/correo/:correo', usuarioController.obtenerUsuarioPorCorreo);// Ruta para obtener un usuario por correo
router.put('/:id', usuarioController.actualizarUsuario);
router.delete('/:id', usuarioController.eliminarUsuario);
router.put('/actualizar-contrasena/:id', usuarioController.actualizarContrasena);// Ruta para actualizar solo la contraseña de un usuario
router.put('/:id/rol', usuarioController.actualizarRolUsuario);


// Rutas para verificación de correo
router.post('/enviar-codigo', usuarioController.enviarCodigo); // Ruta para enviar código de verificación
router.post('/verificar-codigo', usuarioController.verificarCodigo); // Ruta para verificar el código de verificación
router.post('/enviar-reserva', usuarioController.enviarReserva); // Ruta para verificar el código de verificación

//Rutas para envio de notificaciones
router.post('/confirmar-pedido', usuarioController.enviarConfirmacionPedido);




module.exports = router;
