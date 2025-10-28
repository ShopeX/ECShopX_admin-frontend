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
export function getMeiqiaInfo(query) {
  return fetch({
    url: '/im/meiqia',
    method: 'get',
    params: query
  })
}

export function saveMeiqia(params) {
  return fetch({
    url: '/im/meiqia',
    method: 'post',
    params: params
  })
}

// 获取店铺美洽客服配置
export function getDistributorMeiQia(distributor_id) {
  return fetch({
    url: '/im/meiqia/distributor/' + distributor_id,
    method: 'get'
  })
}

// 设置店铺美洽客服配置
export function setDistributorMeiQia(distributor_id, params) {
  return fetch({
    url: '/im/meiqia/distributor/' + distributor_id,
    method: 'put',
    params: params
  })
}

// 一洽配置
export function getECahtSetting() {
  return fetch({
    url: '/im/echat',
    method: 'get'
  })
}

export function saveEChatSetting(params) {
  return fetch({
    url: '/im/echat',
    method: 'post',
    params: params
  })
}
