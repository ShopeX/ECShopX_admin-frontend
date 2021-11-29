import fetch from '../utils/fetch'

export function setShopexErpSetting(query) {
  return fetch({
    url: '/third/shopexerp/setting',
    method: 'post',
    params: query
  })
}

export function getShopexErpSetting() {
  return fetch({
    url: '/third/shopexerp/setting',
    method: 'get'
  })
}

export function itemPriceUpdate(query) {
  return fetch({
    url: '/oms/goodsprice/update',
    method: 'put',
    params: query
  })
}
