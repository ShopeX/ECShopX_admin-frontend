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

// 获取分账配置
export function getSetting(params = {}) {
  return fetch({
    url: '/hfpay/ledgerconfig/index',
    method: 'get',
    params: params
  })
}

// 保存分账配置
export function saveSetting(params = {}) {
  return fetch({
    url: '/hfpay/ledgerconfig/save',
    method: 'post',
    params: params
  })
}
// 保存分账配置
export function getEnterapplyList(params = {}) {
  return fetch({
    url: 'hfpay/enterapply/getList',
    method: 'get',
    params
  })
}

export function saveHffile(data) {
  return fetch({
    url: 'hfpay/enterapply/save',
    method: 'post',
    params: data
  })
}
export function upLoadHffile(data) {
  return fetch({
    url: '/hfpay/enterapply/hffile',
    method: 'post',
    params: data
  })
}

export function getHffile(params) {
  return fetch({
    url: '/hfpay/enterapply/apply',
    method: 'get',
    params
  })
}
export function upHfkaihu(data) {
  return fetch({
    url: '/hfpay/enterapply/hfkaihu',
    method: 'POST',
    params: data
  })
}
export function getWithdrawset(params) {
  return fetch({
    url: '/hfpay/getwithdrawset',
    method: 'get',
    params
  })
}
export function saveWithdrawset(data) {
  return fetch({
    url: '/hfpay/savewithdrawset',
    method: 'POST',
    params: data
  })
}
export function hfpayVersionStatus(params) {
  return fetch({
    url: '/trade/payment/hfpayversionstatus',
    method: 'get',
    params
  })
}
export function getPlatformAccount(params) {
  return fetch({
    url: '/hfpay/statistics/company',
    method: 'get',
    params
  })
}
export function getStoreAccount(params) {
  return fetch({
    url: '/hfpay/statistics/distributor',
    method: 'get',
    params
  })
}

export function exportAccount(params) {
  return fetch({
    url: '/hfpay/statistics/exportData',
    method: 'get',
    params
  })
}
