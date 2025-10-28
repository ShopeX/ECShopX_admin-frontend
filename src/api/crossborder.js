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

// 产地国家列表
export function getOrigincountry(query) {
  return fetch({
    url: '/crossborder/origincountry',
    method: 'get',
    params: query
  })
}

// 产地国家添加
export function addOrigincountry(query) {
  return fetch({
    url: '/crossborder/origincountry',
    method: 'post',
    params: query
  })
}

// 产地国家修改
export function updateOrigincountry(origincountry_id, query) {
  return fetch({
    url: '/crossborder/origincountry/' + origincountry_id,
    method: 'put',
    params: query
  })
}

// 产地国家删除
export function delOrigincountry(origincountry_id, query) {
  return fetch({
    url: '/crossborder/origincountry/' + origincountry_id,
    method: 'delete',
    params: query
  })
}

// 获取跨境设置
export function getCrossborderSet(query) {
  return fetch({
    url: '/crossborder/set',
    method: 'get',
    params: query
  })
}

// 保存跨境设置
export function saveCrossborderSet(query) {
  return fetch({
    url: '/crossborder/set',
    method: 'post',
    params: query
  })
}

// 税费策略列表获取
export function getTaxstrategyList(query) {
  return fetch({
    url: '/crossborder/taxstrategy',
    method: 'get',
    params: query
  })
}

// 税费策略详情获取
export function getTaxstrategyInfo(taxstrategy_id, query) {
  return fetch({
    url: '/crossborder/taxstrategy/' + taxstrategy_id,
    method: 'get',
    params: query
  })
}

// 税费策略添加
export function addTaxstrategy(query) {
  return fetch({
    url: '/crossborder/taxstrategy',
    method: 'post',
    params: query
  })
}

// 税费策略修改
export function updateTaxstrategy(taxstrategy_id, query) {
  return fetch({
    url: '/crossborder/taxstrategy/' + taxstrategy_id,
    method: 'put',
    params: query
  })
}

// 税费策略删除
export function delTaxstrategy(taxstrategy_id, query) {
  return fetch({
    url: '/crossborder/taxstrategy/' + taxstrategy_id,
    method: 'delete',
    params: query
  })
}
