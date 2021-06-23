const Art = require("../artModel");

class APIFeatures {
    constructor(model, queryObj) {
        //this = {}
        this.model = model;         //Art Collection
        this.queryObj = queryObj;   //req.query
        this.query = null;          //query that we will chain method
    }
    filter() {
        //1 - filtering
        var{role, sort, fields, page, limit, ...restQueries} = this.queryObj
        var queryStr = JSON.stringify(restQueries);
        var modifiedStr = queryStr.replace(/\b(gt|lt|gte|lte|in)\b/g, match => `$${match}`)
        var parsedQuery = JSON.parse(modifiedStr)

        this.query= Art.find(parsedQuery)  //promise
        return this
    }
    sorting() {
        //2 - sorting
        var {sort} = this.queryObj
        if(sort) {
            sort = sort.split(",").join(" ")    //chain promise
            this.query = this.query.sort(sort)
        }
        else this.query = this.query.sort("-createdAt")   //default sorting   
        return this
    }
    LimitFields() {
        //3 - fields limiting
        var {fields} = this.queryObj;
        if(fields) {
        fields = fields.split(",").join(" ")    //chain promise
        this.query = this.query.select(fields)
        }
        else this.query = this.query.select("-__v")
        return this
    }
    paginate() {
        //4 - paginations
        var {page, limit} = this.queryObj;
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 2
        var skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)       //chain promise
        return this
    }
    get() {
        return this.query
    }
}

module.exports = APIFeatures