// Requiring path to so we can use relative routes to our HTML files
var path = require("path");

// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");

var db = require("../models");
module.exports = function (app) {

  app.get("/", function (req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/home");
    }
    res.sendFile(path.join(__dirname, "../public/signup.html"));
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/home", isAuthenticated, function (req, res) {
    db.Post.findAll({
      order: [
        ["id", "DESC"]
      ],
      include: [db.User]
    }).then(function (dbPost) {
      //console.log(dbPost);
      //console.log(req.user.id)
      res.render("index", {
        post: dbPost,
        reqUserId: req.user.id
      })
    })
  });


  app.get("/user/:id", isAuthenticated, function (req, res) {
    db.Post.findAll({
      where: {
        UserId: req.params.id
      },
      order: [
        ["id", "DESC"]
      ],
      include: [db.User]
<<<<<<< HEAD
    }).then(function(dbUserInfo) {
      console.log(dbUserInfo);
      res.render("userProfile", {
        post: dbUserInfo
      })
    })
=======
    }).then(function (dbUserInfo) {
      if (dbUserInfo.length != 0) {
        res.render("userProfile", {
          post: dbUserInfo,
          reqUserId: req.user.id
        });
      } else {
        // If the user has no posts, their data will not be tied 
        // to the Post table, so if none exist we pull from the
        // Users table
        db.User.findOne({
          where: {
            id: req.params.id
          }
        }).then(function(userNoPosts){
          res.render("userProfile", {
            noPost: userNoPosts,
            reqUserId: req.user.id
          });
        });
      };
    });
>>>>>>> 0a46558350357334bc0b942e518b7af852988d4f
  });

  // Render the submit handlebars file when the user visits /submit
  app.get("/submit", isAuthenticated, function (req, res) {
    res.render("submit")
  });
};