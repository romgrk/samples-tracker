import { createModelConstants } from '../utils/create-actions.js'

// Notifications
export const SHOW_NOTIFICATION = 'SHOW_NOTIFICATION'
export const SHOW = {
  INFO:    'SHOW.INFO',
  SUCCESS: 'SHOW.SUCCESS',
  WARNING: 'SHOW.WARNING',
  ERROR:   'SHOW.ERROR',
}
// Settings
export const SETTINGS  = createModelConstants('SETTINGS')
// Users
export const USERS     = createModelConstants('USERS')
// Samples
export const SAMPLES   = createModelConstants('SAMPLES', [ 'UPDATE_STEP_STATUS', 'ADD_FILE', 'DELETE_FILE' ])
// Templates
export const TEMPLATES = createModelConstants('TEMPLATES')
// Completion Functions
export const COMPLETION_FUNCTIONS = createModelConstants('COMPLETION_FUNCTIONS')
