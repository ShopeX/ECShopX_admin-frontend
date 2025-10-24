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

//概况
export function getSummaryTrend(query) {
  return fetch({
    url: '/wxa/stats/summarytrend',
    method: 'post',
    params: query
  })
}

//综合概况
export function summarybydate(query) {
  return fetch({
    url: '/wxa/stats/summarybydate',
    method: 'post',
    params: query
  })
}

//访问页面
export function getVisitPage(query) {
  return fetch({
    url: '/wxa/stats/visitpage',
    method: 'post',
    params: query
  })
}

//访问趋势
export function getVisitTrend(query) {
  return fetch({
    url: '/wxa/stats/visittrend',
    method: 'post',
    params: query
  })
}

//访问分布
export function getVisitDistribution(query) {
  return fetch({
    url: '/wxa/stats/visitdistribution',
    method: 'post',
    params: query
  })
}

//获取访问留存
export function getRetaininfo(query) {
  return fetch({
    url: '/wxa/stats/retaininfo',
    method: 'post',
    params: query
  })
}

//获取用户画像
export function getUserPortrait(query) {
  return fetch({
    url: '/wxa/stats/userportrait',
    method: 'post',
    params: query
  })
}
