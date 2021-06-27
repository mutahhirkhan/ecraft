const User = require("../models/userModal");
const JWT = require("jsonwebtoken");

//for admin
exports.fetchUsers = async (req, res) => {
  try {
    var users = await User.find();
    res.status(200).json({
      status: "success",
      data: {
        users,
      },
    });
  } catch (error) {
    res.status(404).json({
      error: error.message,
    });
  }
};

exports.signup = async (req, res) => {
  try {
    var user = await User.create(req.body); //bson
    //removing password
    var {password, ...modifiedUser} = user.toObject() // converted to simple object
    console.log(modifiedUser);
    //generate JWT
    var token = JWT.sign({ id: modifiedUser._id }, process.env.JWT_WEB_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    console.log(token)
    res.status(200).json({
      status: "success",
      token,
      data: {
        user: modifiedUser,
      },
    });
  } catch (error) {
    res.status(404).json({
      error: error.message,
    });
  }
};
