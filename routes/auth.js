
// const Auth = require("../models/Auth");
// const {authSchema} = require('../utils/validator')
// const crypto = require('crypto');
// const createError = require("../utils/error");

const express = require("express")
const passport = require('passport');
const {getAuthKey, logout} = require('../controllers/auth')
const {apiKeyCheck} = require("../utils/middewares")


const router = express.Router();

router.get("/getkey", getAuthKey);


router.get("/logout", apiKeyCheck, logout)

router.post('/login', apiKeyCheck, passport.authenticate('local'), function(req, res) {
    const { password, ...userWithoutPassword } = req.user.toObject();
    res.status(200).json(userWithoutPassword);
  });


// To Be Deleted
// router.post("/new", async (req, res, next) => {
//     client_id = req.body.client_id
//     secret = req.body.secret
//     const {error, value} =  authSchema.validate({client_id, secret})
//     if (error){
//         return next(error)
//       }

//     const key = crypto.createHash('sha256').update(client_id + secret).digest('hex');
    
//     const newAuth = new Auth({ client_id:client_id, secret: secret, key:key });
    
//     await newAuth.save();

//     res.status(200).json(newAuth);

// })



module.exports = router