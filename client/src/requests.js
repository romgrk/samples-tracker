/*
 * requests.js
 */


import axios from 'axios'

import queryString from './utils/query-string'



export const settings = {
  list: () => GET('/settings/list'),
  update: (key, value) => POST(`/settings/update/${key}`, { value }),
}

export const users = {
  list: () => GET('/user/list'),
  get: (id) => GET(`/user/get/${id}`),
  update: (id, data) => POST(`/user/update/${id}`, data),
  delete: (id) => POST(`/user/delete/${id}`),
}

export const samples = {
  list: () => GET('/sample/list'),
  get: (id) => GET(`/sample/get/${id}`),
  create: (data) => POST(`/sample/create`, data),
  update: (id, data) => POST(`/sample/update/${id}`, data),
  delete: (id) => POST(`/sample/delete/${id}`),
}

export const steps = {
  list: () => GET('/step/list'),
  get: (id) => GET(`/step/get/${id}`),
  update: (id, data) => POST(`/step/update/${id}`, data),
  delete: (id) => POST(`/step/delete/${id}`),
}

export const templates = {
  list: () => GET('/template/list'),
  get: (id) => GET(`/template/get/${id}`),
  create: (data) => POST(`/template/create`, data),
  update: (id, data) => POST(`/template/update/${id}`, data),
  delete: (id) => POST(`/template/delete/${id}`),
}

export const history = {
  list: () => GET('/history/list'),
  get: (sampleId) => GET(`/history/sample/${sampleId}`),
  create: (id, data) => POST(`/history/create/${id}`, data),
}

export const completionFunctions = {
  list: () => GET('/completion-function/list'),
  get: (id) => GET(`/completion-function/get/${id}`),
  create: (data) => POST(`/completion-function/create`, data),
  update: (id, data) => POST(`/completion-function/update/${id}`, data),
  delete: (id) => POST(`/completion-function/delete/${id}`),
}


function fetchAPI(url, params, options = {}) {
  let { method = 'get', ...other } = options

  let finalURL = process.env.PUBLIC_URL + '/api' + url
  let data = undefined

  if (method === 'post' && params)
    data = params

  if (method === 'get' && params)
    finalURL += `?${queryString(params)}`

  const config = {
    method: method,
    url: finalURL,
    data: data,
    ...other
  }

  return axios(config).then(({ data }) => {
    if (data.ok)
      return Promise.resolve(data.data)
    else
      return Promise.reject(createError(data))
  })
}

function GET(url, params)  { return fetchAPI(url, params, { method: 'get' }) }
function POST(url, params) { return fetchAPI(url, params, { method: 'post' }) }

function createError(data) {
  const e = new Error(data.message)
  e.stack = data.stack
  return e
}
