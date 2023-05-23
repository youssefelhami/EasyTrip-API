const Auth = require("../models/Auth");
const createError = require("./error");
const {userSchema} = require('./validator')


const apiKeyCheck = async (req, res, next) => {
    const apiKey = req.headers.key;
    // console.log(req.headers)
  
    if (!apiKey) {
      return next(createError(403, "Invalid or missing API key"));
    }
  
    const apiKeyDoc = await Auth.findOne({ key: apiKey });
  
    if (!apiKeyDoc) {
      return next(createError(403, "Forbidden: Invalid or missing API key"));
    }
  
    next();
  };

const isAuthenticated = (req, res, next) => {
    if (!req.user) {
      return next(createError(401, 'You are not authorized to access this data'));
    }
    next();
}

const validateLogin = (req, res, next) => {
  username = req.body.username;
  password = req.body.password;
  const {error, value} =  userSchema.validate({username, password})
    if (error){
        return next(error)
      }
  next();
}


module.exports = {apiKeyCheck, isAuthenticated, validateLogin}