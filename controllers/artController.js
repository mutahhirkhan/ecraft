const Art = require("../models/artModel")

exports.addArt = async (req, res) => {
    try {
        console.log(req.body)
        var art  = await Art.create(req.body)
        console.log(art)
        res.status(200).json({
        status: "succes",
        data:{
            art
        }
    })
    } catch (error) {
        console.log(error)
        res.status(404).json({error: error.message})
    }
}


exports.getArts = async (req, res) => {
    try {
        console.log(req.query)
        // var arts = await Art.find({ formats: { $all: ["jpg", "ai"] } } )
        // console.log(arts)
        
        //regex for query modification
        var{role, moreData, ...restQueries} = req.query
        var queryStr = JSON.stringify(restQueries)
        var modifiedStr = queryStr.replace(/\b(gt|lt|gte|lte|in)\b/g, match => `$${match}`)
        var query = JSON.parse(modifiedStr)
        
        //pass the modelled query
        var arts = await Art.find(query)
        console.log(arts)
        res.status(200).json({
            results: arts.length,
            status: "succes",
            data: {
                arts
            }

        })  
    } catch (error) {
        console.log(error)
       res.status(404).json({error: error.message})
    }
}