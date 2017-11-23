/*
 * sample.js
 */


const db = require('../database.js')
const Step = require('./step')

module.exports = {
  findAll,
  findById,
  update,
  complete,
  create,
}

const columns = `
    id
  , name
  , tags
  , notes
  , created
  , modified
  , completed
`

function findAll() {
  return db.selectAll(`SELECT ${columns} FROM samples`)
}

function findById(id) {
  return db.selectOne(`SELECT ${columns} FROM samples WHERE id = @id`, { id })
}

function update(sample) {
  return Promise.all([
    db.query(`
      UPDATE samples
        SET name = @name
          , tags = @tags
          , notes = @notes
          , modified = now()
      WHERE id = @id`, sample),
  ].concat(sample.steps.map(step => Step.update(step))))
  .then(() => findById(step.id))
}

function complete(id) {
  return db.query(`
    UPDATE samples
       SET completed = now()
     WHERE id = @id`, { id })
}

function create(sample) {
  return db.insert(`
    INSERT INTO samples (name, tags, notes, created)
      VALUES (
        @name,
        @tags,
        @notes,
        now()
      )`, sample)
  .then(row =>
    Promise.all(sample.steps.map(step =>
      Step.create(row.id, step)))
  )
}

module.exports.delete = function(id) {
  return db.query('DELETE FROM samples WHERE id = @id', { id })
}
