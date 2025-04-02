const deviceController = require('../controllers/deviceController')
const express = require('express')
const router = express.Router()

router.post('/devices', deviceController.getDevices);
router.post('/device', deviceController.getDeviceByDeviceId);
router.post('/add/device', deviceController.addDevices);
router.put('/update/:deviceId',deviceController.updateDevice);
router.post('/update/flag', deviceController.changeFlag);

module.exports = router