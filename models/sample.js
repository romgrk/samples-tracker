/*
 * sample.js
 */


const { rejectMessage } = require('../helpers/promise')
const db = require('../database.js')
const Step = require('./step')
const File = require('./file')
const Completion = require('./completion-function')

module.exports = {
  findAll,
  findById,
  update,
  updateStepStatus,
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

function addDetails(sample) {
  return Promise.all([
    Step.findBySampleId(sample.id),
    File.findBySampleId(sample.id)
  ])
  .then(([steps, files]) => {

    console.log(files)
    files.forEach(file =>
      steps[file.stepIndex].files.push(file)
    )

    sample.steps = steps

    return sample
  })
}

function findAll() {
  return db.selectAll(`SELECT ${columns} FROM samples`)
    .then(samples =>
      Promise.all(samples.map(addDetails))
    )
}

function findById(id) {
  return db.selectOne(`SELECT ${columns} FROM samples WHERE id = @id`, { id })
    .then(addDetails)
}

function update(sample) {
  return Promise.all([
    db.query(`
      UPDATE samples
        SET name = @name
          , tags = @tags
          , notes = @notes
          , modified = CURRENT_TIMESTAMP
      WHERE id = @id`,
      { ...sample, tags: JSON.stringify(sample.tags) }
    ),
  ].concat(sample.steps.map(step => Step.update(step))))
  .then(() => findById(sample.id))
}

function updateStepStatus(id, index, status, user) {
  return findById(id)
    .then(sample => {
      const step = sample.steps[index]
      const context = {
        sample,
        index,
        user,
      }

      if (status === 'DONE') {
        if (!sample.steps.slice(0, index).every(step => step.status === 'DONE'))
          return rejectMessage(`Can't complete step before completing those before.`)

        if (step.completionFn !== null)
          return Completion.runById(step.completionFn, context)
            .then(() => Step.updateStatus(step.id, status))
            .then(() => index === sample.steps.length - 1 ? complete(id) : undefined)
      }

      if (status !== 'DONE') {
        if (sample.steps.slice(index + 1).some(step => step.status === 'DONE'))
          return rejectMessage(`Can't switch status back to ${status} because some step after is already completed.`)
      }

      return Step.updateStatus(step.id, status)
    })
    .then(() => status)
}

function complete(id) {
  return db.query(`
    UPDATE samples
       SET completed = CURRENT_TIMESTAMP
     WHERE id = @id`, { id })
}

function create(sample) {
  return db.insert(`
    INSERT INTO samples (name, tags, notes, created)
      VALUES (
        @name,
        @tags,
        @notes,
        CURRENT_TIMESTAMP
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
