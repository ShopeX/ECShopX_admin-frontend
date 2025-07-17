import fetch from '../utils/fetch'

export function setShopexErpSetting (query) {
  return fetch({
    url: '/third/shopexerp/setting',
    method: 'post',
    params: query
  })
}

export function getShopexErpSetting () {
  return fetch({
    url: '/third/shopexerp/setting',
    method: 'get'
  })
}

export function itemPriceUpdate (query) {
  return fetch({
    url: '/oms/goodsprice/update',
    method: 'put',
    params: query
  })
}

export function getMapSetting () {
  return fetch({
    url: '/third/map/setting',
    method: 'get'
  })
}

export function setMapSetting (query) {
  return fetch({
    url: '/third/map/setting',
    method: 'post',
    params: query
  })
}

export function getWdtErpSetting () {
  return fetch({
    url: '/third/wdterp/setting',
    method: 'get'
  })
}

export function setWdtErpSetting (query) {
  return fetch({
    url: '/third/wdterp/setting',
    method: 'post',
    params: query
  })
}

export function getDmcrmSetting () {
  return fetch({
    url: '/third/dmcrm/setting',
    method: 'get'
  })
}

export function setDmcrmSetting (query) {
  return fetch({
    url: '/third/dmcrm/setting',
    method: 'post',
    params: query
  })
}

export function setJstErpSetting(query) {
  return fetch({
    url: '/third/jushuitan/setting',
    method: 'post',
    data: query
  })
}

export function getJstErpSetting() {
  return fetch({
    url: '/third/jushuitan/setting',
    method: 'get'
  })
}

