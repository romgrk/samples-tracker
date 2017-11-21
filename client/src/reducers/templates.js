import { get, set, lensPath } from 'ramda'
import { TEMPLATES } from 'constants/ActionTypes'

const initialState = {
  isLoading: false,
  data: []
}

function toLoadable(object) {
  const result = {}
  Object.keys(object).forEach(key => {
    result[key] = { isLoading: false, data: object[key] }
  })
  return result
}

export default function templates(state = initialState, action) {
  switch (action.type) {
    case TEMPLATES.FETCH.REQUEST:
      return { ...state, isLoading: true }
    case TEMPLATES.FETCH.RECEIVE:
      return { ...state, isLoading: false, data: action.payload }
    case TEMPLATES.FETCH.ERROR:
      return { ...state, isLoading: false }
    default:
      return state
  }
}
