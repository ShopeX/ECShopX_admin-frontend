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

export function createRechargeRule(query) {
  return fetch({
    url: '/deposit/rechargerule',
    method: 'post',
    params: query
  })
}

export function getRechargeRuleList(query) {
  return fetch({
    url: '/deposit/rechargerules',
    method: 'get',
    params: query
  })
}

export function deleteRechargeRuleById(id) {
  return fetch({
    url: '/deposit/rechargerule/' + id,
    method: 'delete'
  })
}

export function editRechargeRuleById(query) {
  return fetch({
    url: '/deposit/rechargerule',
    method: 'put',
    params: query
  })
}

export function setRechargeAgreement(query) {
  return fetch({
    url: '/deposit/recharge/agreement',
    method: 'post',
    params: query
  })
}

export function getRechargeAgreementByCompanyId() {
  return fetch({
    url: '/deposit/recharge/agreement',
    method: 'get'
  })
}

export function setRechargeMultiple(query) {
  return fetch({
    url: '/deposit/recharge/multiple',
    method: 'post',
    params: query
  })
}

export function getRechargeMultipleByCompanyId() {
  return fetch({
    url: '/deposit/recharge/multiple',
    method: 'get'
  })
}

export function getDepositTradeList(query) {
  return fetch({
    url: '/deposit/trades',
    method: 'get',
    params: query
  })
}

export function getDepositCountIndex() {
  return fetch({
    url: '/deposit/count/index',
    method: 'get'
  })
}

// 添加储值
export function rechargeDeposit(params) {
  return fetch({
    url: '/deposit/recharge',
    method: 'post',
    params
  })
}
