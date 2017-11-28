/*
 * create-actions.js
 */

import { createAction } from 'redux-actions'


export function createModelConstants(namespace) {
  return {
    FETCH:  createNetworkConstants(`${namespace}.FETCH`),
    CREATE: createNetworkConstants(`${namespace}.CREATE`),
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
    create: createFetchActions(namespace.CREATE, fns.create,
      (key, value) => ({ key, value }),
      (res, key, value) => ({ key, value })),
    update: createFetchActions(namespace.UPDATE, fns.update,
      (key, value) => ({ key, value }),
      (res, key, value) => ({ key, value }),
      (err, key, value) => ({ key, value })),
    delete: createFetchActions(namespace.DELETE, fns.delete),
  }
}

export function createFetchActions(namespace, fn, contraMapFn, mapFn, errorMapFn) {
  if (fn === undefined) {
    console.warn('Received undefined function for namespace:', namespace)
    return undefined
  }
  const action = createFetchFunction(fn, contraMapFn, mapFn, errorMapFn)
  action.request = createAction(namespace.REQUEST, contraMapFn)
  action.receive = createAction(namespace.RECEIVE, undefined, mapFn)
  action.error   = createAction(namespace.ERROR, undefined, errorMapFn)
  return action
}

export function createFetchFunction(fn) {
  const self = function (...args) {
    return (dispatch, getState) => {

      dispatch(self.request(...args))

      return fn(...args)
      .then(result => {
        dispatch(self.receive(result, ...args))
        return result
      })
      .catch(err =>   dispatch(self.error(err, ...args)))
    }
  }
  return self
}
