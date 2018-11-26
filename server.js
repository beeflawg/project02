// Requiring necessary npm packages
var express = require("express");
var session = require("express-session");

// Requiring passport as we've configured it
var passport = require("./config/passport");
var exphbs = require("express-handlebars");

// User img upload packages (Called elsewhere, kept here for organization)
const path = require('path');
const multer = require('multer');

// Setting up port and requiring models for syncing
var PORT = process.env.PORT || 8080;
var db = require("./models");

// Creating express app and configuring middleware needed for authentication
var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// We need to use sessions to keep track of our user's login status
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

//Hepler functions to determine if the current user is viewing their own profile
app.engine("handlebars", exphbs({ 
  defaultLayout: "main",
  helpers: {
    if_eq: function(a, b, opts){
      if(a === b){
        console.log("line 37" + a, b);
        return opts.fn(this);
      } else {
        return opts.inverse(this);
      }
    },
    log: function(a){
      console.log(a);
    }
  }
}));
app.set("view engine", "handlebars");

// Requiring our routes

require("./routes/api-routes.js")(app);
require("./routes/html-routes.js")(app);


// Syncing our database and logging a message to the user upon success
db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
  });
});

