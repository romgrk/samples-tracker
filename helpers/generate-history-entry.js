/*
 * generate-history-entry.js
 */

const { diff } = require('deep-diff')

module.exports = function generateHistoryEntry(user, a, b) {

  let differences = diff(a, b)
  console.log(JSON.stringify(a))
  console.log(JSON.stringify(b))

  differences = differences.filter(d => {
    return (d.path[0] !== 'history')
  })

  console.log(differences)

  return {
    sampleId: a.id,
    stepIndex: null,
    userId: user.id,
    description: ''
  }
}
