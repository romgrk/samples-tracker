const express = require('express')
const router = express.Router()

const generateHistoryEntry = require('../helpers/generate-history-entry')
const { dataHandler, errorHandler } = require('../helpers/handlers.js')
const Sample = require('../models/sample.js')
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

    const entry = generateHistoryEntry(
      req.user,
      JSON.parse(JSON.stringify(sample)),
      req.body
    )

    return Sample.update({ ...req.body, id: req.params.id })
    .then(updatedSample => {
      History.create(entry)
      return updatedSample
    })
  })
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

/* POST complete sample step */
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
  .then
  .then(dataHandler(res))
  .catch(errorHandler(res))
})


module.exports = router
