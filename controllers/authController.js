const User = require("../models/userModal");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");
const sendEmail = require("../models/utility/email");
const crypto = require("crypto");

var signJWT = (userId) => {
  return JWT.sign({ id: userId }, process.env.JWT_WEB_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createAndSendToken =(user, res) => {
  var token = signJWT(user._id)
  var { password, ...modifiedUser } = user.toObject(); // converted to simple object
  res.cookie("jwt", token, {
    expires :new Date(Date.now() + parseInt(process.env.COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000), //expiresIn
    secure: process.env.NODE_ENV === 'development' ? false : true,
    httpOnly: true  //transfer only in http/https
    
    //maxAge
    //expires
    //signed
    //path
  })
  res.status(200).json({
    token,
    status:"success",
    data:{
      user: modifiedUser,
    }
  })
}

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
    //generate JWT
    createAndSendToken(user, res)
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
    //send response
    createAndSendToken(user, res)
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
exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    console.log(roles);
    console.log(req.user.role);
    if (!roles.includes(req.user.role)) {
      return res
        .status(401)
        .json({ error: "you don't have access to perform this action" });
    }
    next();
  };

exports.forgotPassword = async (req, res) => {
  try {
    //1- fetch user on the basis of email
    var { email } = req.body;

    var user = await User.findOne({ email });
    console.log("user: ", user);
    if (!user) {
      return res.status(401).json({
        status: "error",
        data: {
          msg: "no user found",
        },
      });
    }
    //2- generate reset token
    var resetToken = user.passwordResetTokenGenerator();
    await user.save({ validateBeforeSave: false }); //again saving already existing doc, stpping validations
    var msg = `- click on the following link to reset your password \n- note that the link will expires in 10 minutes \n- ${process.env.BASE_URL}/api/v1/auth/reset-password/${resetToken}`;
    //3- send it to user's email
    await sendEmail({
      to: email,
      subject: "password reset token",
      body: msg,
    });
    res.status(200).json({
      status: "success",
      data: {
        msg: "reset token has been sent to the respective email address",
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    var { token } = req.params;
    var {password, confirmPassword} = req.body

    //encrypt reset token
    var encryptedResetToken = crypto.createHash("sha256").update(token).digest("hex");

    //get user on the basis of passwordResetToken
    var user = await User.findOne({
      passwordResetToken: encryptedResetToken,
      passwordResetTokenExpiresAt: { $gt: Date.now() },
    });

    //if user doesn't exists then send error in response
    if(!user) {
      return res.status(401).json(  {
        status: "error",
        data: {
          msg: "token doesn't exist or has beene expired",
        },
      });
    }
    user.password = password,
    user.confirmPassword = confirmPassword
    user.passwordResetToken = undefined
    await user.save()
    //login user again (signin again/ generating JWT)
    createAndSendToken(user, res)

    res.status(200).json({
      data: {
        msg: "reset Password",
      },
    });
  } catch (error) {
    user.passwordResetToken =undefined,
    user.passwordResetTokenExpiresAt =undefined,
    await user.save({ validateBeforeSave: false }); //again saving already existing doc, stpping validations

    console.log(error);
    res.status(404).json({ error: error.message });
  }
};

exports.updatePassword = (req, res, next) => {
  try {
    var{currentPassword, newPassword, confirmPassword} = req.body

    
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error.message });
  }
}