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
// 获取卡券包列表
export const packageList = (params) => {
  return fetch({
    url: '/voucher/package/list',
    method: 'get',
    params
  })
}

// 获取优惠券列表
export const couponList = (params) => {
  return fetch({
    url: '/discountcard/list',
    method: 'get',
    params
  })
}

// 创建劵包
export const createdCoupons = (params) => {
  return fetch({
    url: '/voucher/package',
    method: 'post',
    params
  })
}
// 查看卡劵包
export const couponDetail = (params) => {
  return fetch({
    url: '/voucher/package/details',
    method: 'get',
    params
  })
}

// 编辑卡劵包
export const editCouponPackage = (params) => {
  return fetch({
    url: '/voucher/package',
    method: 'patch',
    params
  })
}

// 删除劵包
export const deleteCoupon = (params) => {
  return fetch({
    url: '/voucher/package',
    method: 'delete',
    params
  })
}

// 卡劵包领取日志
export const couponLog = (params) => {
  return fetch({
    url: '/voucher/package/get_receives_log',
    method: 'get',
    params
  })
}

// 检测包内优惠券等级限制，获取不可领用的等级

export const checkCouponPackage = (params) => {
  return fetch({
    url: '/voucher/package/check_grade_limit',
    method: 'post',
    params
  })
}
