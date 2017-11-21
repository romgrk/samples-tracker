import { SHOW } from 'constants/ActionTypes'
import { createAction } from 'redux-actions'

export const showInfo    = createAction(SHOW.INFO)
export const showSuccess = createAction(SHOW.SUCCESS)
export const showWarning = createAction(SHOW.WARNING)
export const showError   = createAction(SHOW.ERROR)

export default {
  showInfo,
  showSuccess,
  showWarning,
  showError,
}
