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

export function getSmsCode(params) {
  return fetch({
    url: '/operator/sms/code',
    method: 'post',
    params: params
  })
}

export function getImageCode(query) {
  return fetch({
    url: '/operator/images/code',
    method: 'get',
    params: query
  })
}

export function resetPassword(params) {
  return fetch({
    url: '/operator/resetpassword',
    method: 'post',
    params: params
  })
}

export function getAdminInfo() {
  return fetch({
    url: '/operator/getinfo',
    method: 'get'
  })
}

export function updateAdminInfo(query) {
  return fetch({
    url: '/operator/updatedata',
    method: 'put',
    params: query
  })
}

export function changeOperatorStatus(query) {
  return fetch({
    url: '/operator/changestatus',
    method: 'put',
    params: query
  })
}

export function getAuthorizeUrl(params) {
  return fetch({
    url: '/operator/authorizeurl',
    method: 'get',
    params
  })
}
export function getAuthorizeLogin(data) {
  return fetch({
    url: '/operator/oauth/login',
    method: 'post',
    params: data
  })
}

export function getAuthorizelogout(params) {
  return fetch({
    url: '/operator/oauth/logout',
    method: 'get',
    params
  })
}

export function getAuthorizeLeve() {
  return fetch({
    url: '/operator/getLevel',
    method: 'post'
  })
}

export function invalidateToken() {
  return fetch({
    url: '/token/invalidate',
    method: 'get'
  })
}
