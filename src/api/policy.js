// 隐私政策相关接口
import fetch from '../utils/fetch'

export function getPolicyConfig (query) {
  return fetch({
    url: '/wxa/privacy/setting',
    method: 'get',
    params: query
  })
}

export function uploadPolicyFile (params) {
  return fetch({
    url: '/wxa/uploadprivacy/extfile',
    method: 'post',
    params
  })
}

export function savePolicyConfig (params) {
  return fetch({
    url: '/wxa/privacy/setting',
    method: 'post',
    params
  })
}
