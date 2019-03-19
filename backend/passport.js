const mongoose = require('mongoose');
const passport = require('passport');
const localStrategy = require('passport-local');

const userModel = mongoose.model('user');

passport.use(new localStrategy({
  // gets the email and password from the req sent from routes.js
  usernameField: 'email',
  passwordField: 'password',
}, (email, password, done) => {
  userModel.findOne({ email })
    .then((user) => {
      if(!user || !user.validatePassword(password)) {
        return done(null, false, { errors: { 'email or password': 'is invalid' } });
      }
      return done(null, user);
    }).catch(done);
}));