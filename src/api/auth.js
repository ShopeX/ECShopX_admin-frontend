/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { fetch } from './request'

export function login(query) {
  return fetch({
    url: '/operator/login',
    method: 'post',
    params: query
  })
}

export function getPermission(query) {
  return fetch({
    url: '/permission',
    method: 'get',
    params: query
  })
}

export function refreshToken(params) {
  return fetch({
    url: '/token/refresh',
    method: 'get'
  })
}

export function getAgreementContent() {
  return fetch({
    url: '/espier/system/agreement',
    method: 'post'
  })
}

//shuyunlogin
export function shunyunLogin(query) {
  return fetch({
    url: '/operator/shuyun/login',
    method: 'post',
    params: query
  })
}
