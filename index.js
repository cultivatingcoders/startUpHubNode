const express = require('express');

const exphbs = require('express-handlebars');

const Sequelize = require('sequelize');

const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Adds bcrypt so we can hash passwords
const bcrypt = require('bcrypt-nodejs');
const passport = require('passport');
const passportLocal = require('passport-local');
const cookieParser = require('cookie-parser');
const session = require('express-session');

// Setup database
const sequelize = new Sequelize('startupUsers', 'root', 'astrophotos666');

// Create a new model for startup. Comprised of a logo, a name, a shit-ton of
// social media links, and how to contact them
const Startup = sequelize.define('startup', {
  name: Sequelize.STRING,
  logo: Sequelize.STRING,
  facebook: Sequelize.STRING,
  twitter: Sequelize.STRING,
  instagram: Sequelize.STRING,
  angellist: Sequelize.STRING,
  checked: Sequelize.STRING,
  email: Sequelize.STRING,
  phone: Sequelize.STRING,
  location: Sequelize.STRING
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

app.get('/landing', function(req, res) {

  // Just gonna use some dummy data first
  var startups = [
    {
      name: "Business Toybox",
      logo: "/images/toybox.png",
      facebook: "https://www.facebook.com/businesstoybox/",
      twitter: "https://twitter.com/BusinessToybox",
      check: true,
      phone: "575-914-1826",
      email: "bjorkbat@gmail.com"
    },
    {
      name: "Cultivating Coders",
      logo: "/images/cclogo.png",
      facebook: "https://www.facebook.com/cultivatingcoders",
      twitter: "https://twitter.com/CultivatingCoders",
      check: true
    }
  ];

  res.render('landing', {
    stylesheets: [{name: 'landing.css'}],
    startups: startups
  });
});

// Function renders a form for us to add a new startup
app.get('/newstartup', function(req, res) {
  res.render('newstartup', {stylesheets: [{name: 'newstartup.css'}]});
});

app.post('/newstartup', function(req, res) {

  Startup.create({
    name: req.body.name,
    logo: req.body.logo,
    email: req.body.email,
    phone: req.body.phone,
    location: req.body.location,
    facebook: req.body.facebook,
    twitter: req.body.twitter,
    instagram: req.body.instagram,
    angellist: req.body.angellist,
  }).then(function() {
    res.render('newstartupsuccess', {stylesheets: [{name: 'newstartup.css'}]});
  });

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
