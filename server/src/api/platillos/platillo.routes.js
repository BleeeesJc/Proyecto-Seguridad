const express = require('express');
const router = express.Router();
const platilloController = require('./platillo.controller');
const upload = require("../../config/multerConfig");

router.get('/', platilloController.obtenerPlatillos);
router.post('/', upload.single("imagen"), platilloController.crearPlatillo);
router.put('/:id', platilloController.actualizarPlatillo);
router.delete('/:id', platilloController.eliminarPlatillo);

router.put('/desactivar/:id', platilloController.cambiarDesactivado);
router.put('/toggle-destacado/:id', platilloController.toggleDestacado);
router.get('/platillos-ofertas', platilloController.obtenerPlatillosOfertas);

module.exports = router;
