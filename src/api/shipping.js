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

export function getShippingTemplatesList(query) {
  return fetch({
    url: '/shipping/templates/list',
    method: 'get',
    params: query
  })
}

export function getShippingTemplatesInfo(id) {
  return fetch({
    url: '/shipping/templates/info/' + id,
    method: 'get'
  })
}

export function createShippingTemplates(params) {
  return fetch({
    url: '/shipping/templates/create',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    params: params
  })
}

export function updateShippingTemplates(id, params) {
  return fetch({
    url: '/shipping/templates/update/' + id,
    method: 'put',
    params: params
  })
}

export function deleteShippingTemplates(id) {
  return fetch({
    url: '/shipping/templates/delete/' + id,
    method: 'delete'
  })
}
