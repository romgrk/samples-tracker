import { SHOW, SHOW_NOTIFICATION } from 'constants/ActionTypes'
import { createAction } from 'redux-actions'

const createPayload = (message, details) => ({ message, details })

export const showNotification = createAction(SHOW_NOTIFICATION)
export const showInfo         = createAction(SHOW.INFO, createPayload)
export const showSuccess      = createAction(SHOW.SUCCESS, createPayload)
export const showWarning      = createAction(SHOW.WARNING, createPayload)
export const showError        = createAction(SHOW.ERROR, createPayload)

export default {
  showNotification,
  showInfo,
  showSuccess,
  showWarning,
  showError,
}
