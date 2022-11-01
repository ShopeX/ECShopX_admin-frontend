import fetch from '../utils/fetch'

// 获取分账配置
export function getSetting (params = {}) {
  return fetch({
    url: '/hfpay/ledgerconfig/index',
    method: 'get',
    params: params
  })
}

// 保存分账配置
export function saveSetting (params = {}) {
  return fetch({
    url: '/hfpay/ledgerconfig/save',
    method: 'post',
    params: params
  })
}
// 保存分账配置
export function getEnterapplyList (params = {}) {
  return fetch({
    url: 'hfpay/enterapply/getList',
    method: 'get',
    params
  })
}

export function saveHffile (data) {
  return fetch({
    url: 'hfpay/enterapply/save',
    method: 'post',
    params: data
  })
}
export function upLoadHffile (data) {
  return fetch({
    url: '/hfpay/enterapply/hffile',
    method: 'post',
    params: data
  })
}

export function getHffile (params) {
  return fetch({
    url: '/hfpay/enterapply/apply',
    method: 'get',
    params
  })
}
export function upHfkaihu (data) {
  return fetch({
    url: '/hfpay/enterapply/hfkaihu',
    method: 'POST',
    params: data
  })
}
export function getWithdrawset (params) {
  return fetch({
    url: '/hfpay/getwithdrawset',
    method: 'get',
    params
  })
}
export function saveWithdrawset (data) {
  return fetch({
    url: '/hfpay/savewithdrawset',
    method: 'POST',
    params: data
  })
}
export function hfpayVersionStatus (params) {
  return fetch({
    url: '/trade/payment/hfpayversionstatus',
    method: 'get',
    params
  })
}
export function getPlatformAccount (params) {
  return fetch({
    url: '/hfpay/statistics/company',
    method: 'get',
    params
  })
}
export function getStoreAccount (params) {
  return fetch({
    url: '/hfpay/statistics/distributor',
    method: 'get',
    params
  })
}

export function exportAccount (params) {
  return fetch({
    url: '/hfpay/statistics/exportData',
    method: 'get',
    params
  })
}
