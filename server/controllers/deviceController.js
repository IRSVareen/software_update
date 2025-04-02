const Devices = require('../models/deviceModel')

//Getting Devices
const getDevices = async(req,res) =>{
    try{
        const devices = await Devices.find()
        if(devices.length === 0) {return res.status(404).json({msg:'No Device Exist'})}

        res.status(200).json(devices)
    }catch(err){
        res.status(500).json({msg:'Internal Server Error',err});
    }
}

const getDeviceByDeviceId = async(req,res) =>{
    try{
        const {deviceId} = req.body
        if (!deviceId) {
            return res.status(400).json({ msg: 'deviceId is required' });
        }
        const deviceExists = await Devices.findOne({deviceId})
        if(!deviceExists) return res.status(400).json({msg:'Device Not Found'})

        res.status(200).json(deviceExists)
    }catch(err){
        res.status(500).json({msg:'Internal Server Error',err});
    }
}


//Adding Devices
// const addDevices = async(req,res) =>{
//     try{
//         const {deviceId, siteName, version, status, date} = req.body
//         // console.log(req.body);

//         const device = await Devices.findOne({deviceId})
//         if(device) return res.status(400).json({msg:'Device already exists'})
           
//         if(status !== 'Updated' && status !== 'NotUpdated') return res.status(400).json({msg:'Status can be either Updated or NotUpdated'})

//         const formatDate = (inputDate) => {
//             const date = new Date(inputDate);
//             return date.toISOString().split('T')[0];
//         };
    
//         const formattedDate = date ? formatDate(date) : formatDate(new Date());

//         const newDevice = await Devices.create({deviceId, siteName, version, status, date: formattedDate})
//         // console.log(newDevice);
//         res.status(201).json({msg:'New Device added', newDevice})
//     }catch(err){
//         res.status(500).json({msg:'Internal Server Error',err});   
//     }
// }

const addDevices = async (req, res) => {
    try {
        const { deviceId, updateFlag,siteName, lastVersion, currentVersion, updateStatus, event,startTime, endTime, date } = req.body;

        const device = await Devices.findOne({ deviceId });
        if (device) {return res.status(400).json({ msg: 'Device already exists' })};

        if (updateStatus && !['Running', 'Successful', 'Failure'].includes(updateStatus)) {
            return res.status(400).json({ msg: 'updateStatus can be either Running, Successful, or Failure' });
        }
        if(!event){
            return res.status(400).json({msg:'Event is required'})
        }
        if(event && !['SoftwareUpdate', 'RollBack'].includes(event)){
            return res.status(400).json({msg:'Event can be either SoftwareUpdate or RollBack'})
        }

        if (!startTime) {
            return res.status(400).json({ msg: 'startTime is required' });
        }
        
        if ((updateStatus === 'Successful' || updateStatus === 'Failure') && !endTime) {
            return res.status(400).json({ msg: 'endTime is required when updateStatus is Successful or Failure' });
        }
        

        const isValidTimeFormat = (time) => /^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(time);

        if (!isValidTimeFormat(startTime) || (updateStatus !== 'Running' && endTime && !isValidTimeFormat(endTime))) {
            return res.status(400).json({ msg: 'Invalid time format. Use HH:MM:SS' });
        }

        const formatDate = (inputDate) => {
            const dateObj = new Date(inputDate);
            return dateObj.toISOString().split('T')[0];
        };
        const formattedDate = date ? formatDate(date) : formatDate(new Date());

        const createDateTime = (time) => time ? new Date(`${formattedDate}T${time}Z`) : null;

        const updatedSoftwareStatus = updateStatus === 'Successful' ? 'Updated' : 'NotUpdated';

        const newDevice = await Devices.create({
            deviceId,
            updateFlag,
            siteName,
            lastVersion,
            currentVersion,
            softwareStatus: updatedSoftwareStatus,
            updateStatus,
            event,
            startTime: createDateTime(startTime),
            endTime: createDateTime(endTime),
            date: formattedDate
        });

        res.status(201).json({ msg: 'New Device added', newDevice });

    } catch (err) {
        res.status(500).json({ msg: 'Internal Server Error', err });
    }
};

//Updating Devices
const updateDevice = async(req,res) => {
    try{
        const {deviceId} = req.params
        const {siteName, lastVersion, currentVersion, updateStatus, event, startTime, endTime, date} = req.body
        // console.log(req.params, req.body);
        const deviceExists = await Devices.findOne({deviceId})
        if(!deviceExists){ return res.status(400).json({msg:'Device does not exist'})}


        if (updateStatus && !['Running', 'Success', 'Failure'].includes(updateStatus)) {
            return res.status(400).json({ msg: 'Status can be either Running, Success, or Failure' });
        }
        if(!event){
            return res.status(400).json({msg:'Event is required'})
        }
        if(event && !['SoftwareUpdate', 'RollBack'].includes(event)){
            return res.status(400).json({msg:'Event can be either SoftwareUpdate or RollBack'})
        }

        if (!startTime) {
            return res.status(400).json({ msg: 'startTime is required' });
        }
        
        if ((updateStatus === 'Success' || updateStatus === 'Failure') && !endTime) {
            return res.status(400).json({ msg: 'endTime is required when status is Successful or Failure' });
        }
        

        const isValidTimeFormat = (time) => /^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(time);

        if (!isValidTimeFormat(startTime) || (status !== 'Running' && endTime && !isValidTimeFormat(endTime))) {
            return res.status(400).json({ msg: 'Invalid time format. Use HH:MM:SS' });
        }

        const formatDate = (inputDate) => {
            const dateObj = new Date(inputDate);
            return dateObj.toISOString().split('T')[0];
        };
        const formattedDate = date ? formatDate(date) : formatDate(new Date());

        const createDateTime = (time) => time ? new Date(`${formattedDate}T${time}Z`) : null;

         const updatedSoftwareStatus = updateStatus === 'Success' ? 'Updated' : 'NotUpdated'

        const updatedDevice = await Devices.findOneAndUpdate({deviceId},{siteName,lastVersion, currentVersion, softwareStatus: updatedSoftwareStatus, updateStatus,event,startTime:createDateTime(startTime), endTime: createDateTime(endTime), date: formattedDate}, {new: true})
        // console.log(updatedDevice);

        res.status(200).json({msg:'Device updated Successfully', updatedDevice})
    }catch(err){
        res.status(500).json({msg:'Internal Server Error',err});
    }
}

const changeFlag = async(req,res) =>{
    try{
        const { deviceId } = req.body

        const deviceExists = await Devices.findOne({deviceId})
        if(!deviceExists) { return res.status(400).json({msg:'Device does not exist'})}

        await Devices.findOneAndUpdate({deviceId},{updateFlag:  !(deviceExists.updateFlag)})
        
        res.status(200).json({msg:'Flag Updated'})

    }catch(err){
        res.status(500).json({msg:'Internal Server Error',err});
    }
}


module.exports = {getDevices, getDeviceByDeviceId,addDevices, updateDevice, changeFlag}