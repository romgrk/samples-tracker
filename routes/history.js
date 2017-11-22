const express = require('express')
const router = express.Router()

const { dataHandler, errorHandler } = require('../helpers/handlers.js')
const History = require('../models/history.js')

/* GET historys list */
router.get('/list', (req, res, next) => {
  History.findAll()
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

/* GET single history */
router.get('/get/:id', (req, res, next) => {
  History.findById(req.params.id)
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

/* GET single history */
router.get('/sample/:id', (req, res, next) => {
  History.findBySampleId(req.params.id)
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

/* POST create history */
router.use('/create', (req, res, next) => {
  History.create({ ...req.body, userId: req.user.id })
  .then(dataHandler(res))
  .catch(errorHandler(res))
})


module.exports = router
