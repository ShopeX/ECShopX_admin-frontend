/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { fetch } from './request'

export function getParamByTempName(query) {
  return fetch({
    url: '/wxa/pageparams/setting',
    method: 'get',
    params: query
  })
}
export function savePageParams(query) {
  return fetch({
    url: '/wxa/pageparams/setting_all',
    method: 'post',
    params: query
  })
}
