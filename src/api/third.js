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

export function setShopexErpSetting(query) {
  return fetch({
    url: '/third/shopexerp/setting',
    method: 'post',
    params: query
  })
}

export function getShopexErpSetting() {
  return fetch({
    url: '/third/shopexerp/setting',
    method: 'get'
  })
}

export function itemPriceUpdate(query) {
  return fetch({
    url: '/oms/goodsprice/update',
    method: 'put',
    params: query
  })
}

export function getMapSetting() {
  return fetch({
    url: '/third/map/setting',
    method: 'get'
  })
}

export function setMapSetting(query) {
  return fetch({
    url: '/third/map/setting',
    method: 'post',
    params: query
  })
}

export function getWdtErpSetting() {
  return fetch({
    url: '/third/wdterp/setting',
    method: 'get'
  })
}

export function setWdtErpSetting(query) {
  return fetch({
    url: '/third/wdterp/setting',
    method: 'post',
    params: query
  })
}

export function getDmcrmSetting() {
  return fetch({
    url: '/third/dmcrm/setting',
    method: 'get'
  })
}

export function setDmcrmSetting(query) {
  return fetch({
    url: '/third/dmcrm/setting',
    method: 'post',
    params: query
  })
}

export function setJstErpSetting(query) {
  return fetch({
    url: '/third/jushuitan/setting',
    method: 'post',
    params: query
  })
}

export function getJstErpSetting() {
  return fetch({
    url: '/third/jushuitan/setting',
    method: 'get'
  })
}
