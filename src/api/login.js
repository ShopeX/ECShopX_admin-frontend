// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统 
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn 
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------

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
