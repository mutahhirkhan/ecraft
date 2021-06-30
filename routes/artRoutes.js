const express = require("express")
const { addArt, getArts } = require("../controllers/artController")
const { protected } = require("../controllers/authController")

const router = express.Router()

router.post('/', addArt)
router.get('/', protected, getArts)


module.exports = router