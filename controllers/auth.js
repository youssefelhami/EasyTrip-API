const Auth = require("../models/Auth");
const {authSchema} = require('../utils/validator')
const crypto = require('crypto');
const createError = require("../utils/error");


const getAuthKey = async (req, res, next) => {
    // console.log(req.headers)
    // const { client_id, secret } = req.body;
    client_id = req.headers.client_id
    secret = req.headers.secret
    const { error, value } = authSchema.validate({ client_id, secret });
    if (error) {
      return next(error);
    }
  
    let authData = await Auth.findOne({ client_id, secret });
  
    if (!authData) {
      return next(createError(400, "Invalid Credentials"));
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

const logout = (req, res) => {
    // console.log("Logging Out")
    // console.log(req.user)
    if (req.user){
        req.logout((err) => {
            if (err) {
                console.log(err)
                return res.status(500).send(err.message)
            }
            // console.log("Logged Out Successfully")
            res.send("Done")
        })
    }
    else {
      res.send("Already Logged Out")
    }
}

// const apiKeyCheck = async (req, res, next) => {
//   const apiKey = req.headers.key;
//   // console.log(req.headers)

//   if (!apiKey) {
//     return next(createError(401, "Missing API key"));
//   }

//   const apiKeyDoc = await Auth.findOne({ key: apiKey });

//   if (!apiKeyDoc) {
//     return next(createError(401, "Invalid API key"));
//   }

//   next();
// };





  module.exports = {getAuthKey, logout}