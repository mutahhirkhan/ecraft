const express = require("express")
const { signup, fetchUsers, login, forgotPassword, resetPassword } = require("../controllers/authController")

const router = express.Router()

// router.get("/", (req, res) => {
//     res.status(200).json({
//         status: "success",
//         msg:"auth home route"
//     })
// })

router.post("/signup", signup)
router.get("/", fetchUsers)
router.post("/login", login)
router.post("/forgot-password", forgotPassword) //this api give reset token (random string) against the email
router.post("/reset-password/:token", resetPassword)   //this api will change the password on that token

module.exports = router