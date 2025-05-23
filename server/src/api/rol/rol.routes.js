// src/api/rol.routes.js
const express = require('express');
const router = express.Router();
const rolController = require('../rol/rol.controller');
const verifyToken = require("../../api/autenticacion/verifyToken");

// Define las rutas
router.post('/', verifyToken,rolController.createRol);
router.get('/', verifyToken,rolController.getAllRoles);
router.get('/:id', verifyToken,rolController.getRolById);
router.put('/:id', verifyToken,rolController.updateRol);
router.delete('/:id', verifyToken,rolController.deleteRol);

module.exports = router;
