/*
 * generate-history-entry.js
 */

const { diff } = require('deep-diff')

module.exports = function generateHistoryEntry(user, a, b) {

  let differences = diff(a, b)

  differences = differences.filter(d => {
    return (d.path[0] !== 'history')
  })

  if (differences.length === 0)
    return undefined

  let difference = differences[0]
  let property = difference.path[0]

  let description
  let stepIndex = null

  if (property === 'notes') {
    if (difference.rhs === '')
      description = 'deleted notes'
    else
      description = 'modified notes'
  }
  else if (property === 'tags') {

    if (difference.kind === 'A') {
      if (difference.item.kind === 'N') {
        description = `added tag “${difference.item.rhs}”`
      }
      else if (difference.item.kind === 'D') {
        description = `deleted tag “${difference.item.lhs}”`
      }
    }
    else /* kind === E */ {
      description = `deleted tag “${difference.lhs}”`
    }
  }
  else if (property === 'steps') {
    stepIndex = difference.path[1]

    const stepProperty = difference.path[2]

    if (stepProperty === 'notes') {
      if (difference.rhs === '')
        description = 'deleted step notes'
      else
        description = 'modified step notes'
    }
    else {
      description = `set “${difference.path[2]}” to “${difference.rhs}”`
    }
  }
  else {
    description = 'updated sample'
  }

  return {
    sampleId: a.id,
    stepIndex: stepIndex,
    userId: user.id,
    description: description
  }
}
