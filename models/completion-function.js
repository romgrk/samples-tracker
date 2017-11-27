/*
 * completion-function.js
 */


const vm = require('vm')
const db = require('../database.js')

module.exports = {
  findAll,
  findById,
  update,
  create,
  runById,
}

function findAll() {
  return db.selectAll('SELECT * FROM completion_functions')
}

function findById(id) {
  return db.selectOne('SELECT * FROM completion_functions WHERE id = @id', { id })
}

function update(completion) {
  return db.query(`
    UPDATE completion_functions
       SET name = @name
         , code = @code
     WHERE id = @id`,
    completion)
  .then(() => findById(completion.id))
}

function create(completion) {
  return db.insert(`
    INSERT INTO completion_functions
                (name, code)
         VALUES (@name, @code)`, completion)
  .then(id => findById(id))
}

function runById(id, context) {
  return findById(id).then(completion =>
    vm.runInContext(`(${completion.code})(step, sample, user)`, vm.createContext(context))
  )
}

module.exports.delete = function(id) {
  return db.query('DELETE FROM completion_functions WHERE id = @id', { id })
    .then(() => id)
}
