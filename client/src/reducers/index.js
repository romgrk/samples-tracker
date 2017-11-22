import { combineReducers } from 'redux'
import samples from './samples'
import settings from './settings'
import templates from './templates'
import ui from './ui'

const rootReducer = combineReducers({
  samples,
  settings,
  templates,
  ui,
})

export default rootReducer
