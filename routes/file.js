const express = require('express')
const router = express.Router()

const { dataHandler, errorHandler } = require('../helpers/handlers.js')
const parseForm = require('../helpers/parse-form')
const File = require('../models/file.js')
const History = require('../models/history.js')

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
router.get('/read/:id/:name?', (req, res, next) => {
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

/* GET download file */
router.get('/download/:id', (req, res, next) => {
  File.findById(req.params.id)
  .then(file => {
    res.download(file.path, file.name)
    res.contentType(file.name)
  })
  .catch(errorHandler(res))
})

/* POST create file */
router.use('/create/:sampleId/:stepIndex', (req, res, next) => {
  const sampleId  = req.params.sampleId
  const stepIndex = Number(req.params.stepIndex)

  parseForm(req)
  .then(({ fields, files: { file } }) =>
    File.create({
      sampleId,
      stepIndex,
      name: file.name,
      mime: file.type,
    }, file.path)
  )
  .then(file => {
    History.create({
      sampleId: sampleId,
      stepIndex: stepIndex,
      userId: req.user.id,
      description: `added file ${file.name}`
    })
    return file
  })
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

/* POST delete file */
router.use('/delete/:id', (req, res, next) => {
  File.findById(req.params.id)
  .then(file =>
    File.delete(req.params.id)
    .then(() => {
      History.create({
        sampleId: file.sampleId,
        stepIndex: file.stepIndex,
        userId: req.user.id,
        description: `deleted file ${file.name}`
      })
      return file
    })
  )
  .then(dataHandler(res))
  .catch(errorHandler(res))
})

module.exports = router
