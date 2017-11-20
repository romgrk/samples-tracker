/*
 * settings.js
 */


const db = require('../database.js')

module.exports = {
  findAll,
  findByKey,
  update,
  canLogin,
}


function findAll() {
  return db.selectAll('SELECT * FROM settings')
    .then(rows =>
      rows.reduce((acc, cur) => (
        acc[cur.key] = cur.value,
        acc
      ), {})
    )
}

function findByKey(key) {
  return db.selectOne('SELECT value FROM settings WHERE key = @key', { key })
    .then(({ value }) => value)
}

function update(key, value) {
  return db.query('UPDATE settings SET value = @value WHERE key = @key', { key, value })
}

function canLogin(email) {
  return db.selectOne("SELECT value FROM settings WHERE key = 'whitelist' AND value ? @email", { email })
    .then(result => result === undefined ?
        Promise.reject(new Error('Email not in whitelist'))
      : Promise.resolve())
}
