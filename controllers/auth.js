const Auth = require("../models/Auth");
const {authSchema} = require('../utils/validator')
const crypto = require('crypto');
const createError = require("../utils/error");

// Get OAuth API key from Cliend ID and Secret
const getAuthKey = async (req, res, next) => {
    client_id = req.headers.client_id
    secret = req.headers.secret
    const { error, value } = authSchema.validate({ client_id, secret });
    if (error) {
      return next(error);
    }
  
    let authData = await Auth.findOne({ client_id, secret });
  
    if (!authData) {
      return next(createError(401, "Invalid Credentials"));
    }
  
    let key = authData.key;
  
    if (!key) {
      key = crypto.createHash('sha256').update(client_id + secret).digest('hex');
      authData = await Auth.findByIdAndUpdate(
        authData._id,
        { key },
        { new: true }
      );
    }
  
    res.status(200).json({ key });
  }

// User Logout
const logout = (req, res, next) => {

    user = req.user
    if (user){
        req.logout((err) => {
            if (err) {
                console.log(err)
                return res.status(500).send(err.message)
            }
            res.status(200).json(user);
        })
    }
    else {
      res.status(200).json({});
    }
}

const getCurrentUser = (req, res) => {
  if (req.user) res.status(200).json(req.user)
  else res.status(200).json({})
}



  module.exports = {getAuthKey, logout, getCurrentUser}