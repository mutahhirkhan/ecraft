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
        
        //1 - filtering
        var{role, sort, fields, page, limit, ...restQueries} = req.query
        var queryStr = JSON.stringify(restQueries)
        var modifiedStr = queryStr.replace(/\b(gt|lt|gte|lte|in)\b/g, match => `$${match}`)
        var queryObj = JSON.parse(modifiedStr)
        
        var query = Art.find(queryObj)  //promise
        
        //2 - sorting
        if(sort) {
            sort = sort.split(",").join(" ")    //chain promise
            console.log("sort"+sort)
            query = query.sort(sort)
        }
        else query.sort("-createdAt")
        
        //3 - fields limiting
        if(fields) {
            fields = fields.split(",").join(" ")    //chain promise
            query = query.select(fields)
        }
        else query = query.select("-__v")
        
        //4 - paginations
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 2
        var skip = (page - 1) * limit
        console.log("skip"+skip)
        query = query.skip(skip).limit(limit)       //chain promise

        //pass the modelled query
        var arts = await query   //promise resolved

        //total pages count
        var totalPages = Math.ceil(await Art.countDocuments() / limit) 
        res.status(200).json({
            results: arts.length,
            pages: totalPages,
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