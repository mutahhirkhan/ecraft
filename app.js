const express = require('express')
const app  = express()
const artRouter = require("./routes/artRoutes")

//middlewares
app.use(express.json())

//routes
app.use('/api/v1/art', artRouter)

module.exports = app;