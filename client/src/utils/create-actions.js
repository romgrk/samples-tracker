/*
 * create-actions.js
 */

import { createAction } from 'redux-actions'

const I = x => x


export function createModelConstants(namespace) {
  return {
    FETCH:  createNetworkConstants(`${namespace}.FETCH`),
    UPDATE: createNetworkConstants(`${namespace}.UPDATE`),
    DELETE: createNetworkConstants(`${namespace}.DELETE`),
  }
}
export function createNetworkConstants(namespace) {
  return {
    REQUEST: `${namespace}.REQUEST`,
    RECEIVE: `${namespace}.RECEIVE`,
    ERROR:   `${namespace}.ERROR`,
  }
}


export function createModelActions(namespace, fns) {
  return {
    fetch:  createFetchActions(namespace.FETCH,  fns.fetch),
    update: createFetchActions(namespace.UPDATE, fns.update, (res, args) => ({ key: args[0], value: args[1] })),
    delete: createFetchActions(namespace.DELETE, fns.delete),
  }
}

export function createFetchActions(namespace, fn, process) {
  const action = createFetchFunction(fn, process)
  action.request = createAction(namespace.REQUEST)
  action.receive = createAction(namespace.RECEIVE)
  action.error   = createAction(namespace.ERROR)
  return action
}

export function createFetchFunction(fn, process = I) {
  const self = function (...args) {
    return (dispatch, getState) => {

      dispatch(self.request())

      fn(...args)
      .then(result => dispatch(self.receive(process(result, args))))
      .catch(err =>   dispatch(self.error(err)))
    }
  }
  return self
}
