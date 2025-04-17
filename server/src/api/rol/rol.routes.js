// src/api/rol.routes.js
const express = require('express');
const router = express.Router();
const rolController = require('../rol/rol.controller');

// Define las rutas
router.post('/', rolController.createRol);
router.get('/', rolController.getAllRoles);
router.get('/:id', rolController.getRolById);
router.put('/:id', rolController.updateRol);
router.delete('/:id', rolController.deleteRol);

module.exports = router;
