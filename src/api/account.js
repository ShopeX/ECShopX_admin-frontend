/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { fetch } from './request'
export function get_DD_Account() {
  return fetch({
    url: '/dada/finance/info',
    method: 'get'
  })
}

export function getRechargeURL(amount) {
  return fetch({
    url: '/dada/finance/create',
    method: 'post',
    params: amount
  })
}
