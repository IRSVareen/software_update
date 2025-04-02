const logsController = require('../controllers/logsController')
const express = require('express')
const router = express.Router()

router.post('/logs', logsController.getLogs)
router.post('/logs/range', logsController.getLogsInRange)
router.post('/add/logs',logsController.addLogs)
router.put('/update/logs/:deviceId/:logId', logsController.updateLogs)

module.exports = router