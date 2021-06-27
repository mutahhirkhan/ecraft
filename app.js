const express = require('express')
const app  = express()
const artRouter = require("./routes/artRoutes")
const authRouter = require("./routes/authRoutes")

//middlewares
app.use(express.json())

//routes
app.use('/api/v1/art', artRouter)
app.use("/api/v1/auth", authRouter)

module.exports = app;