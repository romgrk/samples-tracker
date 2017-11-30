/*
 * step.js
 */


const db = require('../database.js')

module.exports = {
  findAll,
  findById,
  findBySampleId,
  findOverdue,
  update,
  updateStatus,
  updateAlerted,
  create,
  createMany,
}

const columns = `
    id
  , name
  , status
  , notes
  , started
  , "alertDelay"::text
  , "completionFn"
  , started + "alertDelay" < CURRENT_TIMESTAMP as "isOverdue"
  , started + "alertDelay" as "overdueAt"
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

function findOverdue() {
  return db.selectAll(`
    SELECT ${columns}, sample_id as "sampleId"
      FROM steps
     WHERE started + "alertDelay" < CURRENT_TIMESTAMP
           AND alerted IS NULL
  `)
}

function update(step) {
  return db.query(`
    UPDATE steps
       SET name = @name
         , notes = @notes
         , status = @status
         , started = @started
         , "alertDelay" = @alertDelay
         , "completionFn" = @completionFn
     WHERE id = @id`, step)
}

function updateStatus(id, status, started = null) {
  return db.query(`
    UPDATE steps
       SET status = @status
         , started = @started
     WHERE id = @id
  `, { id, status, started })
}

function updateAlerted(id) {
  return db.query(`
    UPDATE steps
       SET alerted = CURRENT_TIMESTAMP
     WHERE id = @id`, { id })
}

function create(sampleId, index, step) {
  return db.insert(`INSERT INTO steps (sample_id, index, status, name, notes, started, "alertDelay", "completionFn")
    VALUES (
      @sampleId,
      @index,
      @status,
      @name,
      @notes,
      @started,
      @alertDelay,
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
