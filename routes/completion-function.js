const express = require('express')
const router = express.Router()

const { dataHandler, errorHandler } = require('../helpers/handlers.js')
const Completion = require('../models/completion-function.js')

/* GET functions list */
router.get('/list', (req, res, next) => {
  Completion.findAll()
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

/* GET single function */
router.get('/get/:id', (req, res, next) => {
  Completion.findById(req.params.id)
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

/* POST update function */
router.use('/update/:id', (req, res, next) => {
  Completion.update({ ...req.body, id: req.params.id })
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

/* POST run function */
router.use('/run/:id', (req, res, next) => {
  Completion.runById(req.params.id, req.body)
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

/* POST update function */
router.use('/delete/:id', (req, res, next) => {
  Completion.delete(req.params.id)
  .then(dataHandler(res))
  .catch(errorHandler(res))
})


module.exports = router
