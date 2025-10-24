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

export function getAftersalesList(query) {
  return fetch({
    url: '/aftersales',
    method: 'get',
    params: query
  })
}

export function exportList(query) {
  return fetch({
    url: '/aftersales/logExport',
    method: 'get',
    params: query
  })
}

export function getAftersalesDetail(aftersalesBn) {
  return fetch({
    url: '/aftersales/' + aftersalesBn,
    method: 'get'
  })
}

export function reviewAftersales(query) {
  return fetch({
    url: '/aftersales/review',
    method: 'post',
    params: query
  })
}

export function refundCheck(query) {
  return fetch({
    url: '/aftersales/refundCheck',
    method: 'post',
    params: query
  })
}

export function sendConfirm(query) {
  return fetch({
    url: '/aftersales/sendConfirm',
    method: 'post',
    params: query
  })
}

export function getAftersalesAddressList(query) {
  return fetch({
    url: '/distributors/aftersalesaddress',
    method: 'get',
    params: query
  })
}

export function getRefundsList(query) {
  return fetch({
    url: '/refund',
    method: 'get',
    params: query
  })
}

export function getRefundsDetail(refundBn) {
  return fetch({
    url: '/refund/detail/' + refundBn,
    method: 'get'
  })
}

export function exportRefundList(query) {
  return fetch({
    url: '/refund/logExport',
    method: 'get',
    params: query
  })
}

export function createAftersalesAddress(data) {
  return fetch({
    url: '/distributors/aftersalesaddress',
    method: 'post',
    params: data
  })
}

export function updateAftersalesAddress(data) {
  return fetch({
    url: '/distributors/aftersalesaddress',
    method: 'put',
    params: data
  })
}

export function deleteAftersalesAddress(id) {
  return fetch({
    url: '/distributors/aftersalesaddress/' + id,
    method: 'delete'
  })
}

export function getInvoiceList(query) {
  return fetch({
    url: '/distributors/invoice',
    method: 'get',
    params: query
  })
}

export function getInvoiceInfo(id, query) {
  return fetch({
    url: '/distributors/invoice/' + id,
    method: 'get',
    params: query
  })
}

export function createInvoice(params) {
  return fetch({
    url: '/distributors/invoice',
    method: 'post',
    params: params
  })
}

export function updateInvoice(id, params) {
  return fetch({
    url: '/distributors/invoice/' + id,
    method: 'put',
    params: params
  })
}

export function deleteInvoice(id) {
  return fetch({
    url: '/distributors/invoice/' + id,
    method: 'delete'
  })
}
export function setDefaultAftersalesAddress(id) {
  return fetch({
    url: '/distributors/aftersalesaddress/' + id,
    method: 'post'
  })
}

export function exportAftersalesFinancialList(query) {
  return fetch({
    url: '/aftersales/financial/export',
    method: 'get',
    params: query
  })
}

export function getAftersalesRemind() {
  return fetch({
    url: '/aftersales/remind/detail',
    method: 'get'
  })
}

export function setAftersalesRemind(data) {
  return fetch({
    url: '/aftersales/remind',
    method: 'post',
    params: data
  })
}

export function getOfflineInfo(query) {
  return fetch({
    url: '/refund/offline/bank',
    method: 'get',
    params: query
  })
}

export function refundOffline(data) {
  return fetch({
    url: '/refund/offline',
    method: 'post',
    params: data
  })
}
