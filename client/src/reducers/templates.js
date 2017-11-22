import { get, set, lensPath } from 'ramda'
import { TEMPLATES } from 'constants/ActionTypes'

import toLoadable from '../utils/to-loadable'

const initialState = {
  isLoading: false,
  data: {}
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
