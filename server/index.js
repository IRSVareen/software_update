const express = require('express')
const app = express()
const PORT = 3000
const dbConnection = require('./config/db')
const deviceRoutes = require('./routes/deviceRoutes')
const logsRoutes = require('./routes/logsRoutes')

app.use(express.json())

//database connection
dbConnection

app.listen(PORT, ()=>{
    console.log('listening...');
})

app.get('/',(req,res)=>{
    res.json({msg:'hello'})
})


//Devices API
app.use('/api', deviceRoutes)

//Logs API
app.use('/api', logsRoutes)
