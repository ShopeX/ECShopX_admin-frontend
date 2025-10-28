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

// 美洽配置
export function getPrinterInfo(query) {
  return fetch({
    url: '/espier/printer',
    method: 'get',
    params: query
  })
}

export function savePrinter(params) {
  return fetch({
    url: '/espier/printer',
    method: 'post',
    params: params
  })
}

export function getPrinterShopList(query) {
  return fetch({
    url: '/espier/printer/shop',
    method: 'get',
    params: query
  })
}

export function createPrinter(params) {
  return fetch({
    url: '/espier/printer/shop',
    method: 'post',
    params: params
  })
}

export function updatePrinter(id, params) {
  return fetch({
    url: '/espier/printer/shop/' + id,
    method: 'put',
    params: params
  })
}

export function deletePrinter(id) {
  return fetch({
    url: '/espier/printer/shop/' + id,
    method: 'delete'
  })
}
