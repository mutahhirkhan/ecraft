const express = require('express')
const app  = express()
const artRouter = require("./routes/artRoutes")
const authRouter = require("./routes/authRoutes")
const rateLimit = require("express-rate-limit"); //to avoid brute force attack
const mongoSanitize = require('express-mongo-sanitize'); //to avoid noSql injection
const xss = require('xss-clean') //remove script tags



const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 1000, // limit each IP to 1000 requests per windowMs
    message: "you have exceed the number of request"
  });

//middlewares
app.use(limiter)
app.use(express.json())
app.use(mongoSanitize());
 
//routes
app.use('/api/v1/art', artRouter)
app.use("/api/v1/auth", authRouter)

module.exports = app;