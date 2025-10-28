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

export function getWechatPreAuthUrl(query) {
  return fetch({
    url: '/wechat/pre_auth_url',
    method: 'get',
    params: query
  })
}

export function getWechatBind(query) {
  return fetch({
    url: '/wechat/bind',
    method: 'post',
    params: query
  })
}

export function getAuthorizerInfo() {
  return fetch({
    url: 'wechat/authorizerinfo',
    method: 'get'
  })
}

export function getWechatKfs() {
  return fetch({
    url: '/wechat/kfs',
    method: 'get'
  })
}

export function createWechatKfs(query) {
  return fetch({
    url: '/wechat/kfs',
    method: 'post',
    params: query
  })
}

export function updateWechatKfs(query) {
  return fetch({
    url: '/wechat/update/kfs',
    method: 'post',
    params: query
  })
}

export function deleteWechatKfs(query) {
  return fetch({
    url: '/wechat/kfs',
    method: 'delete',
    params: query
  })
}

export function uploadMaterial(query) {
  return fetch({
    url: '/wechat/material',
    method: 'post',
    params: query
  })
}

export function getWechatMaterial(query) {
  return fetch({
    url: '/wechat/material',
    method: 'get',
    params: query
  })
}

export function getMaterialStats(query) {
  return fetch({
    url: '/wechat/material/stats',
    method: 'get'
  })
}

export function deleteWechatMaterial(query) {
  return fetch({
    url: '/wechat/material',
    method: 'delete',
    params: query
  })
}

export function pushNewsImage(file) {
  return fetch({
    url: '/wechat/news/image',
    method: 'post',
    params: file
  })
}

export function getOpenKfReply() {
  return fetch({
    url: '/wechat/openkf/reply',
    method: 'get'
  })
}

export function setOpenKfReply(query) {
  return fetch({
    url: '/wechat/openkf/reply',
    method: 'post',
    params: query
  })
}

export function setSubscribeReply(query) {
  return fetch({
    url: '/wechat/subscribe/reply',
    method: 'post',
    params: query
  })
}

export function getSubscribeReply(query) {
  return fetch({
    url: '/wechat/subscribe/reply',
    method: 'get',
    params: query
  })
}

export function setDefaultReply(query) {
  return fetch({
    url: '/wechat/default/reply',
    method: 'post',
    params: query
  })
}

export function getDefaultReply(query) {
  return fetch({
    url: '/wechat/default/reply',
    method: 'get',
    params: query
  })
}

export function addKeywordReply(query) {
  return fetch({
    url: '/wechat/keyword/reply',
    method: 'post',
    params: query
  })
}

export function updateKeywordReply(query) {
  return fetch({
    url: '/wechat/keyword/reply',
    method: 'put',
    params: query
  })
}

export function deleteKeywordReply(query) {
  return fetch({
    url: '/wechat/keyword/reply',
    method: 'delete',
    params: query
  })
}

export function getKeywordReply() {
  return fetch({
    url: '/wechat/keyword/reply',
    method: 'get'
  })
}

export function createArtical(query) {
  return fetch({
    url: '/wechat/news',
    method: 'post',
    params: query
  })
}

export function updateArtical(query) {
  return fetch({
    url: '/wechat/news',
    method: 'put',
    params: query
  })
}

export function getArtical(media_id) {
  return fetch({
    url: '/wechat/news/' + media_id,
    method: 'get'
  })
}

export function getUserWeekSummary() {
  return fetch({
    url: '/wechat/stats/userweeksummary',
    method: 'get'
  })
}

export function openUserPlatform() {
  return fetch({
    url: '/wechat/open',
    method: 'post'
  })
}

export function getOffiaccountCodeForever(query) {
  return fetch({
    url: '/wechat/offiaccountcodeforever',
    method: 'get',
    params: query
  })
}

export function getWorkWechatConfig() {
  return fetch({
    url: '/workwechat/config',
    method: 'get'
  })
}

export function setWorkWechatConfig(params) {
  return fetch({
    url: '/workwechat/config',
    method: 'post',
    params: params
  })
}

export function getWorkWechatRelList(salesperson_id, params) {
  return fetch({
    url: '/workwechat/rellist/' + salesperson_id,
    method: 'get',
    params: params
  })
}

export function getWorkWechatRelLogsList(user_id, params) {
  return fetch({
    url: '/workwechat/rellogs/' + user_id,
    method: 'get',
    params: params
  })
}

export function getWorkWechatTemplateList() {
  return fetch({
    url: '/workwechat/messagetemplate',
    method: 'get'
  })
}

export function getWorkWechatTemplate(template_id) {
  return fetch({
    url: '/workwechat/messagetemplate/' + template_id,
    method: 'get'
  })
}

export function saveWorkWechatTemplate(template_id, params) {
  return fetch({
    url: '/workwechat/messagetemplate/' + template_id,
    method: 'put',
    params: params
  })
}

export function openWorkWechatTemplate(template_id, params) {
  return fetch({
    url: '/workwechat/messagetemplate/open/' + template_id,
    method: 'put',
    params: params
  })
}

export function closeWorkWechatTemplate(template_id, params) {
  return fetch({
    url: '/workwechat/messagetemplate/close/' + template_id,
    method: 'put',
    params: params
  })
}

// 2021.6.1 zyk -update

// 获取店务自建应用
export function getBaseConfig() {
  return fetch({
    url: '/workwechat/distributor/config',
    method: 'get'
  })
}

// 设置店务自建应用
export function setBaseConfig(params) {
  return fetch({
    url: '/workwechat/distributor/config',
    method: 'post',
    params: params
  })
}
