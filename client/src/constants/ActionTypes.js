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
export const SETTINGS = createModelConstants('SETTINGS')
// Users
export const USERS    = createModelConstants('USERS')
// Samples
export const SAMPLES  = createModelConstants('SAMPLES')
