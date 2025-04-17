const express = require('express');
const { login } = require('./authController');
const router = express.Router();
console.log("se cargan las rutas")
router.post('/login', login);

module.exports = router;
