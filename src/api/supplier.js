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

export function saveAgent(query) {
  return fetch({
    url: '/supplier/save_agent',
    method: 'post',
    params: query
  })
}

export function deleteAgent(query) {
  return fetch({
    url: '/supplier/delete_agent',
    method: 'post',
    params: query
  })
}

export function getAgentList(query) {
  return fetch({
    url: '/supplier/get_agent_list',
    method: 'get',
    params: query
  })
}

export function getSupplierShops(query) {
  return fetch({
    url: '/supplier/get_supplier_shops',
    method: 'get',
    params: query
  })
}

export function checkSupplierShop(query) {
  return fetch({
    url: '/supplier/check_supplier_shop',
    method: 'post',
    params: query
  })
}

export function getSupplierList(query) {
  return fetch({
    url: '/supplier/get_supplier_list',
    method: 'get',
    params: query
  })
}

export function checkSupplier(query) {
  return fetch({
    url: '/supplier/check_supplier',
    method: 'post',
    params: query
  })
}

export function getSupplierInfo(query) {
  return fetch({
    url: '/supplier/get_supplier_info',
    method: 'get'
  })
}

export function createSupplier(query) {
  return fetch({
    url: '/supplier/register',
    method: 'post',
    params: query
  })
}

export function getOrderList(query) {
  return fetch({
    url: '/supplier/get_order_list',
    method: 'get',
    params: query
  })
}

export function getAgentOrders(query) {
  return fetch({
    url: '/supplier/get_agent_orders',
    method: 'get',
    params: query
  })
}

export function orderPaidConfirm(query) {
  return fetch({
    url: '/supplier/order_paid_confirm',
    method: 'post',
    params: query
  })
}
