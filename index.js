const express = require('express');

const exphbs = require('express-handlebars');

const Sequelize = require('sequelize');

const app = express();


// Adds bcrypt so we can hash passwords
const bcrypt = require('bcrypt-nodejs');
const passport = require('passport');
const passportLocal = require('passport-local');
const cookieParser = require('cookie-parser');
const session = require('express-session');

// Setup database
const sequelize = new Sequelize('startupUsers', 'root', 'astrophotos666');

// Model for keeping track of user accounts.
const User = sequelize.define('user', {
  username: Sequelize.STRING,
  password: Sequelize.STRING,
  email: Sequelize.STRING
});

sequelize.sync();

// Initialize passport and take care of cookie stuff
app.use(cookieParser());
app.use(session({secret: "secret-key"}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));

// This is the strategy that we use to authenticate users
passport.use(new passportLocal(

  function(uname, password, done) {

    User.findOne({
      where: {
        username: uname
      }
    }).then(function(user) {

      // Check to see if we actually got a user back from our database
      if (!user) {
        return done(null, false, {message: "User could not be found"});
      }

      // If we do get a user back, we want to check to see if passwords match
      if (!bcrypt.compareSync(password, user.password)) {
        return done(null, false, {message: "Password is incorrect"});
      }

      // User is authenticated, return user object
      return done(null, user);
    });
  }

));

// Tell passport how to give users session cookies
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// Turns session cookies back into users
passport.deserializeUser(function(userID, done) {
  User.findOne({
    where: {
      id: userID
    }
  }).then(function(user) {
    done(null, user);
  });
});

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
  res.render('home');
});

// This function handles requests to the signup page
app.get('/signup', function(req, res) {
  res.render('signup', {title: "Create an Account"});
});

app.get('/profile', function(req, res) {
  res.render('profile')
});

app.post('/signup', function(req, res) {

  const hash = bcrypt.hashSync(req.body.password);

  User.create({
    username: req.body.username,
    password: hash,
    email: req.body.email
  }).then(function() {
    res.render('account_created');
  });

});

const port = 3000;
app.listen(port, function () {
  console.log("Example app listening on port " + "!");
});
