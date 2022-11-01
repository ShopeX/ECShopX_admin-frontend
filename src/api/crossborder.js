import fetch from '../utils/fetch'

// 产地国家列表
export function getOrigincountry (query) {
  return fetch({
    url: '/crossborder/origincountry',
    method: 'get',
    params: query
  })
}

// 产地国家添加
export function addOrigincountry (query) {
  return fetch({
    url: '/crossborder/origincountry',
    method: 'post',
    params: query
  })
}

// 产地国家修改
export function updateOrigincountry (origincountry_id, query) {
  return fetch({
    url: '/crossborder/origincountry/' + origincountry_id,
    method: 'put',
    params: query
  })
}

// 产地国家删除
export function delOrigincountry (origincountry_id, query) {
  return fetch({
    url: '/crossborder/origincountry/' + origincountry_id,
    method: 'delete',
    params: query
  })
}

// 获取跨境设置
export function getCrossborderSet (query) {
  return fetch({
    url: '/crossborder/set',
    method: 'get',
    params: query
  })
}

// 保存跨境设置
export function saveCrossborderSet (query) {
  return fetch({
    url: '/crossborder/set',
    method: 'post',
    params: query
  })
}

// 税费策略列表获取
export function getTaxstrategyList (query) {
  return fetch({
    url: '/crossborder/taxstrategy',
    method: 'get',
    params: query
  })
}

// 税费策略详情获取
export function getTaxstrategyInfo (taxstrategy_id, query) {
  return fetch({
    url: '/crossborder/taxstrategy/' + taxstrategy_id,
    method: 'get',
    params: query
  })
}

// 税费策略添加
export function addTaxstrategy (query) {
  return fetch({
    url: '/crossborder/taxstrategy',
    method: 'post',
    params: query
  })
}

// 税费策略修改
export function updateTaxstrategy (taxstrategy_id, query) {
  return fetch({
    url: '/crossborder/taxstrategy/' + taxstrategy_id,
    method: 'put',
    params: query
  })
}

// 税费策略删除
export function delTaxstrategy (taxstrategy_id, query) {
  return fetch({
    url: '/crossborder/taxstrategy/' + taxstrategy_id,
    method: 'delete',
    params: query
  })
}
