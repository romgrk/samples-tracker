/*
 * sample.js
 */


const { rejectMessage } = require('../helpers/promise')
const db = require('../database.js')
const Completion = require('./completion-function')
const File = require('./file')
const History = require('./history')
const Settings = require('./settings')
const Step = require('./step')

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
    File.findBySampleId(sample.id),
    History.findBySampleId(sample.id)
  ])
  .then(([steps, files, history]) => {

    files.forEach(file =>
      steps[file.stepIndex].files.push(file)
    )

    sample.steps = steps
    sample.history = history

    return sample
  })
}

function findAll(includeArchived) {
  return Settings.findByKey('archiveInterval')
    .then(archiveInterval =>
      db.selectAll(`
        SELECT ${columns}
          FROM samples
        WHERE ${includeArchived ?
              '1 = 1' :
              `completed IS NULL
              OR completed + interval '${archiveInterval}' > CURRENT_TIMESTAMP
            `}
      `)
      )
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

          if (!previousSteps.every(isDoneOrSkip))
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
        else if (status === 'SKIP') {
          return true
        }
        else {
          if (nextSteps.some(step => step.status === 'DONE'))
            return rejectMessage(
              `Can't switch status back to ${status} because some step after is already completed.`)
        }

        return true
      })
      /*
       * Second part, we update the step value (if authorized) and update
       * the next step status if applicable:
       */
      .then(() => {
        const actions = []

        /*
         * Set the step status to it's new value
         */
        actions.push(Step.updateStatus(step.id, status))


        /*
         * This procedure sets the next step that needs to be set to IN_PROGRESS to
         * that. It's only used when we're changing a status to either DONE or SKIP.
         */
        const setNextStepInProgress = () => {
          let indexTodo = index
          let nextStepTodo = nextStep

          while(indexTodo < sample.steps.length - 1 && nextStepTodo.status === 'SKIP')
            nextStepTodo = sample.steps[++indexTodo]

          /*
           * If there are more steps, we set the last undone step to IN_PROGRESS, except
           * when status is != NOT_DONE (because if the status is ERROR or ON_HOLD, we
           * want it to stay that way).
           */
          if (nextStepTodo
            && nextStepTodo.status === 'NOT_DONE'
          )
            actions.push(Step.updateStatus(nextStepTodo.id, 'IN_PROGRESS', new Date()))
          /*
           * If there are no more steps, we set the completion date
           */
          else if (indexTodo >= sample.steps.length - 1)
            actions.push(complete(sample.id, true))
        }


        if (status === 'DONE') {

          setNextStepInProgress()

        }
        else if (status === 'SKIP') {

          if (previousSteps.every(isDoneOrSkip))
            setNextStepInProgress()
        }
        else {
          if (nextStep !== undefined && nextStep.status === 'IN_PROGRESS')
            actions.push(Step.updateStatus(nextStep.id, 'NOT_DONE', null))

          if (previousSteps.every(isDoneOrSkip) && status === 'NOT_DONE')
            actions.push(Step.updateStatus(step.id, 'IN_PROGRESS', new Date()))

          if (isDoneOrSkip(step) && nextSteps.length === 0 && sample.completed)
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
    INSERT INTO samples (id, name, tags, notes, created)
      VALUES (
        nextval('samples_id_seq'),
        ${sample.name === null ? `'Sample ' || currval('samples_id_seq')` : `@name`},
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
  return db.query(`
    DELETE FROM samples WHERE id = @id;
    DELETE FROM step    WHERE sample_id = @id;
  `, { id })
}


// Helpers

function isDoneOrSkip(step) {
  return step.status === 'DONE' || step.status === 'SKIP'
}
