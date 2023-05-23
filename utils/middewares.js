const Auth = require("../models/Auth");
const createError = require("./error");
const {userSchema} = require('./validator')


// Checks for the API key in header and makes sure it is valid
const apiKeyCheck = async (req, res, next) => {
    const apiKey = req.headers.key;
  
    if (!apiKey) {
      return next(createError(403, "Invalid or missing API key"));
    }
  
    const apiKeyDoc = await Auth.findOne({ key: apiKey });
  
    if (!apiKeyDoc) {
      return next(createError(403, "Invalid or missing API key"));
    }
  
    next();
  };

// Checks if there is an authenticated user
const isAuthenticated = (req, res, next) => {
    if (!req.user) {
      return next(createError(401, 'You must be authenticated to access this data'));
    }
    next();
}

// Checks if the Login credentials are valid (username and password exist...)
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