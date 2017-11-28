const express = require('express')
const router = express.Router()

const { dataHandler, errorHandler } = require('../helpers/handlers.js')
const Sample = require('../models/sample.js')

/* GET samples list */
router.get('/list', (req, res, next) => {
  Sample.findAll()
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
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

/* POST update sample */
router.use('/update/:id', (req, res, next) => {
  Sample.update({ ...req.body, id: req.params.id })
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

/* POST complete sample step */
router.use('/update-step-status/:id/:index/:value', (req, res, next) => {
  Sample.updateStepStatus(
    req.params.id,
    Number(req.params.index),
    req.params.value,
    req.user
  )
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

/* POST delete sample */
router.use('/delete/:id', (req, res, next) => {
  Sample.delete(req.params.id)
  .then(dataHandler(res))
  .catch(errorHandler(res))
})


module.exports = router
