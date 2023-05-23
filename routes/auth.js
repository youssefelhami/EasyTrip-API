const express = require("express")
const passport = require('passport');
const {getAuthKey, logout, getCurrentUser} = require('../controllers/auth')
const {apiKeyCheck, validateLogin} = require("../utils/middewares")


const router = express.Router();

// Get OAuth API key from Cliend ID and Secret
router.get("/getkey", getAuthKey);


//User Logout
router.get("/logout", apiKeyCheck, logout)

router.get("/user", apiKeyCheck, getCurrentUser)

//User Login
router.post('/login', apiKeyCheck, validateLogin, passport.authenticate('local'), function(req, res) {
    const { password, ...userWithoutPassword } = req.user.toObject();
    res.status(200).json(userWithoutPassword);
  });





module.exports = router