const express = require('express')
const router = express.Router()

const { dataHandler, errorHandler } = require('../helpers/handlers.js')
const File = require('../models/file.js')

/* GET files list */
router.get('/list', (req, res, next) => {
  File.findAll()
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

/* GET single file */
router.get('/get/:id', (req, res, next) => {
  File.findById(req.params.id)
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

/* GET files by sample */
router.get('/sample/:id', (req, res, next) => {
  File.findBySampleId(req.params.id)
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

/* GET read file */
router.get('/read/:id', (req, res, next) => {
  File.findById(req.params.id)
  .then(file =>
    File.read(req.params.id)
    .then(content => {
      res.contentType(file.name)
      res.end(content)
    })
  )
  .catch(errorHandler(res))
})


/* POST delete file */
router.use('/delete/:id', (req, res, next) => {
  File.delete(req.params.id)
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

module.exports = router
