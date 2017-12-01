import { SET_INCLUDE_ARCHIVED } from '../constants/ActionTypes'
import { createAction } from 'redux-actions'

import samples from './samples'

export function setIncludeArchived(value) {
  return (dispatch, getState) => {
    dispatch(setIncludeArchived.action(value))
    dispatch(samples.fetch())
  }
}
setIncludeArchived.action = createAction(SET_INCLUDE_ARCHIVED)

export default {
  setIncludeArchived,
}
