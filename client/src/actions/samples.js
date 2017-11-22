import { SAMPLES } from 'constants/ActionTypes'
import { createAction } from 'redux-actions'

import { createFetchActions } from '../utils/create-actions'
import * as requests from '../requests'

const samples = {
  fetch:  createFetchActions(SAMPLES.FETCH,  requests.samples.list),
  update: createFetchActions(SAMPLES.UPDATE, requests.samples.update,
    (id, data) => ({ id, data }),
    (res, id, data) => ({ id, data }),
    (err, id, data) => ({ id, data })),
  create: createFetchActions(SAMPLES.CREATE, requests.samples.create,
    (id, data) => ({ id, data }),
    (res, id, data) => ({ id, data }),
    (err, id, data) => ({ id, data })),
  delete: createFetchActions(SAMPLES.DELETE, requests.samples.delete,
    undefined,
    (res, id, data) => ({ id, data }),
    (err, id, data) => ({ id, data })),
}
export default samples
