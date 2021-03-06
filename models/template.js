/*
 * template.js
 */


const db = require('../database.js')
const TemplateStep = require('./template-step.js')

module.exports = {
  findAll,
  findById,
  update,
  create,
}

function addSteps(template) {
  return TemplateStep.findByTemplateId(template.id)
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
      Promise.all(template.steps.map((step, index) => TemplateStep.delete(step.id)))
    )
    .then(() =>
      Promise.all(template.steps.map((step, index) =>
          TemplateStep.updateOrCreate({ ...step, templateId: template.id, index }))
      )
    )
    .then(() => findById(template.id))
}

function create(template) {
  return db.insert('INSERT INTO templates (name) VALUES (@name)', template)
    .then((templateId, index) =>
      Promise.all(template.steps.map(step => TemplateStep.create({ ...step, templateId, index })))
        .then(() => findById(templateId))
    )
}

module.exports.delete = function(id) {
  return db.query('DELETE FROM templates WHERE id = @id', { id })
}
