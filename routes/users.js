const express = require("express")
const {getAllUsers, addUser} = require("../controllers/user")
const {apiKeyCheck, isAuthenticated} = require("../utils/middewares")




const router = express.Router();

//Get Logged In User
router.get("/", apiKeyCheck, isAuthenticated, getAllUsers)

//Create a new User
router.post("/", apiKeyCheck, isAuthenticated, addUser)


module.exports = router