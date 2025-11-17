/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { fetch } from './request'

export function getFapiaoset(query) {
  return fetch({
    url: '/fapiao/getFapiaoset',
    method: 'get',
    params: query
  })
}
export function saveFapiaoset(query) {
  return fetch({
    url: '/fapiao/saveFapiaoset',
    method: 'post',
    params: query
  })
}

export function getFapiaoList(query) {
  return fetch({
    url: '/fapiaolist',
    method: 'get',
    params: query
  })
}

export function fapiaoSet(query) {
  return fetch({
    url: '/fapiaoset',
    method: 'get',
    params: query
  })
}
