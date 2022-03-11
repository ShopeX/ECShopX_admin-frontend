import fetch from '../utils/fetch'

export function getFapiaoset (query) {
  return fetch({
    url: '/fapiao/getFapiaoset',
    method: 'get',
    params: query
  })
}
export function saveFapiaoset (query) {
  return fetch({
    url: '/fapiao/saveFapiaoset',
    method: 'post',
    params: query
  })
}

export function getFapiaoList (query) {
  return fetch({
    url: '/fapiaolist',
    method: 'get',
    params: query
  })
}

export function fapiaoSet (query) {
  return fetch({
    url: '/fapiaoset',
    method: 'get',
    params: query
  })
}
