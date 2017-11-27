/*
 * step.js
 */


const db = require('../database.js')

module.exports = {
  findAll,
  findById,
  findBySampleId,
  update,
  updateStatus,
  create,
  createMany,
}

const columns = `
    id
  , name
  , status
  , notes
  , "completionFn"
  , '[]'::json as "files"
`

function findAll() {
  return db.selectAll(`SELECT ${columns} FROM steps`)
}

function findById(id) {
  return db.selectOne(`SELECT ${columns} FROM steps WHERE id = @id`, { id })
}

function findBySampleId(sampleId) {
  return db.selectAll(`
      SELECT ${columns}
        FROM steps
      WHERE sample_id = @sampleId
    ORDER BY index
    `
    , { sampleId })
}

function update(step) {
  return db.query(`
    UPDATE steps
       SET name = @name
         , notes = @notes
         , status = @status
         , "completionFn" = @completionFn
     WHERE id = @id`, step)
}

function updateStatus(id, status) {
  return db.query(`
    UPDATE steps
       SET status = @status
     WHERE id = @id`, { id, status })
}

function create(sampleId, index, step) {
  return db.insert(`INSERT INTO steps (sample_id, index, status, name, notes, "completionFn")
    VALUES (
      @sampleId,
      @index,
      @status,
      @name,
      @notes,
      @completionFn
    )`, { ...step, sampleId, index })
}

function createMany(sampleId, steps) {
  return Promise.all(steps.map((step, index) =>
    create(sampleId, index, step)
  ))
}

module.exports.delete = function(id) {
  return db.query('DELETE FROM steps WHERE id = @id', { id })
}
