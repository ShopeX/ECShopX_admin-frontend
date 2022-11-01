import fetch from '../utils/fetch'

export function saveShopSetting (query) {
  return fetch({
    url: '/setting/openapi/developer',
    method: 'post',
    params: query
  })
}

export function saveSalesSetting (query) {
  return fetch({
    url: '/setting/openapi/external',
    method: 'post',
    params: query
  })
}

export function getShopSetting () {
  return fetch({
    url: '/setting/openapi/developer',
    method: 'get'
  })
}

export function getSalesSetting (query) {
  return fetch({
    url: '/setting/openapi/external',
    method: 'get',
    params: query
  })
}
