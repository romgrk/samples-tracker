import { combineReducers } from 'redux'
import settings from './settings'
import templates from './templates'
import ui from './ui'

const rootReducer = combineReducers({
  settings,
  templates,
  ui,
})

export default rootReducer
