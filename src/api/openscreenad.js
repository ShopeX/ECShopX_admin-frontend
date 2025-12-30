/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { fetch } from './request'

// 获取开屏广告设置
export function getOpenScreenADSet(query) {
  return fetch({
    url: '/openscreenad/set',
    method: 'get',
    params: query
  })
}

// 保存开屏广告设置
export function saveOpenScreenADSet(data) {
  return fetch({
    url: '/openscreenad/set',
    method: 'post',
    params: data
  })
}
