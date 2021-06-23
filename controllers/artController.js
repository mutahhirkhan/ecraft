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
