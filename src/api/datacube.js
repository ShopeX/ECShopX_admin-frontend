import { fetch } from './request'

export function getSourcesList(query) {
  return fetch({
    url: '/datacube/sources',
    method: 'get',
    params: query
  })
}

export function getSourcesDetail(sourceId) {
  return fetch({
    url: '/datacube/sources/' + sourceId,
    method: 'get'
  })
}

export function createSources(query) {
  return fetch({
    url: '/datacube/sources',
    method: 'post',
    params: query
  })
}

export function updateSources(sourceId, query) {
  return fetch({
    url: '/datacube/sources/' + sourceId,
    method: 'put',
    params: query
  })
}

export function deleteSources(sourceId) {
  return fetch({
    url: '/datacube/sources/' + sourceId,
    method: 'delete'
  })
}

export function listMonitors(query) {
  return fetch({
    url: '/datacube/monitors',
    method: 'get',
    params: query
  })
}

export function addMonitors(query) {
  return fetch({
    url: '/datacube/monitors',
    method: 'post',
    params: query
  })
}

export function updateMonitors(monitorId, query) {
  return fetch({
    url: '/datacube/monitors/' + monitorId,
    method: 'put',
    params: query
  })
}

export function deleteMonitors(monitorId) {
  return fetch({
    url: '/datacube/monitors/' + monitorId,
    method: 'delete'
  })
}

export function getMonitorsWxaCode64(query) {
  return fetch({
    url: '/datacube/monitorsWxaCode64',
    method: 'get',
    params: query
  })
}

export function getMonitorsWxaCodeStream(query) {
  return fetch({
    url: '/datacube/monitorsWxaCodeStream',
    method: 'get',
    params: query
  })
}

export function getMonitorsDetail(monitorId) {
  return fetch({
    url: '/datacube/monitors/' + monitorId,
    method: 'get'
  })
}

export function getMonitorsStats(query) {
  return fetch({
    url: '/datacube/monitorsstats',
    method: 'get',
    params: query
  })
}

export function saveSources(query) {
  return fetch({
    url: '/datacube/monitorsRelSources/',
    method: 'post',
    params: query
  })
}

export function getRelSources(monitorId) {
  return fetch({
    url: '/datacube/monitorsRelSources/' + monitorId,
    method: 'get'
  })
}

export function deleteRelSources(monitorId, sourceId) {
  return fetch({
    url: '/datacube/monitorsRelSources/' + monitorId + '/' + sourceId,
    method: 'delete'
  })
}

export function getWxappPages(query) {
  return fetch({
    url: '/datacube/miniprogram/pages',
    method: 'get',
    params: query
  })
}

export function getCompanyData(query) {
  return fetch({
    url: '/datacube/companydata',
    method: 'get',
    params: query
  })
}

export function getDistributorData(query) {
  return fetch({
    url: '/datacube/distributordata',
    method: 'get',
    params: query
  })
}

export function getGoodsData(params) {
  return fetch({
    url: '/datacube/goodsdata',
    method: 'get',
    params
  })
}

export function saveTags(query) {
  return fetch({
    url: '/datacube/savetags',
    method: 'post',
    params: query
  })
}

export function GetAccountStatisList(query) {
  return fetch({
    url: '/hfpay/statistics/orderList',
    method: 'get',
    params: query
  })
}

export function GetOrderInfoList(orderId) {
  return fetch({
    url: '/hfpay/statistics/orderDetail/' + orderId,
    method: 'get'
  })
}

export function onOrderExportData(query) {
  return fetch({
    url: '/hfpay/statistics/orderExportData',
    method: 'get',
    params: query
  })
}

export function withdrawgetList(query) {
  return fetch({
    url: '/hfpay/withdraw/getList',
    method: 'get',
    params: query
  })
}

export function onSumbitsData(query) {
  return fetch({
    url: '/hfpay/withdraw',
    method: 'post',
    params: query
  })
}

export function onCashExportData(query) {
  return fetch({
    url: '/hfpay/withdraw/exportData',
    method: 'get',
    params: query
  })
}
