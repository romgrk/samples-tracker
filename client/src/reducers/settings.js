import { SETTINGS } from 'constants/ActionTypes'

const initialState = {
  isLoading: false,
  data: {}
}

export default function settings(state = initialState, action) {
  switch (action.type) {
    case SETTINGS.FETCH.REQUEST:
      return { ...state, isLoading: true }
    case SETTINGS.FETCH.RECEIVE:
      return { ...state, isLoading: false, data: action.payload }
    case SETTINGS.FETCH.ERROR:
      return { ...state, isLoading: false }
    case SETTINGS.UPDATE.REQUEST:
      return { ...state, isLoading: true }
    case SETTINGS.UPDATE.RECEIVE:
      return {
        isLoading: false,
        data: {
          ...state.data,
          [action.payload.key]: action.payload.value,
        }
      }
    case SETTINGS.UPDATE.ERROR:
      return { ...state, isLoading: false }
    default:
      return state
  }
}
