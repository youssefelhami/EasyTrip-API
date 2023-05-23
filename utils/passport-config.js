const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const bcrypt = require('bcrypt')
const createError = require("../utils/error");


// Configure passport to use a local strategy for authentication (username and password)
passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ username });
        if (!user) {
          return done(createError(401, "Wrong password or username!"));
        }
        const isPasswordCorrect = await bcrypt.compare(
          password,
          user.password
        );
  
        if (!isPasswordCorrect) {
          return done(createError(401, "Wrong password or username!"));
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

// Serialize the user object to store in the session
passport.serializeUser((user, done) => {
    return done(null, user._id);
  });

// Deserialize the user object from the session  
passport.deserializeUser(async (id, done) => {

    try {
        doc = await User.findById(id)
        const { password, ...userWithoutPassword } = doc.toObject();
        return done(null, userWithoutPassword);
    } catch (err) {
        console.log(err)
    }
})