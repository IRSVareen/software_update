const mongoose = require('mongoose')

// const deviceSchema = new mongoose.Schema({
//     deviceId:{
//         type: String,
//         unique: true,
//         required: true
//     },
//     siteName:{
//         type: String,
//         required: true
//     },
//     version:{
//         type: String,
//         required: true
//     },
//     status:{
//         type: String,
//         required: true,
//         enum:['Updated','NotUpdated']
//     },
//     date:{
//         type: Date,
//         required: true
//     }
// })

const deviceSchema = new mongoose.Schema({
    deviceId:{
        type: String,
        unique: true,
        // required: true
    },
    updateFlag:{
        type: Boolean,
        // required: true
    },
    siteName:{
        type: String,
        // required: true
    },
    lastVersion:{
        type: String,
        // required: true
    },
    currentVersion:{
        type: String,
        // required: true
    },
    softwareStatus:{
        type: String,
        // required: true,
        enum:['Updated','NotUpdated']
    },
    updateStatus:{
        type: String,
        // required: true,
        enum:['Success','Failure','Running']
    },
    // event:{
    //     type: String,
    //     // required: true,
    //     enum:['RollBack', 'SoftwareUpdate']
    // },
    startTime: {
        type: Date,
        // required: true
    },
    endTime:{
        type: Date,
        // required: function() {return this.status === 'Successful' || this.status === 'Failure';}
    },
    date:{
        type: Date,
        // required: true
    }
},{
    timestamps: true
})

module.exports = new mongoose.model('Devices', deviceSchema)