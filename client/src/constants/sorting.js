/*
 * sorting.js
 */

import Status from '../constants/status'
import getStatus from '../utils/get-status'

export const sortCriteria = [
  { k: 'BY_TAG',       name: 'tag',               fn: byTag },
  { k: 'BY_STATUS',    name: 'status',            fn: byStatus },
  { k: 'BY_NAME',      name: 'name',              fn: byName },
  { k: 'BY_CREATED',   name: 'creation date',     fn: byCreated },
  { k: 'BY_MODIFIED',  name: 'modification date', fn: byModified },
  { k: 'BY_COMPLETED', name: 'completion date',   fn: byCompleted },
]

const nameByConstant = sortCriteria.reduce((acc, cur) => (acc[cur.k] = cur.name, acc), {})
const fnByConstant   = sortCriteria.reduce((acc, cur) => (acc[cur.k] = cur.fn, acc), {})
const constants      = sortCriteria.reduce((acc, cur) => (acc[cur.k] = cur.k, acc), {})

export default constants
export const getName = k => nameByConstant[k]

export function sort(criteria, samples) {
  return samples.sort((a, b) => {
    let res = 0
    let i = 0
    while (res === 0 && i < criteria.length) {
      res = fnByConstant[criteria[i++]](a, b)
    }
    return res
  })
}


function byTag(a, b) {
  const as = a.data.tags
  const bs = b.data.tags

  const commonLength = Math.min(as.length, bs.length)

  for (let i = 0; i < commonLength; i++) {
    const res = as[i].localeCompare(bs[i])

    if (res !== 0)
      return res
  }

  return as.length < bs.length ?  -1 :
         as.length > bs.length ?  +1 : 0
}


const statusOrder = {
  [Status.ERROR]: 1,
  [Status.ON_HOLD]: 2,
  [Status.IN_PROGRESS]: 3,
  [Status.DONE]: 4,
}
function byStatus(a, b) {
  const as = getStatus(a.data)
  const bs = getStatus(b.data)

  return statusOrder[as] - statusOrder[bs]
}


function byName(a, b) {
  return a.data.name.localeCompare(b.data.name)
}


function byCreated(a, b) {
  return Date.parse(a.data.created) - Date.parse(a.data.created)
}


function byModified(a, b) {
  return Date.parse(a.data.modified) - Date.parse(a.data.modified)
}


function byCompleted(a, b) {
  if (a.data.completed === null || b.data.completed === null) {
    return a.data.completed === null && b.data.completed !== null ? -1 :
           a.data.completed !== null && b.data.completed === null ? +1 : 0
  }
  return Date.parse(a.data.completed) - Date.parse(a.data.completed)
}
