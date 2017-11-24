/*
 * history.js
 */


const db = require('../database.js')

module.exports = {
  findAll,
  findById,
  findBySampleId,
  create,
  log,
}

const columns = `
    date
  , description
  , user_id as "userId"
`

function findAll() {
  return db.selectAll(`SELECT ${columns} FROM history`)
}

function findById(id) {
  return db.selectOne(`SELECT ${columns} FROM history WHERE id = @id`, { id })
}

function findBySampleId(sampleId) {
  return db.selectOne(`
    SELECT ${columns}
      FROM history
     WHERE sample_id = @sampleId`, { sampleId })
}

function create(entry) {
  return db.insert(`
    INSERT INTO history (sample_id, step_index, user_id, date, description)
      VALUES (
        @sampleId,
        @stepIndex,
        @userId,
        ${db.NOW},
        @description
      )`, entry)
}

function log(entry) {
  return result => {
    create(entry)
      .catch(err => console.error(err))
    return result
  }
}

module.exports.delete = function(id) {
  return db.query('DELETE FROM history WHERE id = @id', { id })
}
