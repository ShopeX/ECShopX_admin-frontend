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

// 列表
export function getSubDistrictList(query) {
  return fetch({
    url: '/espier/subdistrict',
    method: 'get',
    params: query
  })
}

// 详情
export function getSubDistrictInfo(subDistrictId) {
  return fetch({
    url: 'espier/subdistrict/' + subDistrictId,
    method: 'get'
  })
}

// 新增
export function addSubDistrictInfo(query) {
  return fetch({
    url: 'espier/subdistrict',
    method: 'put',
    params: query
  })
}

// 编辑
export function updateSubDistrictInfo(query) {
  return fetch({
    url: 'espier/subdistrict',
    method: 'put',
    params: query
  })
}

// 删除
export function deleteSubDistrictInfo(subDistrictId) {
  return fetch({
    url: 'espier/subdistrict/' + subDistrictId,
    method: 'delete'
  })
}
