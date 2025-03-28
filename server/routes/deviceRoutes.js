const deviceController = require('../controllers/deviceController')
const express = require('express')
const router = express.Router()

router.get('/devices', deviceController.getDevices);
router.post('/add/device', deviceController.addDevices);
router.put('/update/:deviceId',deviceController.updateDevice)

module.exports = router