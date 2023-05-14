const Auth = require("../models/Auth");
const createError = require("./error");

const apiKeyCheck = async (req, res, next) => {
    const apiKey = req.headers.key;
    // console.log(req.headers)
  
    if (!apiKey) {
      return next(createError(401, "Missing API key"));
    }
  
    const apiKeyDoc = await Auth.findOne({ key: apiKey });
  
    if (!apiKeyDoc) {
      return next(createError(401, "Invalid API key"));
    }
  
    next();
  };

const isAuthenticated = (req, res, next) => {
    if (!req.user) {
      return next(createError(400, 'You are not authorized to access this data'));
    }
    next();
}


module.exports = {apiKeyCheck, isAuthenticated}