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
