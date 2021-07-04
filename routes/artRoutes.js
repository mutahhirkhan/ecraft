const express = require("express");
const { addArt, getArts } = require("../controllers/artController");
const { protected, restrictTo } = require("../controllers/authController");

const router = express.Router();

router.post("/",  protected, restrictTo("buyer"), addArt); // only for artist and admin
router.get("/", getArts); 


module.exports = router;
