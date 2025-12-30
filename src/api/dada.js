/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { fetch } from './request'

// 获取dada基本信息
export function getDadaInfo(params = {}) {
  return fetch({
    url: '/company/dada/info',
    method: 'get',
    params: params
  })
}

export function getShansongInfo(params = {}) {
  return fetch({
    url: '/company/shansong/info',
    method: 'get',
    params: params
  })
}
