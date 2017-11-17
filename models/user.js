/*
 * user.js
 */

const db = require('../database.js')

module.exports = {
  findById,
  create,
}


function findById(id) {
  return db.selectOne('SELECT * FROM users WHERE id = @id', { id })
}

function create(user) {
  return db.query('INSERT INTO users VALUES (@id, @token, @name, @email)', user)
}
