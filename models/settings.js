/*
 * settings.js
 */


const db = require('../database.js')

module.exports = {
  get,
  canLogin,
}


function get(key) {
  return db.selectOne('SELECT value FROM settings WHERE key = @key', { key })
    .then(({ value }) => value)
}

function canLogin(email) {
  return db.selectOne('SELECT value FROM settings WHERE value ? @email', { email })
    .then(result => result === undefined ?
        Promise.reject(new Error('Email not in whitelist'))
      : Promise.resolve())
}
