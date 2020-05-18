import config from '../config'
import axios from 'axios'
import {load} from 'react-cookies'

function interpolate (cfg, obj) {
  const baseUrl = cfg.BASE_URL
  let url = ''
  if (baseUrl.indexOf('{') === -1) url = baseUrl

  url = baseUrl.replace(/{([^{}]*)}/g, (match, name) => {
    const rep = obj[name]
    return typeof rep === 'string' || typeof rep === 'number' ? `${rep}` : match
  })

  if (!cfg.IS_ABSOLUTE) url = config.apiUrl + url
  return url
}

function createHeaders (ctx) {
  let headers = {}
  const apiToken = load('_profile_admin__token')
  headers['Content-Type'] = 'application/json'
  headers['Accept'] = 'application/json'
  if (ctx) headers = {...headers, ...ctx}
  if (apiToken) headers.Authorization = apiToken
  return headers
}

function handleError (error) {
  console.error('An error occurred', error)
  return Promise.reject(error.response || error)
}

function toQueryString (params) {
  const parts = []
  for (let key in params) {
    if (params.hasOwnProperty(key)) {
      parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
    }
  }
  return parts.join('&')
}

export function get (cfg, ctx, headers) {
  let url = interpolate(cfg, ctx)
  return axios.get(url, {headers: createHeaders(headers)}).then(response => response.data).catch(handleError)
}

export function getAll (cfg, ctx, headers) {
  let url = interpolate(cfg, ctx)
  return axios.get(url, {headers: createHeaders(headers)}).then(response => response.data).catch(handleError)
}

export function find (cfg, params, ctx) {
  let url = interpolate(cfg, ctx)
  let queryString = toQueryString(params)
  url = `${url}?${queryString}`
  return axios.get(url, {headers: createHeaders()}).then(response => response.data).catch(handleError)
}

export function request (method, cfg, data, ctx, headers) {
  const url = interpolate(cfg, ctx)
  headers = createHeaders(headers)

  return axios({method, url, headers, data}).then(response => response.data).catch(handleError)
}

export function post (cfg, body, ctx, headers) { return request('post', cfg, body, ctx, headers) }
export function put (cfg, body, ctx, headers) { return request('put', cfg, body, ctx, headers) }
export function remove (cfg, body, ctx, headers) { return request('delete', cfg, body, ctx, headers) }
