/*
 * config.js
 */

const path = require('path')

module.exports = {
  paths: {
    files: path.join(__dirname, 'data', 'files'),
  },
  google: {
    auth: {
      clientID:     '328760546754-pnqvvcseea7mg6tm2fd72gk8b4cnv11b.apps.googleusercontent.com',
      clientSecret: 'HhILyJLUiToLsmMWL8zDpBS3',
      callbackURL:  'http://localhost:3001/auth/google/callback',
    },
    callbackURL:  'http://localhost:3001/auth/google/callback',
  },
}
