import fetch from '../utils/fetch'

// 员工内购
export function getPurchaseList(query) {
  return fetch({
    url: '/promotions/employeepurchase/lists',
    method: 'get',
    params: query
  })
}

export function createPurchase(query) {
  return fetch({
    url: '/promotions/employeepurchase/create',
    method: 'post',
    params: query
  })
}

export function editPurchase(query) {
  return fetch({
    url: '/promotions/employeepurchase/update',
    method: 'put',
    params: query
  })
}

export function endPurchase(query) {
  return fetch({
    url: '/promotions/employeepurchase/endactivity',
    method: 'post',
    params: query
  })
}

export function getPurchaseInfo(query) {
  return fetch({
    url: '/promotions/employeepurchase/getinfo',
    method: 'get',
    params: query
  })
}
