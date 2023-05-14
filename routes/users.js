const express = require("express")
const {getCurrentUser, addUser} = require("../controllers/user")
const {apiKeyCheck, isAuthenticated} = require("../utils/middewares")




const router = express.Router();

router.get("/", apiKeyCheck, getCurrentUser)

router.post("/", apiKeyCheck, isAuthenticated, addUser)


module.exports = router