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
  setModified,
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

function setModified(id) {
  return db.query(`
    UPDATE samples
       SET modified = CURRENT_TIMESTAMP
     WHERE id = @id`,
    { id })
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
      const step     = sample.steps[index]
      const nextStep = sample.steps[index + 1]
      const previousSteps = sample.steps.slice(0, index)
      const nextSteps     = sample.steps.slice(index + 1)

      return Promise.resolve()
      /*
       * First part, we need to check wether or not we authorize the
       * step to have it's value changed:
       */
      .then(() => {
        if (status === 'DONE') {

          if (!previousSteps.every(step => step.status === 'DONE'))
            return rejectMessage(`Can't complete step before completing those before.`)

          if (step.completionFn !== null) {
            const context = {
              sample,
              index,
              user,
            }

            return Completion.runById(step.completionFn, context)
          }
        }
        else if (step.status === 'IN_PROGRESS' && status === 'NOT_DONE') {
          return rejectMessage(`Step will stay in progress.`)
        }
        else /* if (status !== 'DONE' && step.status !== 'IN_PROGRESS') */ {
          if (nextSteps.some(step => step.status === 'DONE'))
            return rejectMessage(`Can't switch status back to ${status} because some step after is already completed.`)
        }

        return true
      })
      /*
       * Second part, we update the step value (if authorized) and update
       * the next step status if applicable:
       */
      .then(() => {
        const actions = []
        actions.push(Step.updateStatus(step.id, status, null))

        if (status === 'DONE') {

          if (nextSteps.length === 0)
            actions.push(complete(sample.id))

          if (nextStep !== undefined && nextStep.status === 'NOT_DONE')
            actions.push(Step.updateStatus(nextStep.id, 'IN_PROGRESS', new Date()))
        }
        else {
          if (nextStep !== undefined && nextStep.status === 'IN_PROGRESS')
            actions.push(Step.updateStatus(nextStep.id, 'NOT_DONE', null))

          if (previousSteps.every(step => step.status === 'DONE') && status === 'NOT_DONE')
            actions.push(Step.updateStatus(step.id, 'IN_PROGRESS', new Date()))

          if (step.status === 'DONE' && nextSteps.length === 0 && sample.completed)
            actions.push(complete(sample.id, false))
        }

        actions.push(setModified(id))

        return Promise.all(actions)
      })
    })
    .then(() => findById(id))
}

function complete(id, completed = true) {
  return db.query(`
    UPDATE samples
       SET completed = ${ completed ? 'CURRENT_TIMESTAMP' : 'NULL' }
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
