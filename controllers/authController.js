const User = require("../models/userModal");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");

var signJWT = (userId) => {
  return JWT.sign({ id: userId }, process.env.JWT_WEB_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

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
    var { password, ...modifiedUser } = user.toObject(); // converted to simple object
    console.log(modifiedUser);
    //generate JWT
    var token = signJWT(modifiedUser._id);
    console.log(token);
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

exports.login = async (req, res) => {
  try {
    //check if user & email exists
    var { email, password } = req.body;
    if (!email || !password)
      return res.status(404).json({
        error: "please enter valid email or password",
      });
    //fetch user whose email is given
    var user = await User.findOne({ email }).select("+password"); // urged to fetch password field must
    //varify password
    //encrypted pw === password
    var verifiedPassword = await user.passwordVerification(
      password,
      user.password
    ); // compare("pass123pass123", "$s32gdnfdnf")
    if (!verifiedPassword || !user)
      return res.status(401).json({
        //401 --> unauthorized
        error: "invalid email or password", //tell that both things has to verify, for security purpose
      });
    //generate token
    var token = signJWT(user._id);

    //send response
    var { password, ...modifiedUser } = user.toObject();
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

//middleware
//use to protect api from unknown resources
exports.protected = async (req, res, next) => {
  try {
    var token = null;
    //1- fetch token from request header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    //2 -check if token exists
    if (!token) return res.status(404).json({ error: "please sign in" });

    //3- verify token
    var { id: userId, iat: tokenIssuedAt } = await promisify(JWT.verify)(
      token,
      process.env.JWT_WEB_SECRET
    );
    var user = await User.findById(userId);

    //4- check id user exists in DB
    if (!user)
      return res
        .status(401)
        .json({ error: "user regarding this token does not exists" });
    // 5- check if user haven't change password after signin
    var passwordChangedAt = user.passwordChangedAt;
    if (passwordChangedAt) {
      var isPasswordChangedAfter =
        passwordChangedAt.getTime() > tokenIssuedAt * 1000;
      if (isPasswordChangedAfter)
        return res
          .status(401)
          .json({ error: "password has been changed, please login again" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error.message });
  }
};

//agar parameters bhejny hen function me, tw usko wrap karke bhejo
//this function will check if user has access to perform the action
//check artRoutes for more.
exports.restrictTo = (...roles) =>  (req, res, next) => {
  console.log(roles)
  console.log(req.user.role)
  if(!roles.includes(req.user.role)) {
    return res
    .status(401)
    .json({ error: "you don't have access to perform this action" });
  }
  next();
  
  
};
