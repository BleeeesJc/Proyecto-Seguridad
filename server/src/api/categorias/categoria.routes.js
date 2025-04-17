// src/api/categoria.routes.js
const express = require('express');
const router = express.Router();
const categoriaController = require('./categoria.controller');

router.get('/', categoriaController.obtenerCategorias);
router.post('/', categoriaController.crearCategoria);
router.put('/:id', categoriaController.actualizarCategoria);
router.delete('/:id', categoriaController.eliminarCategoria);

module.exports = router;
