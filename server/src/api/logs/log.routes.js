const express = require('express');
const router = express.Router();
const logController = require('../logs/log.controller');

router.get('/',    logController.getAllLogs);
router.get('/:id', logController.getLogById);
router.post('/',   logController.createLog);

module.exports = router;
