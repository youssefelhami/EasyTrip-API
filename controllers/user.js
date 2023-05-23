const {userSchema} = require('../utils/validator')
const createError = require("../utils/error");
const User = require("../models/User");
const bcrypt = require('bcrypt')

const getAllUsers = async (req, res) => {
  try{
    const users = await User.find({}).select('-password');
    res.set('Content-Range', `country 0-${users.length}/${users.length}`);
    res.set('X-Total-Count', users.length)
    res.set('Access-Control-Expose-Headers', 'Content-Range, X-Total-Count')    
    res.status(200).json(users);
  } catch (err) {
    console.log(err)
    return next(err)
  }
}

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

module.exports = {getAllUsers, addUser}