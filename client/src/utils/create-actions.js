/*
 * create-actions.js
 */

import { createAction } from 'redux-actions'

const I = x => x


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
  if (fn === undefined)
    return undefined
  const action = createFetchFunction(fn, contraMapFn, mapFn, errorMapFn)
  action.request = createAction(namespace.REQUEST)
  action.receive = createAction(namespace.RECEIVE, undefined, mapFn)
  action.error   = createAction(namespace.ERROR, undefined, errorMapFn)
  return action
}

export function createFetchFunction(fn, contraMapFn = I, mapFn = I, errorMapFn = I) {
  const self = function (...args) {
    return (dispatch, getState) => {

      dispatch(self.request(contraMapFn(...args)))

      fn(...args)
      .then(result => dispatch(self.receive(result, ...args)))
      .catch(err =>   dispatch(self.error(err, ...args)))
    }
  }
  return self
}

/*function reateAction(type, payloadCreator = I, metaCreator) {
 *
 *  const finalPayloadCreator = payloadCreator == undefined || payloadCreator === I
 *    ? I
 *    : (head, ...args) => (head instanceof Error
 *      ? head : payloadCreator(head, ...args));
 *
 *  const hasMeta = isFunction(metaCreator);
 *  const typeString = type.toString();
 *
 *  const actionCreator = (...args) => {
 *    const payload = finalPayloadCreator(...args);
 *    const action = { type };
 *
 *    if (payload instanceof Error) {
 *      action.error = true;
 *    }
 *
 *    if (payload !== undefined) {
 *      action.payload = payload;
 *    }
 *
 *    if (hasMeta) {
 *      action.meta = metaCreator(...args);
 *    }
 *
 *    return action;
 *  };
 *
 *  actionCreator.toString = () => typeString;
 *
 *  return actionCreator;
 *}*/
