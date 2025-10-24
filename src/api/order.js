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

//实体订单列表/自营订单列表 （备注）
export function remarks({ orderId, ...restParams }) {
  return fetch({
    url: `/remarks/${orderId}`,
    method: 'put',
    params: restParams
  })
}

//售后列表添加备注功能
export function afterRemarks(params) {
  return fetch({
    url: `/aftersales/remark`,
    method: 'put',
    params: params
  })
}
