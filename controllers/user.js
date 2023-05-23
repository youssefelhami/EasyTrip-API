const {userSchema} = require('../utils/validator')
const createError = require("../utils/error");
const User = require("../models/User");
const bcrypt = require('bcrypt')


//Get Currently Logged in User
const getCurrentUser = (req, res) => {
    if (req.user) res.status(200).json(req.user)
    else res.status(200).json({})
}

// Create New User
const addUser = async (req, res, next) => {


  username = req.body.username;
  password = req.body.password;
    const {error, value} =  userSchema.validate({username, password})
    if (error){
        return next(error)
      }
      try {
        const user = await User.findOne({ username: username });

        if (!user) {
          const salt = bcrypt.genSaltSync(10)
          const hashedPassword = bcrypt.hashSync(password, salt)
          const newUser = new User({ username: username, password: hashedPassword });
            await newUser.save();
            returnUser = newUser.toObject()
            delete returnUser.password
            console.log(returnUser)
            res.status(200).json(returnUser);
          }
          else {
            return next(createError(409, "User Already exists"))
          }

      } catch (err) {
        console.log(err)
        return next(err)
      }
}

module.exports = {getCurrentUser, addUser}