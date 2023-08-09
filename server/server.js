const express = require('express')  // Import express as express
require('dotenv').config()          // Import .env
const dbConnect = require('.\\config\\dbconnet.js')
const initRoutes = require('.\\routes')

const app = express()
const port = process.env.PORT || 8888
app.use(express.json())                         //Read when client send json
app.use(express.urlencoded({extends : true}))   //Read when client send URL encoded
dbConnect()

initRoutes(app)

app.listen(port, () => {
    console.log('Server is running on the port: ' + port)
})