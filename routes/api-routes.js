// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport");
const multer = require('multer');
const path = require('path');

module.exports = function (app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function (req, res) {
    // Since we're doing a POST with javascript, we can't actually redirect that post into a GET request
    // So we're sending the user back the route to the members page because the redirect will happen on the front end
    // They won't get this or even be able to access this page if they aren't authed
    res.json("/home");
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function (req, res) {
    //console.log(req.body);
    db.User.create({
      email: req.body.email,
      password: req.body.password
    }).then(function () {
      res.redirect(307, "/api/login");
    }).catch(function (err) {
      console.log(err);
      res.status(422).json(err.errors[0].message);
    });
  });

  // Route for creating a post
  app.post("/api/posts", function (req, res) {
    db.Post.create({
      email: req.user.email,
      title: req.body.title,
      body: req.body.body,
      UserId: req.user.id
    }).then(function (dbPost) {
      res.json(dbPost);
    }).catch(function (err) {
      console.log(err);
      res.status(422).json(err.errors[0].message);
    });
  });

  // Route for deleting a post
  app.delete("/api/posts/:id", function(req, res){
    db.Post.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbPost){
      res.json(dbPost);
    })
  })

  // Route for logging user out
  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function (req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });


  // Set Storage Engine
  const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
  });

  // Init Upload
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1000000 //1mb max
    },
    fileFilter: function (req, file, cb) {
      checkFileType(file, cb)
    }
  }).single('myFile');

  // Check File Type
  function checkFileType(file, cb) {
    //Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    //Check extention
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    //Check mimetype
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
      return cb(null, true);
    } else {
      cb("Error: Images only");
    }
  }

  // Image Upload
  app.post('/upload', function (req, res) {
    upload(req, res, (err) => {
      if (err) {
        res.render('index', {
          msg: err
        });
      } else {
        if(req.file == undefined){
          res.render('index', {
            msg: 'Error: No File Selected!',
            loophole: ' '
          });
        } else {
          db.User.update({
            profileImg: req.file.filename
          },{
            where: {
              id: req.user.id
            }
          }).then(function () {
            res.redirect("/user/" + req.user.id)
          }).catch(function (err) {
            console.log(err);
            res.status(422).json(err.errors[0].message);
          });
          
        }
      }
    })
  });
};
