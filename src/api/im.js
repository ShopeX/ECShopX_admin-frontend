import fetch from '../utils/fetch'

// 美洽配置
export function getMeiqiaInfo (query) {
  return fetch({
    url: '/im/meiqia',
    method: 'get',
    params: query
  })
}

export function saveMeiqia (params) {
  return fetch({
    url: '/im/meiqia',
    method: 'post',
    params: params
  })
}

// 获取店铺美洽客服配置
export function getDistributorMeiQia (distributor_id) {
  return fetch({
    url: '/im/meiqia/distributor/' + distributor_id,
    method: 'get'
  })
}

// 设置店铺美洽客服配置
export function setDistributorMeiQia (distributor_id, params) {
  return fetch({
    url: '/im/meiqia/distributor/' + distributor_id,
    method: 'put',
    params: params
  })
}

// 一洽配置
export function getECahtSetting () {
  return fetch({
    url: '/im/echat',
    method: 'get'
  })
}

export function saveEChatSetting (params) {
  return fetch({
    url: '/im/echat',
    method: 'post',
    params: params
  })
}
