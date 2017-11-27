import { combineReducers } from 'redux'
import completionFunctions from './completion-functions'
import samples from './samples'
import settings from './settings'
import templates from './templates'
import ui from './ui'

const rootReducer = combineReducers({
  completionFunctions,
  samples,
  settings,
  templates,
  ui,
})

export default rootReducer
