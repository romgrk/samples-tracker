import { SHOW, SHOW_NOTIFICATION } from 'constants/ActionTypes'

const initialState = {
  notifications: [],
}

export default function ui(state = initialState, action) {
  if (action.error === true) {
    console.error(action.payload)
    return {
      ...state,
      notifications: state.notifications.concat({
        type: 'error',
        message: action.payload.message,
        stack: Array.isArray(action.payload.stack) ? action.payload.stack : action.payload.stack.split('\n'),
      })
    }
  }
  switch (action.type) {
    case SHOW_NOTIFICATION:
      return { ...state, notifications: state.notifications.concat(action.payload) }
    case SHOW.INFO:
      return { ...state, notifications: state.notifications.concat({ type: 'info', ...action.payload }) }
    case SHOW.SUCCESS:
      return { ...state, notifications: state.notifications.concat({ type: 'success', ...action.payload }) }
    case SHOW.WARNING:
      return { ...state, notifications: state.notifications.concat({ type: 'warning', ...action.payload }) }
    case SHOW.ERROR:
      debugger
      return { ...state, notifications: state.notifications.concat({ type: 'error', ...action.payload }) }
    default:
      return state
  }
}
