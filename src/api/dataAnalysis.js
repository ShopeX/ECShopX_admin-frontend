/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { fetch } from './request'

export function setSetting(query) {
  return fetch({
    url: '/dataAnalysis/youshu/setting',
    method: 'post',
    params: query
  })
}

export function getSetting() {
  return fetch({
    url: '/dataAnalysis/youshu/query',
    method: 'get'
  })
}
