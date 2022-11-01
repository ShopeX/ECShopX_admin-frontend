import fetch from '../utils/fetch'

export function getLogisticsLists (query) {
  return fetch({
    url: '/company/logistics/list',
    method: 'get',
    params: query
  })
}

export function createCompanyLogistics (params) {
  return fetch({
    url: '/company/logistics/create',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    params: params
  })
}

export function deleteCompanyLogistics (id) {
  return fetch({
    url: '/company/logistics/' + id,
    method: 'delete'
  })
}

/** 获取同城配详情 */
export function getCityLogisticsInfo (query) {
  return fetch({
    url: '/company/dada/info',
    method: 'get',
    params: query
  })
}

/** 保存同城配 */
export function saveCityLogisticsInfo (params) {
  return fetch({
    url: '/company/dada/create',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    params: params
  })
}

/** 保存同城配 */
export function getLogisticsList (query) {
  return fetch({
    url: '/company/logistics/list',
    method: 'get',
    params: query
  })
}
