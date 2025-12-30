/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { fetch } from './request'

export function getPolicyConfig(query) {
  return fetch({
    url: '/wxa/privacy/setting',
    method: 'get',
    params: query
  })
}

export function uploadPolicyFile(params) {
  return fetch({
    url: '/wxa/uploadprivacy/extfile',
    method: 'post',
    params
  })
}

export function savePolicyConfig(params) {
  return fetch({
    url: '/wxa/privacy/setting',
    method: 'post',
    params
  })
}
