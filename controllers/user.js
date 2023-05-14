const {userSchema} = require('../utils/validator')
const createError = require("../utils/error");
const User = require("../models/User");
const bcrypt = require('bcrypt')

const getCurrentUser = (req, res) => {
    console.log(`Get User Request: ${JSON.stringify({...req.user})}`)
    res.send(req.user)
}

const addUser = async (req, res, next) => {

  // console.log(req.user)  
  // if(!req.user) return next(createError(400, "you are not authorized to access this data"))

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
            return next(createError(400, "User Already exists"))
          }

      } catch (err) {
        console.log(err)
        return next(err)
      }
}

module.exports = {getCurrentUser, addUser}