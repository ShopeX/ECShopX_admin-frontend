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

export function getShopScreenSlider(params) {
  return fetch({
    url: '/shopScreen/slider',
    method: 'get',
    params
  })
}
export function postShopScreenSlider(data) {
  return fetch({
    url: '/shopScreen/slider',
    method: 'post',
    params: data
  })
}
export function getShopScreenAd(params) {
  return fetch({
    url: '/shopScreen/advertisement',
    method: 'get',
    params
  })
}

export function postShopScreenAd(data) {
  return fetch({
    url: '/shopScreen/advertisement',
    method: 'post',
    params: data
  })
}
export function putShopScreenAd(data) {
  return fetch({
    url: '/shopScreen/advertisement',
    method: 'put',
    params: data
  })
}

export function delShopScreenAd(id) {
  return fetch({
    url: `/shopScreen/advertisement/${id}`,
    method: 'delete'
  })
}
// 关键词
export function getKeywords(params) {
  return fetch({
    url: '/goods/keywords',
    method: 'get',
    params
  })
}
export function postKeywords(data) {
  return fetch({
    url: '/goods/keywords',
    method: 'post',
    params: data
  })
}
export function delKeywords(id) {
  return fetch({
    url: `/goods/keywords/${id}`,
    method: 'delete'
  })
}
