const mongoose = require('mongoose')

const logsSchema = new mongoose.Schema({
    deviceId:{
        type: String,
        // required: true,
        ref: 'Devices'
    },
    description:{
        type: String,
        // required: true,
    },
    softwareVersion:{
        type: String,
        // required: true
    },
    event:{
        type: String,
        // required: true,
        enum:['RollBack', 'SoftwareUpdate']
    },
    updateStatus:{
        type: String,
        // required: true,
        enum: ['Running','Success', 'Failure']
    },
    startTime:{
        type: Date,
        // required: true
    },
    endTime:{ 
        type: Date, 
        // required: function() { return this.updateStatus === 'Success' || this.updateStatus === 'Failure'; } 
    },
    date:{
        type: Date,
        // required: true
    }
},{
    timestamps: true
})

module.exports = new mongoose.model('Logs', logsSchema)