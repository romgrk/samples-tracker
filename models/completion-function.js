/*
 * completion-function.js
 */


const db = require('../database.js')

module.exports = {
  findAll,
  findById,
  update,
  create,
}

function findAll() {
  return db.selectAll('SELECT * FROM completion_functions')
}

function findById(id) {
  return db.selectOne('SELECT * FROM completion_functions WHERE id = @id', { id }).then(addSteps)
}

function update(completion) {
  return db.query(`
    UPDATE completion_functions
       SET name = @name
         , code = @code
     WHERE id = @id`,
    completion)
}

function create(completion) {
  return db.insert(`
    INSERT INTO completion_functions
                (name, code)
         VALUES (@name, @code)`, completion)
}

module.exports.delete = function(id) {
  return db.query('DELETE FROM completion_functions WHERE id = @id', { id })
}
