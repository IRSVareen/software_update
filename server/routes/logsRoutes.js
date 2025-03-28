const logsController = require('../controllers/logsController')
const express = require('express')
const router = express.Router()

router.get('/logs/:deviceId', logsController.getLogs)
router.get('/logs/:deviceId/range', logsController.getLogsInRange)
router.post('/add/logs/:deviceId',logsController.addLogs)
router.put('/update/logs/:deviceId/:logId', logsController.updateLogs)

module.exports = router
