const Logs = require('../models/logsModel')
const Devices = require('../models/deviceModel')


//Getting Logs
const getLogs = async (req, res) => {
    try {
        const { deviceId } = req.body;

        if (!deviceId) {
            return res.status(400).json({ msg: 'deviceId is required' });
        }

        const deviceExists = await Devices.findOne({ deviceId })
        if (!deviceExists) {
            return res.status(404).json({ msg: 'Device not found' });
        }
        const logs = await Logs.find({ deviceId }).sort({createdAt:-1});;
        
        if (logs.length === 0) return res.status(404).json({ msg: 'No Logs Exist', logs: [] });

        res.status(200).json({ logs });
    } catch (err) {
        res.status(500).json({ msg: 'Internal Server Error', err });
    }
}


//Showing Logs in a Calendar Range
const getLogsInRange = async (req, res) => {
    try {
        const { deviceId, startDate, endDate } = req.body;

        if (!deviceId) {
            return res.status(400).json({ msg: 'deviceId is required' });
        }

        if (!startDate || !endDate) {
            return res.status(400).json({ msg: 'startDate and endDate are required in YYYY-MM-DD format' });
        }

        const deviceExists = await Devices.findOne({ deviceId });
        if (!deviceExists) return res.status(404).json({ msg: 'Device not Found' });

        const parsedStartDate = new Date(startDate);
        const parsedEndDate = new Date(endDate);

        if (isNaN(parsedStartDate) || isNaN(parsedEndDate)) {
            return res.status(400).json({ msg: 'Invalid date format. Use YYYY-MM-DD' });
        }

        const formattedStartDate = new Date(parsedStartDate.toISOString().split('T')[0]);
        const formattedEndDate = new Date(parsedEndDate.toISOString().split('T')[0]);

        const logs = await Logs.find({
            deviceId,
            date: { $gte: formattedStartDate, $lte: formattedEndDate }
        }).lean();

        if (logs.length === 0) return res.status(404).json({ msg: 'No Logs Exist' });

        res.status(200).json({ logs });

    } catch (err) {
        res.status(500).json({ msg: 'Internal Server Error', error: err.message });
    }
};


//Adding logs
const addLogs = async (req, res) => {
    try {
        
        const { deviceId, description, softwareVersion, event, updateStatus, startTime, endTime, date } = req.body

        if (!deviceId) {
            return res.status(400).json({ msg: 'deviceId is required' });
        }

        const deviceExists = await Devices.findOne({ deviceId })
        if (!deviceExists) {return res.status(400).json({ msg: ' Device Not Found' });}

        // if(!event){
        //     return res.status(400).json({msg:'Event is required'})
        // }
        if(event && !['SoftwareUpdate', 'RollBack'].includes(event)){
            return res.status(400).json({msg:'Event can be either SoftwareUpdate or RollBack'})
        }
        if (updateStatus && !['Running', 'Success', 'Failure'].includes(updateStatus)) {
            return res.status(400).json({ msg: 'Status can be either Success, Failure, or Running' });
        }

        if (!startTime) {
            return res.status(400).json({ msg: 'startTime is required' });
        }
        if((updateStatus === 'Success' || updateStatus === 'Failure') && !endTime) {
            return res.status(400).json({msg: 'endTime is required when updateStatus is Success or Failure'})
        }
        const isValidTimeFormat = (time) => /^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(time);

        if (!isValidTimeFormat(startTime) || (endTime && !isValidTimeFormat(endTime))) {
            return res.status(400).json({ msg: 'Invalid time format. Use HH:MM:SS' });
        }

        const formatDate = (inputDate) => {
            const date = new Date(inputDate);
            return date.toISOString().split('T')[0];
        };

        const formattedDate = date ? formatDate(date) : formatDate(new Date());

        const today = formatDate(new Date());
        if (formattedDate > today) {
            return res.status(400).json({ msg: 'Logs cannot be added for a future date' });
        }
        const createDateTime = (time) => new Date(`${formattedDate}T${time}Z`);

        const newLog = await Logs.create({
            deviceId, description, softwareVersion, event, updateStatus, startTime: createDateTime(startTime),
            endTime: endTime ? createDateTime(endTime): null, date: formattedDate
        })

        await Devices.updateOne({deviceId}, 
            {
                $set:{
                    updateStatus,
                    startTime: createDateTime(startTime),
                    endTime: endTime ? createDateTime(endTime): null,
                    date: formattedDate
                }
            }
        )

        res.status(201).json({ msg: 'Log added Successfully', log: newLog })
    } catch (err) {
        res.status(500).json({ msg: 'Internal Server Error', err })
    }
}


//Updating Logs
const updateLogs = async (req, res) => {
    try {
        const { deviceId, logId } = req.params;
        const { description, softwareVersion, event, updateStatus, startTime, endTime, date } = req.body;

        const deviceExists = await Devices.findOne({ deviceId });;
        if (!deviceExists) {return res.status(400).json({ msg: 'Device Not Found' })}

        if(!event){
            return res.status(400).json({msg:'Event is required'})
        }
        if(event && !['SoftwareUpdate', 'RollBack'].includes(event)){
            return res.status(400).json({msg:'Event can be either SoftwareUpdate or RollBack'})
        }
            

        if (!startTime || !endTime) {
            return res.status(400).json({ msg: 'startTime and endTime are required' });
        }

        const isValidTimeFormat = (time) => /^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(time);

        if (!isValidTimeFormat(startTime) || !isValidTimeFormat(endTime)) {
            return res.status(400).json({ msg: 'Invalid time format. Use HH:MM:SS' });
        }

        const formatDate = (inputDate) => {
            const date = new Date(inputDate);
            return date.toISOString().split('T')[0];
        };

        const formattedDate = date ? formatDate(date) : formatDate(new Date());
        const createDateTime = (time) => new Date(`${formattedDate}T${time}Z`);

        if (updateStatus && !['Running', 'Success', 'Failure'].includes(updateStatus)) {
            return res.status(400).json({ msg: 'Status can be either Success, Failure, or Running' });
        }

        const updatedLogs = await Logs.findOneAndUpdate({ deviceId, _id: logId }, { description, softwareVersion, event, updateStatus, startTime: createDateTime(startTime), endTime: createDateTime(endTime), date: formattedDate }, { new: true })
        // console.log(updatedLogs);
        res.status(200).json({ msg: 'Logs updated Successfully', log: updatedLogs });
    } catch (err) {
        res.status(500).json({ msg: 'Internal Server Error', err });
    }
}

module.exports = { getLogs, getLogsInRange, addLogs, updateLogs }