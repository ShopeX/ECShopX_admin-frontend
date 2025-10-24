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

export function getSetting() {
  return fetch({
    url: '/reservation/setting',
    method: 'get'
  })
}

export function saveSetting(query) {
  return fetch({
    url: '/reservation/setting',
    method: 'post',
    params: query
  })
}

export function createResourceLevel(query) {
  return fetch({
    url: '/resource/level',
    method: 'post',
    params: query
  })
}

export function updateResourceLevel(query) {
  return fetch({
    url: '/resource/level',
    method: 'patch',
    params: query
  })
}

export function deleteResourceLevel(query) {
  return fetch({
    url: '/resource/level/',
    method: 'delete',
    params: query
  })
}

export function getResourceLevel(levelId) {
  return fetch({
    url: '/resource/level/' + levelId,
    method: 'get'
  })
}
export function getListResourceLevel(query) {
  return fetch({
    url: '/resource/levellist',
    method: 'get',
    params: query
  })
}

export function createShiftType(query) {
  return fetch({
    url: '/shifttype',
    method: 'post',
    params: query
  })
}

export function updateShiftType(query) {
  return fetch({
    url: '/shifttype',
    method: 'patch',
    params: query
  })
}

export function deleteShiftType(typeId) {
  return fetch({
    url: '/shifttype/' + typeId,
    method: 'delete'
  })
}

export function getListShiftType(query) {
  return fetch({
    url: '/shifttype',
    method: 'get',
    params: query
  })
}

export function createWorkShift(query) {
  return fetch({
    url: '/workshift',
    method: 'post',
    params: query
  })
}

export function updateWorkShift(query) {
  return fetch({
    url: '/workshift',
    method: 'patch',
    params: query
  })
}

export function deleteWorkShift(query) {
  return fetch({
    url: '/workshift',
    method: 'delete',
    params: query
  })
}

export function getListWorkShift(query) {
  return fetch({
    url: '/workshift',
    method: 'get',
    params: query
  })
}

export function getweekday(query) {
  return fetch({
    url: '/getweekday',
    method: 'get',
    params: query
  })
}

export function getReservationRecord(query) {
  return fetch({
    url: '/reservation',
    method: 'get',
    params: query
  })
}

export function addReservationRecord(query) {
  return fetch({
    url: '/reservation',
    method: 'post',
    params: query
  })
}

export function getTimePeriodTitle(query) {
  return fetch({
    url: '/reservation/period',
    method: 'get',
    params: query
  })
}

export function getDefaultShift(query) {
  return fetch({
    url: '/workshift/default',
    method: 'get',
    params: query
  })
}

export function createDefautlShift(query) {
  return fetch({
    url: '/workshift/default',
    method: 'post',
    params: query
  })
}
export function updateResourceLevelStatus(query) {
  return fetch({
    url: '/resource/setlevelstatus',
    method: 'put',
    params: query
  })
}
