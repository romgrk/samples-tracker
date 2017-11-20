import { SETTINGS } from 'constants/ActionTypes'
import { createAction } from 'redux-actions'

import { createModelActions } from '../utils/create-actions'
import * as requests from '../requests'

const settings = createModelActions(SETTINGS, {
  fetch:  requests.settings.list,
  update: requests.settings.update,
  delete: () => { throw new Error('unimplemented') },
})
export default settings
