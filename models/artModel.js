const mongoose = require("mongoose")

//ye collection ka Data Structure he 
//is collection me in fields k elawa koi aur extra field inject ni ho sakti
// lakin kam ho sakti hen fields, but is se ziyada nhi 
// agar required ki validation lgani he tw is trah 
/*
ttile : {
    type: String,
    required: true
}
*/
const artSchema = new mongoose.Schema({
    title: String,
    rating: Number,
    cost: Number,


})

//ye collection bana he
const Art = new mongoose.model('Art', artSchema)

module.exports = Art;