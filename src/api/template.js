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

export function getTemplateList() {
  return fetch({
    url: '/wxa/templates/openlist',
    method: 'get'
  })
}

export function templateList() {
  return fetch({
    url: '/wxa/templates/list',
    method: 'get'
  })
}

export function templateOpen(query) {
  return fetch({
    url: '/wxa/templates/open',
    method: 'post',
    params: query
  })
}

export function getWeappId() {
  return fetch({
    url: '/wxa/templates/weappid',
    method: 'get'
  })
}

// 新模板管理
export function setPagesTemplate(query) {
  return fetch({
    url: '/pagestemplate/set',
    method: 'post',
    params: query
  })
}

export function getPagesTemplateSetInfo(query) {
  return fetch({
    url: '/pagestemplate/setInfo',
    method: 'get',
    params: query
  })
}

export function getPagesTemplateList(query) {
  return fetch({
    url: '/pagestemplate/lists',
    method: 'get',
    params: query
  })
}

export function addPagesTemplate(query) {
  return fetch({
    url: '/pagestemplate/add',
    method: 'post',
    params: query
  })
}

export function savePagesTemplate(query) {
  return fetch({
    url: '/pagestemplate/edit',
    method: 'put',
    params: query
  })
}

export function copyPagesTemplate(query) {
  return fetch({
    url: '/pagestemplate/copy',
    method: 'post',
    params: query
  })
}

export function deletePagesTemplate(id) {
  return fetch({
    url: '/pagestemplate/del/' + id,
    method: 'delete'
  })
}

export function getPagesTemplateDetail(query) {
  return fetch({
    url: '/pagestemplate/detail',
    method: 'get',
    params: query
  })
}

export function syncPagesTemplate(query) {
  return fetch({
    url: '/pagestemplate/sync',
    method: 'put',
    params: query
  })
}

export function modifyPagesTemplateStatus(query) {
  return fetch({
    url: '/pagestemplate/modifyStatus',
    method: 'put',
    params: query
  })
}

export function getALiTemplateList() {
  return fetch({
    url: '/alipayapp/templates/openlist',
    method: 'get'
  })
}

export function templateALiList() {
  return fetch({
    url: '/alipayapp/templates/list',
    method: 'get'
  })
}

export function templateALiOpen(query) {
  return fetch({
    url: '/alipayapp/templates/open',
    method: 'post',
    params: query
  })
}
