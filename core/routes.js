var validator = require("validator");
var User = require("./models/user");

function isAuth(req, res, next) {
  if(req.session.auth) {
    next();
  } else {
    res.redirect("/signin");
  }
}

function isNotAuth(req, res, next) {
  if(req.session.auth) {
    res.redirect("/");
  } else {
    next();
  }
}

module.exports = function(app) {
  /* Get Routes
  -----------------------------------------------*/
  app.use(function (req, res, next) {
    res.locals.host = req.get("host");
    res.locals.info = req.flash("info");
    res.locals.success = req.flash("success");
    res.locals.danger = req.flash("danger");
    res.locals.session = req.session;
    next();
  });

  app.get("/", function (req, res) {
    if(req.session.auth) {
      res.render("profile", {
        title: "Profile"
      });
    } else {
      res.render("home", {
        title: "Home"
      });
    }
  });

  app.get("/signin", isNotAuth, function (req, res) {
    res.render("signin", {
      title: "Sign in"
    });
  });

  app.get("/signup", isNotAuth, function (req, res) {
    res.render("signup", {
      title: "Sign up"
    });
  });

  app.get("/signout", isAuth, function (req, res) {
    req.session.auth = false;
    req.flash("success", "Successfuly signed out.");
    res.redirect("/");
  });

  app.get("/user/:user", function(req, res) {
    if(req.params.user != "") {
      User.findOne({username: req.params.user}, function(err, user) {
        if(err) { console.log(err); }
        else {
          if(user == null) {
            res.render("404", {
              title: "404 Not Found."
            });
          } else {
            res.render("user", {
              title: user.username,
              user: user
            });
          }
        }
      });
    }
  });

  /* Post Routes
  -----------------------------------------------*/
  app.post("/signin", isNotAuth, function (req, res) {
    if(req.body.username != "" && req.body.password != "") {
      User.auth(req.body.username, req.body.password, function(err, isMatch, r) {
        if(err) throw err;

        if(isMatch) {
          req.flash("success", "Welcome.");
          req.session.auth = true;
          r.password = undefined;
          req.session.u = r;
          res.redirect("/");
        } else {
          req.flash("danger", "Sorry, can\'t sign in with this Username and Password.");
          res.redirect("/signin");
        }
      });
    } else {
      req.flash("danger", "Sorry, can\'t sign in with empty fields.");
      res.redirect("/signin");
    }
  });

  app.post("/signup", function(req, res) {
    if(validator.isLength(req.body.username, {min: 1, max: undefined})
      && validator.isLength(req.body.password, {min: 5, max: undefined})
      && validator.isLength(req.body.email, {min: 5, max: undefined})
      && validator.isEmail(req.body.email, {})) {
        var u = new User({
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          date: new Date()
        });

        u.save(function(err) {
          if(err) { console.log(err); req.flash("danger", "Cannot create account with those values."); }
          else {
            req.flash("success", "Account created.");
          }
          res.redirect("/signin");
        });
    } else {
      req.flash("danger", "Cannot create account with those values.");
      res.redirect("/signup");
    }
  });

  /* 404 Route
  -----------------------------------------------*/
  app.use(function(req, res, next) {
    res.render("404", {
      title: "404 Not Found."
    });
  });

  return app;
};
