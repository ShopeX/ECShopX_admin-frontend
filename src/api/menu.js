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

export function getMenuTree(query) {
  return fetch({
    url: '/wechat/menutree',
    method: 'get'
  })
}

export function addMenu(query) {
  return fetch({
    url: '/wechat/menu',
    method: 'post',
    params: query
  })
}

export function getParentMenu(query) {
  return fetch({
    url: '/wechat/menu',
    method: 'get',
    params: query
  })
}

export function updateMenu(query) {
  return fetch({
    url: '/wechat/menu',
    method: 'patch',
    params: query
  })
}
