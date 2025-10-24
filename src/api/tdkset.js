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

// tdk全局配置获取
export function getTdkglobalset(query) {
  return fetch({
    url: '/pcdecoration/tdkglobalset',
    method: 'get',
    params: query
  })
}

// tdk全局配置保存
export function saveTdkglobalset(query) {
  return fetch({
    url: '/pcdecoration/tdkglobalset',
    method: 'post',
    params: query
  })
}

export function getTdkgivensetDetail(params) {
  return fetch({
    url: '/pcdecoration/tdkgivenset/details',
    method: 'get',
    params
  })
}

export function saveTdkgivensetDetail(data) {
  return fetch({
    url: '/pcdecoration/tdkgivenset/details',
    method: 'post',
    params: data
  })
}

export function getTdkgivensetList(params) {
  return fetch({
    url: '/pcdecoration/tdkgivenset/list',
    method: 'get',
    params
  })
}

export function saveTdkgivensetList(data) {
  return fetch({
    url: '/pcdecoration/tdkgivenset/list',
    method: 'post',
    params: data
  })
}
