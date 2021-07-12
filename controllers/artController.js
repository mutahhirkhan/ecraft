const Art = require("../models/artModel");
const APIFeatures = require("../models/utility/commonUtility");

exports.addArt = async (req, res) => {
  try {
    console.log(req.body);
    var art = await Art.create(req.body);
    console.log(art);
    res.status(200).json({
      status: "succes",
      data: {
        art,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error.message });
  }
};

exports.getOneArt = async (req, res) => {
  try {
    var {id} = req.query
    var query = await Art.findById(id)
   
    res.status(200).json({
      status: "one art fetched successfully ",
      data:{
        art: query
      }
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error.message });
  }
}

exports.deleteOneArt = async (req, res) => {
  try {
    var {id} = req.query
    // console.log(req.query)
    var query = await Art.remove({_id: id})
    if(!query.deletedCount) {
      return res.status(404).json(
        {  
          status: "success",
          data:{
            art:"art doesn't exists"
          }
        });      
    }
    res.status(200).json({
      status: "one art deleted successfully ",
      data:{
        art: query
      }
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error.message });
  }
}

exports.updateOne = async (req, res) => {
  try {
    console.log(req.body)
    var {id} = req.query
    var art = await Art.findById(id)
    console.log(art)
    if(!art) {
      res.status(404).json({
        status: "error",
        data:{
          art:"art not found",
        }
      });
    }
    var query = await Art.findOneAndUpdate({_id: id}, req.body, {upsert: true})
    console.log(query)
    res.status(200).json({
      status: "one art updated successfully ",
      data:{
        art,
      }
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error.message });
  }
}

exports.getArts = async (req, res) => {
  try {
    var { limit = 2 } = req.query;
    var query = new APIFeatures(Art, req.query)
      .filter()
      .sorting()
      .LimitFields()
      .paginate();

    //pass the modelled query
    var arts = await query.get();

    //total pages count
    var totalPages = Math.ceil((await Art.countDocuments()) / limit);
    res.status(200).json({
      results: arts.length,
      pages: totalPages,
      status: "succes",
      data: {
        arts,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error.message });
  }
};


