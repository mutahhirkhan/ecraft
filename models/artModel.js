const mongoose = require("mongoose")

//ye collection ka Data Structure he 
const artSchema = new mongoose.Schema({
    title: String,
    rating: Number,
    cost: Number,


})

//ye collection bana he
const Art = new mongoose.model('Art', artSchema)

module.exports = Art;