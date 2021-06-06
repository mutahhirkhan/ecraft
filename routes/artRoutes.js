const express = require("express")
const { addArt, getArts } = require("../controllers/artController")

const router = express.Router()

router.post('/', addArt)
router.get('/', getArts)


module.exports = router