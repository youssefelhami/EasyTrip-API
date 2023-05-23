const express = require("express")
const {getCurrentUser, addUser} = require("../controllers/user")
const {apiKeyCheck, isAuthenticated} = require("../utils/middewares")




const router = express.Router();

//Get Logged In User
router.get("/", apiKeyCheck, getCurrentUser)

//Create a new User
router.post("/", apiKeyCheck, isAuthenticated, addUser)


module.exports = router