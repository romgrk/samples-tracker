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
  update: (id, data) => POST(`/sample/update/${id}`, data),
  delete: (id) => POST(`/sample/delete/${id}`),
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
      return Promise.reject(new Error(data.message))
  })
}

function GET(url, params)  { return fetchAPI(url, params, { method: 'get' }) }
function POST(url, params) { return fetchAPI(url, params, { method: 'post' }) }
