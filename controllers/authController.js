const User = require("../models/userModal")

//for admin
exports.fetchUsers = async (req, res) => {
    try {
        console.log('fetching users')
        var users = await User.find()
        res.status(200).json({
            status: "success",
            data: {
                users
            }
        })
    } catch (error) {
        res.status(404).json({
            error: error.message
        })
    }
}



exports.signup = async (req, res) => {
    try {
        var user = await User.create(req.body)
        console.log(user)
        res.status(200).json({
            status: "success",
            data: {
                user,
            }
        })
    } catch (error) {
        res.status(404).json({
            error: error.message
        })
        
    }
}