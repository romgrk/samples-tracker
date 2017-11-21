/*
 * step.js
 */


const db = require('../database.js')

module.exports = {
  findAll,
  findById,
  findByTemplateId,
  update,
  create,
}

// postgres returns case lowercase only names
function fixRows(rows) {
  rows.forEach(fixProps)
  return rows
}
function fixProps(row) {
  row.completionFn = row.completionfn
  row.templateId = row.template_id
  delete row.completionfn
  delete row.template_id
  return row
}

function findAll() {
  return db.selectAll('SELECT * FROM steps').then(fixRows)
}

function findById(id) {
  return db.selectOne('SELECT * FROM steps WHERE id = @id', { id }).then(fixProps)
}

function findByTemplateId(templateId) {
  return db.selectAll(`
    SELECT *
      FROM steps
     WHERE template_id = @templateId`
    , { templateId }).then(fixRows)
}

function update(step) {
  return db.query('UPDATE steps SET name = @name WHERE id = @id', step)
}

function create(step) {
  return db.query(`INSERT INTO steps (template_id, name, completionFn)
    VALUES (
      @templateId,
      @name,
      @completionFn
    )`, step)
}

module.exports.delete = function(id) {
  return db.query('DELETE FROM steps WHERE id = @id', { id })
}
