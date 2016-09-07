// Adds sequelize, so we can interact with the database
const sequelize = require('sequelize');

// Connect to database
const db = new sequelize('startup', 'cultivatingcoder', '');

// Define models
// Create a user model
const User = db.define('user', {
  userID: sequelize.INTEGER,
  admin: sequelize.BOOLEAN,
  businessAddress: sequelize.STRING,
  businessLogo: sequelize.STRING,
  businessName: sequelize.STRING,
  businessType: sequelize.STRING,
  email: sequelize.STRING,
  facebook: sequelize.STRING,
  hash: sequelize.STRING(128),
  github: sequelize.STRING,
  instagram: sequelize.STRING,
  linkedin: sequelize.STRING,
  salt: sequelize.STRING(64),
  snapChat: sequelize.STRING,
  twitter: sequelize.STRING,
  website: sequelize.STRING,
  youtube: sequelize.STRING,

});

// Create an event model
const Event = db.define('event', {
  eventID: sequelize.INTEGER,
  content: sequelize.STRING,
  imageLink: sequelize.STRING,
  userID: {
    type: sequelize.INTEGER,
    references: {
      model: User,
      id: 'userID'
    }
  }
});

db.sync()
