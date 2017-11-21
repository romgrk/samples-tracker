import { get, set, lensPath } from 'ramda'
import { SETTINGS } from 'constants/ActionTypes'

const initialState = {
  isLoading: false,
  data: {}
}

function toLoadable(object) {
  const result = {}
  Object.keys(object).forEach(key => {
    result[key] = { isLoading: false, data: object[key] }
  })
  return result
}

export default function settings(state = initialState, action) {
  switch (action.type) {
    case SETTINGS.FETCH.REQUEST:
      return { ...state, isLoading: true }
    case SETTINGS.FETCH.RECEIVE:
      return { ...state, isLoading: false, data: toLoadable(action.payload) }
    case SETTINGS.FETCH.ERROR:
      return { ...state, isLoading: false }
    case SETTINGS.UPDATE.REQUEST:
      return set(lensPath(['data', action.payload.key, 'isLoading']), true, state)
    case SETTINGS.UPDATE.RECEIVE:
    case SETTINGS.UPDATE.ERROR:
      return set(lensPath(['data', action.payload.key]), { isLoading: false, data: action.payload.value }, state)
    default:
      return state
  }
}
