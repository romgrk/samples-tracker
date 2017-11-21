import { SHOW, SHOW_NOTIFICATION } from 'constants/ActionTypes'
import { createAction } from 'redux-actions'

export const showNotification = createAction(SHOW_NOTIFICATION)
export const showInfo         = createAction(SHOW.INFO)
export const showSuccess      = createAction(SHOW.SUCCESS)
export const showWarning      = createAction(SHOW.WARNING)
export const showError        = createAction(SHOW.ERROR)

export default {
  showNotification,
  showInfo,
  showSuccess,
  showWarning,
  showError,
}
