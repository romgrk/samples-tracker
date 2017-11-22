/*
 * file.js
 */


const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const unlink = promisify(fs.unlink)
const db = require('../database.js')
const config = require('../config.js')

module.exports = {
  findAll,
  findById,
  findBySampleId,
  create,
}

const columns = `
    id
  , sample_id as "sampleId"
  , step_index as "stepIndex"
  , mime
  , name
`

function findAll() {
  return db.selectAll(`SELECT ${columns} FROM files`)
}

function findById(id) {
  return db.selectOne(`SELECT ${columns} FROM files WHERE id = @id`, { id })
}

function findBySampleId(sampleId) {
  return db.selectOne(`
    SELECT ${columns}
      FROM files
     WHERE sample_id = @sampleId`, { sampleId })
}

function read(id) {
  return readFile(path.join(config.paths.files, id))
}

function create(entry, file) {
  return db.insert(`
    INSERT INTO files (sample_id, step_index, mime, name)
      VALUES (
        @sampleId,
        @stepIndex,
        @userId,
        now(),
        @description
      )`, entry)
    .then(row =>
      writeFile(path.join(config.paths.files, row.id), file)
        .then(() => row)
    )
}

module.exports.delete = function(id) {
  return db.query('DELETE FROM files WHERE id = @id', { id })
    .then(() => unlink(path.join(config.paths.files, id)))
}
