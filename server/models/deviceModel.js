const mongoose = require('mongoose')

const deviceSchema = new mongoose.Schema({
    deviceId:{
        type: String,
        unique: true,
        required: true
    },
    siteName:{
        type: String,
        required: true
    },
    version:{
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true,
        enum:['Updated','NotUpdated']
    },
    date:{
        type: Date,
        required: true
    }
})

module.exports = new mongoose.model('Devices', deviceSchema)