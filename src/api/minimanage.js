/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { fetch } from './request'
export function gettemplateweapplist() {
  return fetch({
    url: '/wxa/gettemplateweapplist',
    method: 'get'
  })
}

export function gettemplateweappdetail(query) {
  return fetch({
    url: '/wxa/gettemplateweappdetail',
    method: 'get',
    params: query
  })
}
