const express = require('express')
const router = express.Router()

const { dataHandler, errorHandler } = require('../helpers/handlers.js')
const Step = require('../models/step.js')

/* GET steps list */
router.get('/list', (req, res, next) => {
  Step.findAll()
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

/* GET single step */
router.get('/get/:id', (req, res, next) => {
  Step.findById(req.params.id)
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

/* GET single step */
router.get('/sample/:id', (req, res, next) => {
  Step.findBySampleId(req.params.id)
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

/* POST update step */
router.use('/update/:id', (req, res, next) => {
  Step.update({ ...req.body, id: req.params.id })
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

/* POST update step */
router.use('/update-status/:id/:status', (req, res, next) => {
  Step.updateStatus(req.params.id, req.params.status)
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

/* POST update step */
router.use('/delete/:id', (req, res, next) => {
  Step.delete(req.params.id)
  .then(dataHandler(res))
  .catch(errorHandler(res))
})


module.exports = router
