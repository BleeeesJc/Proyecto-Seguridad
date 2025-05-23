const express = require('express');
const router = express.Router();
const logController = require('../logs/log.controller');
const verifyToken = require("../../api/autenticacion/verifyToken");// si usas JWT, etc.

router.get('/',    logController.getAllLogs);
router.get('/:id', logController.getLogById);
router.post('/',   logController.createLog);
router.delete('/:id', logController.deleteLog);

module.exports = router;
