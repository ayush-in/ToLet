var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    cookieParser = require("cookie-parser"),
    LocalStrategy = require("passport-local"),
    flash = require("connect-flash"),
    Room = require("./models/room"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    session = require("express-session"),
    seedDB = require("./seeds"),
    methodOverride = require("method-override");
// configure dotenv
require('dotenv').load();

//requiring routes
var commentRoutes = require("./routes/comments"),
    roomRoutes = require("./routes/rooms"),
    indexRoutes = require("./routes/index")

// assign mongoose promise library and connect to database
mongoose.connect("mongodb://localhost:27017/to_let");
// mongoose.Promise = global.Promise;


// const databaseUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/to_let';

// mongoose.connect(databaseUri, { useMongoClient: true })
//       .then(() => console.log(`Database connected`))
//       .catch(err => console.log(`Database connection error: ${err.message}`));

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));
//require moment
app.locals.moment = require('moment');
// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Hello to all!!",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});


app.use("/", indexRoutes);
app.use("/rooms", roomRoutes);
app.use("/rooms/:id/comments", commentRoutes);

app.listen(8080, function () {
    console.log("The ToLet Server Has Started!");
});