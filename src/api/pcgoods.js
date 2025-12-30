/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { fetch } from './request'
export function getPcItemsList(query) {
  query.distributor_id = !query.distributor_id ? 0 : query.distributor_id
  return fetch({
    url: '/goods/items',
    method: 'get',
    params: query
  })
}
