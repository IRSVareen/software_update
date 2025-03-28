const mongoose = require('mongoose')
require('dotenv').config()

const dbConnection = mongoose.connect(process.env.MONGODB_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(()=>{console.log('MongoDB Connected Successfully');})
.catch((err)=>{console.error(err)})

module.exports = {dbConnection}