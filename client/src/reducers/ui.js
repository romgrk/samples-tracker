import {
  SET_INCLUDE_ARCHIVED,
  SHOW,
  SHOW_NOTIFICATION
} from 'constants/ActionTypes'

const initialState = {
  includeArchived: false,
  notifications: [],
}

export default function ui(state = initialState, action) {
  if (action.error === true) {
    console.error(action.payload)

    return {
      ...state,
      notifications: state.notifications.concat({
        type: 'error',
        message: action.payload.message.replace(/^Error: /, ''),
        //details: stack.join('\n'),
        //stack: getStack(action.payload),
      })
    }
  }

  switch (action.type) {
    case SET_INCLUDE_ARCHIVED:
      return { ...state, includeArchived: action.payload }
    case SHOW_NOTIFICATION:
      return { ...state, notifications: state.notifications.concat(action.payload) }
    case SHOW.INFO:
      return { ...state, notifications: state.notifications.concat({ type: 'info', ...action.payload }) }
    case SHOW.SUCCESS:
      return { ...state, notifications: state.notifications.concat({ type: 'success', ...action.payload }) }
    case SHOW.WARNING:
      return { ...state, notifications: state.notifications.concat({ type: 'warning', ...action.payload }) }
    case SHOW.ERROR:
      return { ...state, notifications: state.notifications.concat({ type: 'error', ...action.payload }) }
    default:
      return state
  }
}

function getStack(error) {
  return (
    error.stack === undefined ?
      undefined :
    Array.isArray(error.stack) ?
      error.stack :
      error.stack.split('\n')
  )
}
