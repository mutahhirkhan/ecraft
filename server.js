const express = require("express")
const mongoose = require('mongoose');
const mongoDB_password = "vLOGDlXoYoZ6PsVW"
mongoose.connect('mongodb+srv://Mutahhir:vLOGDlXoYoZ6PsVW@cluster0.slryu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true}).then((con) => {
    console.log('connected')
    console.log(con.connections)
});

const app = express()



app.listen(8000, () => {
    console.log('server running on port 8000')
})
