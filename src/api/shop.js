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

export function getWxShopsList(query) {
  return fetch({
    url: '/shops/wxshops',
    method: 'get',
    params: query
  })
}

export function getWxShopsDetail(wxShopId) {
  return fetch({
    url: '/shops/wxshops/' + wxShopId,
    method: 'get'
  })
}

export function createWxShops(query) {
  return fetch({
    url: '/shops/wxshops',
    method: 'post',
    params: query
  })
}

export function updateWxShops(wxShopId, query) {
  return fetch({
    url: '/shops/wxshops/' + wxShopId,
    method: 'put',
    params: query
  })
}

export function setDefaultShop(query) {
  return fetch({
    url: '/shops/wxshops/setDefaultShop',
    method: 'post',
    params: query
  })
}

export function setResource(query) {
  return fetch({
    url: '/shops/wxshops/setShopResource',
    method: 'post',
    params: query
  })
}

export function deleteWxShops(wxShopId) {
  return fetch({
    url: '/shops/wxshops/' + wxShopId,
    method: 'delete'
  })
}

export function syncWxShops(query) {
  return fetch({
    url: '/shops/wxshops/sync',
    method: 'get'
  })
}

export function getSettingWxShops(query) {
  return fetch({
    url: '/shops/wxshops/setting',
    method: 'get'
  })
}

export function putSettingWxShops(query) {
  return fetch({
    url: '/shops/wxshops/setting',
    method: 'put',
    params: query
  })
}

export function createSalesperson(query) {
  return fetch({
    url: '/shops/salesperson',
    method: 'post',
    params: query
  })
}

export function getSalespersonList(query) {
  return fetch({
    url: '/shops/salesperson',
    method: 'get',
    params: query
  })
}

export function deleteSalesperson(salesperson_id) {
  return fetch({
    url: '/shops/salesperson/' + salesperson_id,
    method: 'delete'
  })
}

export function updateSalesperson(salesperson_id, query) {
  return fetch({
    url: '/shops/salesperson/' + salesperson_id,
    method: 'put',
    params: query
  })
}

export function getCommentList(query) {
  return fetch({
    url: '/comments',
    method: 'get',
    params: query
  })
}

export function upadteComment(comment_id, query) {
  return fetch({
    url: '/comment/' + comment_id,
    method: 'patch',
    params: query
  })
}

export function setShopStatus(query) {
  return fetch({
    url: '/shops/wxshops/setShopStatus',
    method: 'post',
    params: query
  })
}

export function getRelShopList(query) {
  return fetch({
    url: '/shops/saleperson/shoplist',
    method: 'get',
    params: query
  })
}

export function getSalespersonInfo(query) {
  return fetch({
    url: '/shops/saleperson/getinfo',
    method: 'get',
    params: query
  })
}

export function getDistributionConfig() {
  return fetch({
    url: '/distribution/config',
    method: 'get'
  })
}

export function setDistributionConfig(params) {
  return fetch({
    url: '/distribution/config',
    method: 'post',
    params: params
  })
}

export function getProfitStatistics(query) {
  return fetch({
    url: '/profit/statistics',
    method: 'get',
    params: query
  })
}

export function profitExport(query) {
  return fetch({
    url: '/profit/export',
    method: 'get',
    params: query
  })
}

export function getSalesperosnTask(query) {
  return fetch({
    url: '/salesperson/task',
    method: 'get',
    params: query
  })
}

export function getSalesperosnTaskInfo(task_id) {
  return fetch({
    url: '/salesperson/task/' + task_id,
    method: 'get'
  })
}

export function createSalesperosnTask(params) {
  return fetch({
    url: '/salesperson/task',
    method: 'post',
    params: params
  })
}

export function updateSalesperosnTask(task_id, params) {
  return fetch({
    url: '/salesperson/task/' + task_id,
    method: 'put',
    params: params
  })
}

export function cancleSalesperosnTask(task_id, params) {
  return fetch({
    url: '/salesperson/task/' + task_id,
    method: 'delete',
    params: params
  })
}

export function getSalesperosnTaskStatistics(query) {
  return fetch({
    url: '/salesperson/task/statistics',
    method: 'get',
    params: query
  })
}

// 获取导购登录记录
export function getSalespersonLoginLog(query) {
  return fetch({
    url: '/shops/saleperson/signlogs',
    method: 'get',
    params: query
  })
}

// 商城协议获取
export function getRulesInfo(query) {
  return fetch({
    url: '/shops/protocol',
    method: 'get',
    params: query
  })
}

// 商城协议更新
export function putRulesInfo(query) {
  return fetch({
    url: '/shops/protocol',
    method: 'put',
    params: query,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
