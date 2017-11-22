import { get, set, lensPath } from 'ramda'
import { SAMPLES } from 'constants/ActionTypes'

import toLoadable from '../utils/to-loadable'

const initialState = {
  isLoading: false,
  data: {}
}

export default function samples(state = initialState, action) {
  switch (action.type) {
    case SAMPLES.FETCH.REQUEST:
      return { ...state, isLoading: true }
    case SAMPLES.FETCH.RECEIVE:
      return { ...state, isLoading: false, data: toLoadable(action.payload) }
    case SAMPLES.FETCH.ERROR:
      return { ...state, isLoading: false }
    case SAMPLES.UPDATE.REQUEST:
      return set(lensPath(['data', action.payload.id, 'isLoading']), true, state)
    case SAMPLES.UPDATE.RECEIVE:
      return set(lensPath(['data', action.meta.id]), { isLoading: false, data: action.payload }, state)
    case SAMPLES.UPDATE.ERROR:
      return set(lensPath(['data', action.meta.id, 'isLoading']), false, state)
    default:
      return state
  }
}
