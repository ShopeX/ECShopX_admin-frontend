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

// 结算汇总
export function getSummary(params) {
  return fetch({
    url: '/statement/summarized',
    method: 'get',
    params
  })
}

// 添加店铺结算周期设置
export function addPeriodSetting(params) {
  return fetch({
    url: '/statement/period/setting',
    method: 'post',
    params
  })
}

// 获取默认结算周期配置
export function getDefaultSetting(params) {
  return fetch({
    url: '/statement/period/default/setting',
    method: 'get',
    params
  })
}

// 保存结算周期设置
export function savePeriodSetting(params) {
  return fetch({
    url: '/statement/period/setting',
    method: 'post',
    params
  })
}

// 确认结算
export function confirmStatement(id) {
  return fetch({
    url: `/statement/confirm/${id}`,
    method: 'post'
  })
}

// 导出
export function exportData(params) {
  return fetch({
    url: `/statement/summarized/export`,
    method: 'post',
    params
  })
}

// 导出明细
export function exportDetialData(params) {
  return fetch({
    url: `/statement/detail/export`,
    method: 'post',
    params
  })
}

export function getInvoiceSetting(params) {
  return fetch({
    url: `/order/invoice/setting`,
    method: 'get',
    params
  })
}

export function setInvoiceSetting(params) {
  return fetch({
    url: `/order/invoice/setting`,
    method: 'post',
    params
  })
}

export function getInvoiceDetail(id) {
  return fetch({
    url: `/order/invoice/info/${id}`,
    method: 'get'
  })
}

export function getBaiInvoiceSetting(params) {
  return fetch({
    url: `/order/invoice/baiwangInvoiceSetting`,
    method: 'get',
    params
  })
}

export function setBaiInvoiceSetting(params) {
  return fetch({
    url: `/order/invoice/baiwangInvoiceSetting`,
    method: 'post',
    params
  })
}

export function resendInvoiceEmail(params) {
  return fetch({
    url: `/order/invoice/resend`,
    method: 'post',
    params
  })
}

export function updateInvoiceRemark(id, params) {
  return fetch({
    url: `/order/invoice/updateremark/${id}`,
    method: 'post',
    params
  })
}

export function getInvoiceLog(params) {
  return fetch({
    url: `/order/invoice/log/list`,
    method: 'get',
    params
  })
}

export function updateInvoiceSeller(id, params) {
  return fetch({
    url: `/order/invoice-seller/update/${id}`,
    method: 'post',
    params
  })
}

export function createInvoiceSeller(params) {
  return fetch({
    url: `/order/invoice-seller/create`,
    method: 'post',
    params
  })
}

export function getInvoiceSellerList(params) {
  return fetch({
    url: `/order/invoice-seller/list`,
    method: 'get',
    params
  })
}

export function updateInvoiceTax(id, params) {
  return fetch({
    url: `/order/category-taxrate/update/${id}`,
    method: 'post',
    params
  })
}

export function createInvoiceTax(params) {
  return fetch({
    url: `/order/category-taxrate/create`,
    method: 'post',
    params
  })
}

export function getInvoiceComfirmSetting(params) {
  return fetch({
    url: `/order/invoice/protocol`,
    method: 'get',
    params
  })
}

export function setInvoiceComfirmSetting(params) {
  return fetch({
    url: `/order/invoice/protocol`,
    method: 'post',
    params
  })
}

export function updateInvoice(id, params) {
  return fetch({
    url: `/order/invoice/update/${id}`,
    method: 'post',
    params
  })
}
