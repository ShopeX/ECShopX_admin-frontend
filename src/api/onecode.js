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

// 物品
export function getThingsList(query) {
  return fetch({
    url: '/onecode/things',
    method: 'get',
    params: query
  })
}

export function getThingsDetail(thingId) {
  return fetch({
    url: '/onecode/things/' + thingId,
    method: 'get'
  })
}

export function createThings(query) {
  return fetch({
    url: '/onecode/things',
    method: 'post',
    params: query
  })
}

export function updateThings(thingId, query) {
  return fetch({
    url: '/onecode/things/' + thingId,
    method: 'put',
    params: query
  })
}

export function deleteThings(thingId) {
  return fetch({
    url: '/onecode/things/' + thingId,
    method: 'delete'
  })
}

// 批次
export function getBatchsList(query) {
  return fetch({
    url: '/onecode/batchs',
    method: 'get',
    params: query
  })
}

export function getBatchsDetail(batchId) {
  return fetch({
    url: '/onecode/batchs/' + batchId,
    method: 'get'
  })
}

export function createBatchs(query) {
  return fetch({
    url: '/onecode/batchs',
    method: 'post',
    params: query
  })
}

export function updateBatchs(batchId, query) {
  return fetch({
    url: '/onecode/batchs/' + batchId,
    method: 'put',
    params: query
  })
}

export function deleteBatchs(batchId) {
  return fetch({
    url: '/onecode/batchs/' + batchId,
    method: 'delete'
  })
}

export function getWxaOneCodeStream(query) {
  return fetch({
    url: '/onecode/wxaOneCodeStream',
    method: 'get',
    params: query
  })
}
