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
    update: createFetchActions(namespace.UPDATE, fns.update,
      (key, value) => ({ key, value }),
      (res, key, value) => ({ key, value })),
    delete: createFetchActions(namespace.DELETE, fns.delete),
  }
}

export function createFetchActions(namespace, fn, contraMapFn, mapFn) {
  const action = createFetchFunction(fn, contraMapFn, mapFn)
  action.request = createAction(namespace.REQUEST)
  action.receive = createAction(namespace.RECEIVE)
  action.error   = createAction(namespace.ERROR)
  return action
}

export function createFetchFunction(fn, contraMapFn = I, mapFn = I) {
  const self = function (...args) {
    return (dispatch, getState) => {

      dispatch(self.request(contraMapFn(...args)))

      fn(...args)
      .then(result => dispatch(self.receive(mapFn(result, ...args))))
      .catch(err =>   dispatch(self.error(err)))
    }
  }
  return self
}
