/*
 * user.js
 */

const db = require('../database.js')

module.exports = {
  findAll,
  findById,
  update,
  create,
}


function findAll() {
  return db.selectAll('SELECT * FROM users')
}

function findById(id) {
  return db.selectOne('SELECT * FROM users WHERE id = @id', { id })
}

function update(user) {
  return db.query('UPDATE users SET name = @name, email = @email WHERE id = @id', user)
}

function create(user) {
  return db.query('INSERT INTO users VALUES (@id, @token, @name, @email)', user)
}

module.exports.delete = function(id) {
  return db.query('DELETE FROM users WHERE id = @id', { id })
}
