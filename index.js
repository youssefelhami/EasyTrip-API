const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose');
const authRoutes = require("./routes/auth.js")
const userRoutes = require("./routes/users.js")
const tripsRoutes = require("./routes/trips.js")
const cors = require('cors')
const session = require('express-session')
const passport = require('passport');
require('./utils/passport-config');



dotenv.config()

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log('connected to DB')
    } catch (err) {
        throw err;
    }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});

const app = express()


//middlewares
app.use(express.json())

app.use(cors({ origin: "http://localhost:3000", credentials: true }))


app.use(
  session({
    secret: "secretcode",
    resave: false,
    saveUninitialized: false,
    cookie: {
      // sameSite: "none",
      // secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7 * 4, // Four Week
    }
  }))


app.use(passport.initialize());
app.use(passport.session());


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/trips", tripsRoutes);



app.use((err, req,res,next) => {
    errorStatus = err.status || 500
    errorMessage = err.message || "Something went wrong"
    return res.status(errorStatus).json({
        success: false,
        status : errorStatus,
        message : errorMessage
    })
})



app.listen(process.env.PORT || 8080, ()=> {
    connect();
    console.log("Application Started!")
})
