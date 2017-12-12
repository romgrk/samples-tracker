const express = require('express')
const router = express.Router()

const generateHistoryEntry = require('../helpers/generate-history-entry')
const { okHandler, dataHandler, errorHandler } = require('../helpers/handlers.js')
const parseForm = require('../helpers/parse-form')
const Sample = require('../models/sample.js')
const File = require('../models/file.js')
const History = require('../models/history.js')

/* GET samples list */
router.get('/list', (req, res, next) => {
  Sample.findAll(req.query.includeArchived === 'true')
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

/* GET single sample */
router.get('/get/:id', (req, res, next) => {
  Sample.findById(req.params.id)
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

/* POST create sample */
router.use('/create', (req, res, next) => {
  Sample.create(req.body)
  .then(sample => {
    History.create({
      sampleId: sample.id,
      stepIndex: null,
      userId: req.user.id,
      description: `created sample`
    })
    return sample
  })
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

/* POST update sample */
router.use('/update/:id', (req, res, next) => {
  Sample.findById(req.params.id)
  .then(sample => {

    return Sample.update({ ...req.body, id: req.params.id })
    .then(updatedSample => {

      const entry = generateHistoryEntry(
        req.user,
        JSON.parse(JSON.stringify(sample)),
        req.body
      )

      if (entry)
        History.create(entry)

      return updatedSample
    })
  })
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

/* POST update step status */
router.use('/update-step-status/:id/:index/:status', (req, res, next) => {
  const sampleId = req.params.id
  const stepIndex = Number(req.params.index)
  const status = req.params.status

  Sample.updateStepStatus(sampleId, stepIndex, status, req.user)
  .then(sample => {
    History.create({
      sampleId: sampleId,
      stepIndex: stepIndex,
      userId: req.user.id,
      description: `changed status to ${status}`
    })
    return sample
  })
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

/* POST delete sample */
router.use('/delete/:id', (req, res, next) => {
  Sample.delete(req.params.id)
  .then(dataHandler(res))
  .catch(errorHandler(res))
})


/*
 * POST update step status/state [EXTERNAL USAGE]
 * This route is to be used by external software to update
 * a sample/step status, notes, and files
 */
router.use('/update-step/:id/:index', (req, res, next) => {
  const sampleId = req.params.id
  const stepIndex = Number(req.params.index)

  parseForm(req)
  .then(({ fields: { status, notes }, files }) => {

    const actions = []

    actions.push(Sample.updateStepStatus(sampleId, stepIndex, status, req.user)
    .then(sample => {
      History.create({
        sampleId: sampleId,
        stepIndex: stepIndex,
        userId: req.user.id,
        description: `changed status to ${status}`
      })
      return sample
    })
    .then(sample => {
      sample.notes += `\n${new Date().toJSON().replace(/T.*/)}: ${notes}`
      return Sample.update(sample)
    }))

    actions.push(Object.values(files).map(file =>
      File.create({
        sampleId,
        stepIndex,
        name: file.name,
        mime: file.type,
      }, file.path)
      .then(file => {
        History.create({
          sampleId: sampleId,
          stepIndex: stepIndex,
          userId: req.user.id,
          description: `added file ${file.name}`
        })
        return file
      })
    ))

    return Promise.all(actions)
  })
  .then(okHandler(res))
  .catch(errorHandler(res))
})


module.exports = router
