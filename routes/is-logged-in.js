const express = require('express')
const router = express.Router()

const { dataHandler, errorHandler } = require('../helpers/handlers.js')
const { rejectMessage } = require('../helpers/promise.js')

/* GET check if user is logged in */
router.use('/', (req, res, next) => {
  (
    req.isAuthenticated() ?
      Promise.resolve() :
      rejectMessage('Not logged in')
  )
  .then(dataHandler(res))
  .catch(errorHandler(res))
})


module.exports = router
