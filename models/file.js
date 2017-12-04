/*
 * file.js
 */


const path = require('path')
const { readFile, writeFile, unlink, copyFile } = require('../helpers/fs-promise.js')
const db = require('../database.js')
const config = require('../config.js')

module.exports = {
  findAll,
  findById,
  findBySampleId,
  read,
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
  return db.selectOne(`
    SELECT ${columns}
         , '${config.paths.files}/' || id::text as "path"
      FROM files
     WHERE id = @id`,
    { id })
}

function findBySampleId(sampleId) {
  return db.selectAll(`
    SELECT ${columns}
      FROM files
     WHERE sample_id = @sampleId`, { sampleId })
}

function read(id) {
  return readFile(path.join(config.paths.files, id))
}

function create(entry, fileOrPath) {
  return db.insert(`
    INSERT INTO files (sample_id, step_index, mime, name)
      VALUES (
        @sampleId,
        @stepIndex,
        @mime,
        @name
      )`, entry)
    .then(id =>
      (targetPath => (
        fileOrPath instanceof Buffer ?
        writeFile(targetPath, fileOrPath) :
        copyFile(fileOrPath, targetPath)
        .then(() => {
          unlink(fileOrPath).catch(console.error)
          return Promise.resolve()
        })
      ))(/* targetPath = */ path.join(config.paths.files, id.toString()))
      .then(() => findById(id))
    )
}

module.exports.delete = function(id) {
  return db.query('DELETE FROM files WHERE id = @id', { id })
    .then(() => unlink(path.join(config.paths.files, id)))
}
