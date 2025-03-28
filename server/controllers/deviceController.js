const Devices = require('../models/deviceModel')


//Getting Devices
const getDevices = async(req,res) =>{
    try{
        const devices = await Devices.find()
        if(devices.length === 0) return res.status(404).json({msg:'No Device Exist'})

        res.status(200).json(devices)
    }catch(err){
        res.status(500).json({msg:'Internal Server Error',err});
    }
}


//Adding Devices
const addDevices = async(req,res) =>{
    try{
        const {deviceId, siteName, version, status, date} = req.body
        console.log(req.body);

        const device = await Devices.findOne({deviceId})
        if(device) return res.status(400).json({msg:'Device already exist'})
           
        if(status !== 'Updated' && status !== 'NotUpdated') return res.status(400).json({msg:'Status can be either Updated or NotUpdated'})

        const formatDate = (inputDate) => {
            const date = new Date(inputDate);
            return date.toISOString().split('T')[0];
        };
    
        const formattedDate = date ? formatDate(date) : formatDate(new Date());

        const newDevice = await Devices.create({deviceId, siteName, version, status, date: formattedDate})
        // console.log(newDevice);
        res.status(201).json({msg:'New Device added', newDevice})
    }catch(err){
        res.status(500).json({msg:'Internal Server Error',err});   
    }
}


//Updating Devices
const updateDevice = async(req,res) => {
    try{
        const {deviceId} = req.params
        const {siteName, version, status, date} = req.body
        // console.log(req.params, req.body);
        const deviceExists = await Devices.findOne({deviceId})
        if(!deviceExists) return res.status(400).json({msg:'Device does not exist'})

            
        const formatDate = (inputDate) => {
            const date = new Date(inputDate);
            return date.toISOString().split('T')[0];
        };
        
        const formattedDate = date ? formatDate(date) : formatDate(new Date());
        if (status && !['Updated', 'NotUpdated'].includes(status)) {
            return res.status(400).json({ msg: 'Status can be either Success, Failure, or Running' });
        }

        const updatedDevice = await Devices.findOneAndUpdate({deviceId},{siteName, version, status, date: formattedDate}, {new: true})
        // console.log(updatedDevice);

        res.status(200).json({msg:'Device updated Successfully', updatedDevice})
    }catch(err){
        res.status(500).json({msg:'Internal Server Error',err});
    }
}

module.exports = {getDevices, addDevices, updateDevice}