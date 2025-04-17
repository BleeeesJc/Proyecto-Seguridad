// src/api/ofertas/oferta.routes.js
const express = require('express');
const router = express.Router();
const ofertasController = require('./oferta.controller');
const upload = require("../../config/multerConfig");

// Define las rutas
router.post('/', upload.single("imagen"), ofertasController.crearOferta);
router.get('/', ofertasController.obtenerOfertas);
router.put('/:id', upload.single("imagen"), ofertasController.actualizarOferta);
router.delete('/:id', ofertasController.eliminarOferta);

module.exports = router;
