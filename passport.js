/*
 * passport.js
 */

const passport = require('passport')
const { OAuth2Strategy } = require('passport-google-oauth')

const Settings = require('./models/settings.js')
const User = require('./models/user.js')
const config = require('./config.js')
const db = require('./database.js')

module.exports = passport

// used to serialize the user for the session
passport.serializeUser((user, done) => {
  done(undefined, user.id)
})

// used to deserialize the user
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(id => done(undefined, id))
    .catch(err => done(err))
})

passport.use(new OAuth2Strategy(config.google.auth, (token, refreshToken, profile, done) => {

  console.log(token, refreshToken, profile)

  // make the code asynchronous
  // User.findById won't fire until we have all our data back from Google
  process.nextTick(() => {

    // Try to find the user based on their google id
    User.findById(profile.id)
    .then(user => {

      // if a user is found, log them in
      Settings.canLogin(user.email)
      .then(() => done(undefined, user))
      .catch(err => done(err))
    })
    .catch(err => {
      // if the user isnt in our database, create a new user
      if (err.type === db.E_TYPE) {
        const newUser = {
          id: profile.id,
          token: token,
          name: profile.displayName,
          email: profile.emails[0].value,
        }

        Settings.canLogin(newUser.email)
        .then(() => User.create(newUser))
        .then(() => done(undefined, newUser))
        .catch(err => done(err))
      }
      // if some other error happens, throw it
      else {
        done(err)
      }
    })
  })
}))
