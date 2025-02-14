import fetch from '../utils/fetch'

export function getOfflineAccount(id) {
  return fetch({
    url: '/espier/offline/backaccount/' + id,
    method: 'get'
  })
}

export function createOfflineAccount(params) {
  return fetch({
    url: '/espier/offline/backaccount/create',
    method: 'post',
    params
  })
}

export function updateOfflineAccount(params) {
  return fetch({
    url: '/espier/offline/backaccount/update',
    method: 'post',
    params
  })
}

export function deleteOfflineAccount(id) {
  return fetch({
    url: '/espier/offline/backaccount/' + id,
    method: 'delete'
  })
}
