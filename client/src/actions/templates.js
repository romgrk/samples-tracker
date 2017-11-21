import { TEMPLATES } from 'constants/ActionTypes'
import { createAction } from 'redux-actions'

import { createFetchActions } from '../utils/create-actions'
import * as requests from '../requests'

const templates = {
  fetch:  createFetchActions(TEMPLATES.FETCH,  requests.templates.list),
  update: createFetchActions(TEMPLATES.UPDATE, requests.templates.update,
    (id, data) => ({ id, data }),
    (res, id, data) => ({ id, data }),
    (err, id, data) => ({ id, data })),
  create: createFetchActions(TEMPLATES.CREATE, requests.templates.create,
    (id, data) => ({ id, data }),
    (res, id, data) => ({ id, data }),
    (err, id, data) => ({ id, data })),
  delete: createFetchActions(TEMPLATES.DELETE, requests.templates.delete,
    undefined,
    (res, id, data) => ({ id, data }),
    (err, id, data) => ({ id, data })),
}
export default templates
