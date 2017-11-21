import { SHOW, SHOW_NOTIFICATION } from 'constants/ActionTypes'

const initialState = {
  notifications: [],
}

export default function ui(state = initialState, action) {
  switch (action.type) {
    case SHOW_NOTIFICATION:
      return { ...state, notifications: state.notifications.concat(action.payload) }
    case SHOW.INFO:
      return { ...state, notifications: state.notifications.concat({ type: 'info', message: action.payload }) }
    case SHOW.SUCCESS:
      return { ...state, notifications: state.notifications.concat({ type: 'success', message: action.payload }) }
    case SHOW.WARNING:
      return { ...state, notifications: state.notifications.concat({ type: 'warning', message: action.payload }) }
    case SHOW.ERROR:
      return { ...state, notifications: state.notifications.concat({ type: 'error', message: action.payload }) }
    default:
      return state
  }
}
