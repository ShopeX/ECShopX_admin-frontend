/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { fetch } from './request'

export function getMemberPoint(query) {
  return fetch({
    url: '/point/member',
    method: 'get',
    params: query
  })
}

export function getPointCountIndex(query) {
  return fetch({
    url: '/member/pointcount/index',
    method: 'get',
    params: query
  })
}

export function adjustmentPoint(query) {
  return fetch({
    url: '/point/adjustment',
    method: 'post',
    params: query
  })
}

export function pointMemberExport(query) {
  return fetch({
    url: '/point/member/export',
    method: 'get',
    params: query
  })
}
