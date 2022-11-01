import fetch from '../utils/fetch'

export function getInfo (params) {
  return fetch({
    url: '/shops/protocol',
    method: 'get',
    params
  })
}

export function saveInfo (params) {
  return fetch({
    url: '/shops/protocol',
    method: 'put',
    params
  })
}
