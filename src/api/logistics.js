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

export function getLogisticsLists(query) {
  return fetch({
    url: '/company/logistics/list',
    method: 'get',
    params: query
  })
}

export function createCompanyLogistics(params) {
  return fetch({
    url: '/company/logistics/create',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    params: params
  })
}

export function deleteCompanyLogistics(id) {
  return fetch({
    url: '/company/logistics/' + id,
    method: 'delete'
  })
}

/** 获取同城配详情 */
export function getCityLogisticsInfo(query) {
  return fetch({
    url: '/company/dada/info',
    method: 'get',
    params: query
  })
}

/** 保存同城配 */
export function saveCityLogisticsInfo(params) {
  return fetch({
    url: '/company/dada/create',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    params: params
  })
}

/** 保存同城配 */
export function getLogisticsList(query) {
  return fetch({
    url: '/company/logistics/list',
    method: 'get',
    params: query
  })
}

export function getShansongInfo(query) {
  return fetch({
    url: '/company/shansong/info',
    method: 'get',
    params: query
  })
}

/** 保存同城配 */
export function saveShansongInfo(params) {
  return fetch({
    url: '/company/shansong/info',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    params: params
  })
}
