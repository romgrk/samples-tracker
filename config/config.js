/*
 * config.js
 */

const path = require('path')

module.exports = {
  paths: {
    /* Do not modify this */
    files: process.env.FILES_DIRECTORY || path.join(__dirname, 'data', 'files'),
    /* process.env.FILES_DIRECTORY is only set in the production docker image. */
  },
  google: {
    auth: {
      clientID:     '328760546754-pnqvvcseea7mg6tm2fd72gk8b4cnv11b.apps.googleusercontent.com',
      clientSecret: 'HhILyJLUiToLsmMWL8zDpBS3',
      callbackURL:  'http://localhost:3001/auth/google/callback',
    },
    callbackURL:  'http://localhost:3001/auth/google/callback',
  },
  nodemailer: {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'b754nvhbts7wm5ij@ethereal.email',
      pass: 'JAaFd2vZvV2JVSvugN'
    }
  },
  alertEmail: {
    interval: 1 * 60 * 1000,
    from: 'romain.gregoire@mcgill.ca',
  },
}
