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

// 地区权限列表
export function getRegionauth(query) {
  return fetch({
    url: '/regionauth',
    method: 'get',
    params: query
  })
}

// 地区权限添加
export function addRegionauth(query) {
  return fetch({
    url: '/regionauth',
    method: 'post',
    params: query
  })
}

// 地区权限修改
export function updateRegionauth(regionauth_id, query) {
  return fetch({
    url: '/regionauth/' + regionauth_id,
    method: 'put',
    params: query
  })
}

// 地区权限删除
export function delRegionauth(regionauth_id, query) {
  return fetch({
    url: '/regionauth/' + regionauth_id,
    method: 'delete',
    params: query
  })
}

// 地区权限状态更改
export function enableRegionauth(regionauth_id, query) {
  return fetch({
    url: '/regionauth/enable/' + regionauth_id,
    method: 'put',
    params: query
  })
}
