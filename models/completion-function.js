/*
 * completion-function.js
 */


const vm = require('vm')
const { rejectMessage } = require('../helpers/promise')
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
    vm.runInContext(`(${completion.code})(sample.steps[index], sample, user, index)`, vm.createContext(context))
  )
  .then(result => result === true ? Promise.resolve() : rejectMessage(result))
}

module.exports.delete = function(id) {
  return db.query('DELETE FROM completion_functions WHERE id = @id', { id })
    .then(() => id)
}
