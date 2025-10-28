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

// 申请脱敏
export function createEncrypt(params) {
  return fetch({
    url: '/datapass',
    method: 'post',
    params
  })
}

export function encryptList(params) {
  return fetch({
    url: '/datapass',
    method: 'get',
    params
  })
}

export function datapassLog(params) {
  return fetch({
    url: '/datapasslog',
    method: 'get',
    params
  })
}

export function encryptDetail(id) {
  return fetch({
    url: '/datapass/' + id,
    method: 'get'
  })
}

export function encryptApprove(id, params) {
  return fetch({
    url: '/datapass/apply/' + id,
    method: 'put',
    params
  })
}

export function encryptClose(id, params) {
  return fetch({
    url: '/datapass/close/' + id,
    method: 'put',
    params
  })
}

export function encryptOpen(id, params) {
  return fetch({
    url: '/datapass/open/' + id,
    method: 'put',
    params
  })
}
