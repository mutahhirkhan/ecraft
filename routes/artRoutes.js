const express = require("express");
const { addArt, getArts, getOneArt, deleteOneArt, updateOne } = require("../controllers/artController");
const { protected, restrictTo } = require("../controllers/authController");

const router = express.Router();

router.post("/",  protected, restrictTo("buyer"), addArt); // only for artist and admin
router.get("/", getArts); 
router.route("/oneArt").put(updateOne).get(getOneArt).delete(deleteOneArt); 


module.exports = router;
