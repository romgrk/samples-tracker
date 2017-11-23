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
  updateOrCreate,
}

const columns = `
    id
  , template_id as "templateId"
  , name
  , "completionFn"
`

const selectTemplateQuery = `
    SELECT ${columns}
      FROM template_steps
    WHERE template_id = @templateId
  ORDER BY index
`

function findAll() {
  return db.selectAll(`SELECT ${columns} FROM template_steps`)
}

function findById(id) {
  return db.selectOne(`SELECT ${columns} FROM template_steps WHERE id = @id`, { id })
}

function findByTemplateId(templateId) {
  return db.selectAll(selectTemplateQuery, { templateId })
}

function update(step) {
  return db.query(`
    UPDATE template_steps
       SET name = @name
         , "completionFn" = @completionFn
     WHERE id = @id;
  `, step)
}

function create(step) {
  return db.query(`INSERT INTO template_steps (template_id, index, name, completionFn)
    VALUES (
      @templateId,
      @index,
      @name,
      @completionFn
    )`, step)
}

function updateOrCreate(step) {
  return db.query(`INSERT INTO template_steps (template_id, index, name, "completionFn")
    VALUES (
      @templateId,
      @index,
      @name,
      @completionFn
    )
    ON CONFLICT (template_id, index) DO
    UPDATE
       SET name = @name
         , "completionFn" = @completionFn
  `, step)
}

module.exports.delete = function(id) {
  return db.query('DELETE FROM template_steps WHERE id = @id', { id })
}
