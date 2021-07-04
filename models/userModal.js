const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "username is required"], //overriding the 2nd arg which is for error message
  },
  role: {
    type: String,
    required: [true, "role is required!"],
    enum: ["artist", "buyer"]
  },
  email: {
    type: String,
    unique: true,
    index: true, //email must be unique --> validation
    lower: true, //data modification
  },
  password: {
    type: String,
    required: true,
    minLength: 10,
    select: false //just for security
  },
  confirmPassword: {
    type: String,
    required: true,
    validate: [
      //this is a pre-act, id pehly generate hogi, then validation hogi, then save hoga
      function (val) {
        // this --> schema Document
        return val === this.password; // this will point the whole object, will go up the chain
      },
      "password does not match",
    ],
  },
  passwordChangedAt: Date
});

//model instance method
//this method will be available to all documents, created by this model
userSchema.methods.passwordVerification = async (password, hashPassword) => (
  await bcrypt.compare(password, hashPassword) // compare("pass123pass123", "$s32gdnfdnf")
)

// "save" shows that it's a document middleware
// called on .create and .save
//password validation middleware
userSchema.pre("save", async function (next) {
    // this -> document
    // TODO -> if password changed then do the following
    if(!this.isModified("password")) return next()
    var encryptedPassword  = await bcrypt.hash(this.password, 12) //number brute force attack strength. this number is weightage of encryption
    this.password = encryptedPassword;
    
    //TO CHECK 
    this.confirmPassword = undefined    // to remove field from field bcz this is only for validation
    next();
});


var User = new mongoose.model("user", userSchema);

module.exports = User;
