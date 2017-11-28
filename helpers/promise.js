/*
 * promise.js
 */


module.exports = {
  rejectMessage,
}

function rejectMessage(message) {
  return Promise.reject(new Error(message))
}
