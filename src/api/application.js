/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { fetch } from './request'

export function adapayIsOpen() {
  return fetch({
    url: '/adapay/is_open',
    method: 'get'
  })
}

export function list() {
  return fetch({
    url: '/company/applications',
    method: 'get'
  })
}
