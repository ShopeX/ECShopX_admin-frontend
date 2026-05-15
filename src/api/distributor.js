/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { fetch } from './request'

export function getAreaByAddress(params = {}) {
  return fetch({
    url: '/distributor/getAreaByAddress',
    method: 'get',
    params: params
  })
}

export function getDistributorCategory(params = {}) {
  return fetch({
    url: '/distributor/category',
    method: 'get',
    params: params
  })
}
