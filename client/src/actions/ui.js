import { UI } from '../constants/ActionTypes'
import { createAction } from 'redux-actions'

import samples from './samples'

export function setIncludeArchived(value) {
  return (dispatch, getState) => {
    dispatch(setIncludeArchived.action(value))
    dispatch(samples.fetch())
  }
}
setIncludeArchived.action = createAction(UI.SET_INCLUDE_ARCHIVED)

export const setSortingCriteria = createAction(UI.SET_SORTING_CRITERIA)
export const setSortingReverse  = createAction(UI.SET_SORTING_REVERSE)
export const addFilteringTag    = createAction(UI.ADD_FILTERING_TAG)
export const deleteFilteringTag = createAction(UI.DELETE_FILTERING_TAG)
export const setFilteringTags   = createAction(UI.SET_FILTERING_TAGS)

export default {
  setIncludeArchived,
  setSortingCriteria,
  setSortingReverse,
  addFilteringTag,
  deleteFilteringTag,
  setFilteringTags,
}
