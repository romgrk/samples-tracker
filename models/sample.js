/*
 * sample.js
 */


const db = require('../database.js')
const Step = require('./step')

module.exports = {
  findAll,
  findById,
  update,
  complete,
  create,
}

const columns = `
    id
  , name
  , tags
  , notes
  , created
  , modified
  , completed
`

function addSteps(sample) {
  return Step.findBySampleId(sample.id)
    .then(steps =>
      (sample.steps = steps, sample)
    )
}

function findAll() {
  return db.selectAll(`SELECT ${columns} FROM samples`)
    .then(samples =>
      Promise.all(samples.map(addSteps))
    )
}

function findById(id) {
  return db.selectOne(`SELECT ${columns} FROM samples WHERE id = @id`, { id })
    .then(addSteps)
}

function update(sample) {
  return Promise.all([
    db.query(`
      UPDATE samples
        SET name = @name
          , tags = @tags
          , notes = @notes
          , modified = now()
      WHERE id = @id`,
      { ...sample, tags: JSON.stringify(sample.tags) }
    ),
  ].concat(sample.steps.map(step => Step.update(step))))
  .then(() => findById(sample.id))
}

function complete(id) {
  return db.query(`
    UPDATE samples
       SET completed = now()
     WHERE id = @id`, { id })
}

function create(sample) {
  return db.insert(`
    INSERT INTO samples (name, tags, notes, created)
      VALUES (
        @name,
        @tags,
        @notes,
        now()
      )`,
    { ...sample, tags: JSON.stringify(sample.tags) }
  )
  .then(sampleId =>
    Step.createMany(sampleId, sample.steps)
      .then(() => findById(sampleId))
  )
}

module.exports.delete = function(id) {
  return db.query('DELETE FROM samples WHERE id = @id', { id })
}
