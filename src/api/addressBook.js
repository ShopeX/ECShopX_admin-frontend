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

// 获取部门列表
export function getWorkwechat(params = {}) {
  return fetch({
    url: '/workwechat/report',
    method: 'get',
    params: params
  })
}

// 获取部门成员
export function getMemberByClub(departmentId) {
  return fetch({
    url: `/workwechat/report/${departmentId}`,
    method: 'get'
  })
}

// 同步部门信息到店铺
export function syncClubToStore(data) {
  return fetch({
    url: '/workwechat/report/syncDistributor',
    method: 'post',
    params: data
  })
}

// 同步成员到导购员
export function syncMemberToGuide(data) {
  return fetch({
    url: '/workwechat/report/syncSalesperson',
    method: 'post',
    params: data
  })
}
