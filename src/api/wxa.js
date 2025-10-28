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

export function getWxaAuthList() {
  return fetch({
    url: '/wxa/authorizer',
    method: 'get'
  })
}

export function getWxa(wid) {
  return fetch({
    url: '/wxa/' + wid,
    method: 'get'
  })
}

export function submitWxa(query) {
  return fetch({
    url: '/wxa',
    method: 'post',
    params: query
  })
}

export function getCodeUnlimit(query) {
  return fetch({
    url: '/wxa/codeunlimit',
    method: 'get',
    params: query
  })
}

export function getTestQrcode(query) {
  return fetch({
    url: '/wxa/testqrcode',
    method: 'get',
    params: query
  })
}

export function tryRelease(query) {
  return fetch({
    url: '/wxa/tryrelease',
    method: 'post',
    params: query
  })
}

export function setPageParams(query) {
  return fetch({
    url: '/wxa/pageparams/setting',
    method: 'post',
    params: query
  })
}

export function getParamByTempName(query) {
  return fetch({
    url: '/wxa/pageparams/setting',
    method: 'get',
    params: query
  })
}

export function undocodeaudit(query) {
  return fetch({
    url: '/wxa/undocodeaudit',
    method: 'get',
    params: query
  })
}

export function revertcoderelease(query) {
  return fetch({
    url: '/wxa/revertcoderelease',
    method: 'get',
    params: query
  })
}

export function updateParamsById(query) {
  return fetch({
    url: '/wxa/pageparams/setting',
    method: 'put',
    params: query
  })
}

export function savePageParams(query) {
  return fetch({
    url: '/wxa/pageparams/setting_all',
    method: 'post',
    params: query
  })
}

export function getWxaMessageTemplateList(query) {
  return fetch({
    url: '/wxa/notice/templates',
    method: 'get',
    params: query
  })
}
export function getCustomSalesperson(query) {
  return fetch({
    url: '/wxa/salesperson/customizepage',
    method: 'get',
    params: query
  })
}

export function getCustomPageList(query) {
  return fetch({
    url: '/wxa/customizepage/list',
    method: 'get',
    params: query
  })
}

export function openWxaMessageTemplate(query) {
  return fetch({
    url: '/wxa/notice/templates',
    method: 'put',
    params: query
  })
}

export function createCustomPage(query) {
  return fetch({
    url: '/wxa/customizepage',
    method: 'post',
    params: query
  })
}

export function editCustomPage(id, query) {
  return fetch({
    url: `/wxa/customizepage/${id}`,
    method: 'put',
    params: query
  })
}

export function delCustomPage(id, query) {
  return fetch({
    url: `/wxa/customizepage/${id}`,
    method: 'delete',
    params: query
  })
}
// 修改小程序配置信息
export function configSubmitHandle(wid, query) {
  return fetch({
    url: '/wxa/config/' + wid,
    method: 'put',
    params: query
  })
}
// 获取小程序配置
export function getWxaConfig(wid) {
  return fetch({
    url: '/wxa/config/' + wid,
    method: 'get'
  })
}

// 添加直连小程序
export function addWxapp(query) {
  return fetch({
    url: '/wechat/directbind',
    method: 'post',
    params: query
  })
}

export function submitOnlyCode(query) {
  return fetch({
    url: '/wxa/onlycode',
    method: 'post',
    params: query
  })
}

export function submitReview(query) {
  return fetch({
    url: '/wxa/submitreview',
    method: 'post',
    params: query
  })
}

export function getDomainList(query) {
  return fetch({
    url: '/wxa/getdomainlist',
    method: 'post',
    params: query
  })
}
export function saveDomain(query) {
  return fetch({
    url: '/wxa/savedomain',
    method: 'post',
    params: query
  })
}

// 保存小程序模板
export function saveTemplate(query) {
  return fetch({
    url: '/wxappTemplate/wxapp',
    method: 'put',
    params: query
  })
}

// 获取相关域名
export function getdomain() {
  return fetch({
    url: '/wxappTemplate/domain',
    method: 'get'
  })
}

// 设置相关域名
export function setdomain(query) {
  return fetch({
    url: '/wxappTemplate/domain',
    method: 'put',
    params: query
  })
}

// 设置相关域名
export function getShareInfo(query) {
  return fetch({
    url: '/memberCenterShare/getInfo',
    method: 'get',
    params: query
  })
}

export function setShareInfo(query) {
  return fetch({
    url: '/memberCenterShare/set',
    method: 'post',
    params: query
  })
}

// 获取小程序外链配置
export function getWxLinkListSetting(query) {
  return fetch({
    url: '/wxexternalconfig/list',
    method: 'get',
    params: query
  })
}

// 添加小程序外链配置
export function createWxLinkSetting(query) {
  return fetch({
    url: '/wxexternalconfig/create',
    method: 'post',
    params: query
  })
}

// 更新小程序外链配置
export function updateWxLinkSetting(query) {
  const { wx_external_config_id: id } = query
  return fetch({
    url: `/wxexternalconfig/update/${id}`,
    method: 'put',
    params: query
  })
}

// 删除小程序外链配置
export function removeWxLinkSetting(query) {
  const { id: id } = query
  return fetch({
    url: `/wxexternalconfig/${id}`,
    method: 'delete'
  })
}

// 获取小程序外链
export function getWxLinkList(query) {
  return fetch({
    url: '/wxexternalroutes/list',
    method: 'get',
    params: query
  })
}

// 添加小程序外链配置
export function createWxLink(query) {
  return fetch({
    url: '/wxexternalroutes/create',
    method: 'post',
    params: query
  })
}

// 更新小程序外链配置
export function updateWxLink(query) {
  const { wx_external_routes_id: id } = query
  return fetch({
    url: `/wxexternalroutes/update/${id}`,
    method: 'put',
    params: query
  })
}

// 删除小程序外链配置
export function removeWxLink(query) {
  const { id: id } = query
  return fetch({
    url: `/wxexternalroutes/${id}`,
    method: 'delete'
  })
}

// 获取外部小程序配置路径列表
export function getWxConfigLink(query) {
  return fetch({
    url: '/wxexternalconfigroutes/list',
    method: 'get',
    params: query
  })
}

// 获取购物车提醒配置信息
export function getCartremindSetting() {
  return fetch({
    url: '/wxa/cartremind/setting',
    method: 'get'
  })
}

// 保存购物车提醒配置信息
export function setCartremindSetting(query) {
  return fetch({
    url: '/wxa/cartremind/setting',
    method: 'post',
    params: query
  })
}
