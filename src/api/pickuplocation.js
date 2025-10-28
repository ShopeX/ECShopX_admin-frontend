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

export function addZitiLocation(params) {
  return fetch({
    url: '/pickuplocation',
    method: 'post',
    params
  })
}

// 获取自提点列表
export function getZitiLocationList(params) {
  return fetch({
    url: '/pickuplocation/list',
    method: 'get',
    params
  })
}

// 获取自提点详情
export function getZitiLocation(id) {
  return fetch({
    url: `/pickuplocation/${id}`,
    method: 'get'
  })
}

// 更新自提点
export function updateZitiLocation(id, params) {
  return fetch({
    url: `/pickuplocation/${id}`,
    method: 'put',
    params
  })
}

// 删除自提点
export function deleteZitiLocation(id) {
  return fetch({
    url: `/pickuplocation/${id}`,
    method: 'delete'
  })
}

// 自提点关联门店
export function bindZitiLocation(params) {
  return fetch({
    url: `pickuplocation/reldistributor`,
    method: 'post',
    params
  })
}

// 自提点取消关联门店
export function unbindZitiLocation(params) {
  return fetch({
    url: `pickuplocation/reldistributor/cancel`,
    method: 'post',
    params
  })
}

// 保存商家自配送
export function postPickuplocationList(params) {
  return fetch({
    url: `/distributor/selfdelivery/setting `,
    method: 'post',
    params
  })
}

// 获取商家自配送
export function getPickuplocationList() {
  return fetch({
    url: '/distributor/selfdelivery/setting ',
    method: 'get'
  })
}
