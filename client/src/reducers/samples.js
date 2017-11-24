import {
  get,
  set,
  lensPath,
  indexBy,
  prop,
  assoc,
  dissoc
} from 'ramda'
import { SAMPLES } from 'constants/ActionTypes'

import toLoadable from '../utils/to-loadable'

const initialState = {
  isLoading: false,
  isCreating: false,
  data: {}
}

export default function samples(state = initialState, action) {
  switch (action.type) {

    case SAMPLES.FETCH.REQUEST:
      return { ...state, isLoading: true }
    case SAMPLES.FETCH.RECEIVE:
      return { ...state, isLoading: false, data: toLoadable(indexBy(prop('id'), action.payload)) }
    case SAMPLES.FETCH.ERROR:
      return { ...state, isLoading: false }

    case SAMPLES.CREATE.REQUEST:
      return { ...state, isCreating: true }
    case SAMPLES.CREATE.RECEIVE:
      return { ...state, isCreating: false, data:
        assoc(action.payload.id, { isLoading: false, data: action.payload }, state.data) }
    case SAMPLES.CREATE.ERROR:
      return { ...state, isCreating: false }

    case SAMPLES.UPDATE.REQUEST:
      return set(lensPath(['data', action.payload.id, 'isLoading']), true, state)
    case SAMPLES.UPDATE.RECEIVE:
      return set(lensPath(['data', action.meta.id]), { isLoading: false, data: action.payload }, state)
    case SAMPLES.UPDATE.ERROR:
      return set(lensPath(['data', action.meta.id, 'isLoading']), false, state)

    case SAMPLES.DELETE.REQUEST:
      return set(lensPath(['data', action.payload.id, 'isLoading']), true, state)
    case SAMPLES.DELETE.RECEIVE:
      return { ...state, data: dissoc(action.meta.id, state.data) }
    case SAMPLES.DELETE.ERROR:
      return set(lensPath(['data', action.meta.id, 'isLoading']), true, state)

    default:
      return state
  }
}
