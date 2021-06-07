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
    title: String,              //my first art
    description: String,        //my short desc
    cost: Number,               //$58
    resolutionWidth: Number,    //1920
    resolutionHeight: Number,   //1080
    likes: Number,              //23
    reviews: [
        {
            content: String,    //cool
            reviewedBy: String, //abc123
            rating: Number,      //4
        },
    ],
    gallery: Array,             //["abc.com", "xyz.com"]
    orientation: String,        //landscape/portrait
    subject: String,            //drop shot
    formats: Array,             //["jpg", "jpeg", "ai"]
}, {
    timestamps: true
}
)

//ye collection bana he
const Art = new mongoose.model('Art', artSchema)

module.exports = Art;