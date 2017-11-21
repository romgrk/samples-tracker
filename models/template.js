/*
 * template.js
 */


const db = require('../database.js')
const Step = require('./step.js')

module.exports = {
  findAll,
  findById,
  update,
  create,
}

function addSteps(template) {
  return Step.findByTemplateId(template.id)
    .then(steps => (template.steps = steps, template))
}

function findAll() {
  return db.selectAll('SELECT * FROM templates')
    .then(templates => Promise.all(templates.map(addSteps)))
}

function findById(id) {
  return db.selectOne('SELECT * FROM templates WHERE id = @id', { id }).then(addSteps)
}

function update(template) {
  return db.query('UPDATE templates SET name = @name WHERE id = @id', template)
    .then(() =>
      Promise.all(template.steps.map(step => Step.update(step)))
    )
}

function create(template) {
  return db.insert('INSERT INTO templates (name) VALUES (@name)', template)
    .then(templateId =>
      Promise.all(template.steps.map(step => Step.create({ ...step, templateId })))
    )
}

module.exports.delete = function(id) {
  return db.query('DELETE FROM templates WHERE id = @id', { id })
}
