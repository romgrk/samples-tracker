/*
 * template-step.js
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
  row.templateId = row.template_id
  delete row.template_id
  return row
}

function findAll() {
  return db.selectAll('SELECT * FROM template_steps').then(fixRows)
}

function findById(id) {
  return db.selectOne('SELECT * FROM template_steps WHERE id = @id', { id }).then(fixProps)
}

function findByTemplateId(templateId) {
  return db.selectAll(`
      SELECT id, name, "completionFn"
        FROM template_steps
      WHERE template_id = @templateId
    ORDER BY index
    `
    , { templateId }).then(fixRows)
}

function update(step) {
  return db.query(`
    UPDATE template_steps
       SET name = @name
         , "completionFn" = @completionFn
     WHERE id = @id`, step)
}

function create(step) {
  return db.query(`INSERT INTO template_steps (template_id, name, completionFn)
    VALUES (
      @templateId,
      @name,
      @completionFn
    )`, step)
}

module.exports.delete = function(id) {
  return db.query('DELETE FROM template_steps WHERE id = @id', { id })
}
