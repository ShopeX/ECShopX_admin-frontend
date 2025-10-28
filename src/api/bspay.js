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

// 获取省市
export function getAreaList(query) {
  return fetch({
    url: '/adapay/corp_member/get_area',
    method: 'get',
    params: query
  })
}

// 创建企业用户
export function createUserEnt(query) {
  return fetch({
    url: '/bspay/user_ent/create',
    method: 'post',
    params: query
  })
}
// 更新企业用户(未开户)
export function modifyUserEnt(query) {
  return fetch({
    url: `/bspay/user_ent/modify`,
    method: 'post',
    params: query
  })
}
// 更新企业用户(已开户)
export function updateUserEnt(query) {
  return fetch({
    url: `/bspay/user_ent/update`,
    method: 'post',
    params: query
  })
}
// 查看 账户类型（企业）
export function getUserEnt() {
  return fetch({
    url: `/bspay/user_ent/get`,
    method: 'get'
  })
}

// 创建个人用户
export function createUserIndv(query) {
  return fetch({
    url: '/bspay/user_indv/create',
    method: 'post',
    params: query
  })
}
// 更新个人用户对象(未开户)
export function modifyUserIndv(query) {
  return fetch({
    url: '/bspay/user_indv/modify',
    method: 'post',
    params: query
  })
}
// 更新个人用户对象(已开户)
export function updateUserIndv(query) {
  return fetch({
    url: '/bspay/user_indv/update',
    method: 'post',
    params: query
  })
}
// 查看  账户类型（个人）
export function getUserIndv(id) {
  return fetch({
    url: `/bspay/user_indv/get`,
    method: 'get'
  })
}

// 查看用户进件状态
export function userStatus() {
  return fetch({
    url: '/bspay/user/audit_state',
    method: 'get'
  })
}

// 查看用户进件审批列表
export function getSubApproveList(params) {
  return fetch({
    url: '/bspay/sub_approve/list',
    method: 'get',
    params
  })
}

// 获取开户审批详情页
export function getSubApproveDetail(id) {
  return fetch({
    url: '/bspay/sub_approve/info/' + id,
    method: 'get'
  })
}

// 开户审批保存
export function setApproveAudit(params) {
  return fetch({
    url: '/bspay/sub_approve/save_audit',
    method: 'post',
    params
  })
}

// 获取二级地区
export function getRegions() {
  return fetch({
    url: '/bspay/regions',
    method: 'get'
  })
}

// 获取三级地区
export function getRegionsThird() {
  return fetch({
    url: '/bspay/regions/third',
    method: 'get'
  })
}

// 分账
export const subAccount = (params) => {
  return fetch({
    url: '/bspay/trade/list',
    method: 'get',
    params
  })
}
// 导出分账文件
export const exportFileList = (params) => {
  return fetch({
    url: '/bspay/trade/exportdata',
    method: 'get',
    params
  })
}

// 查看分账详情
export const subAccountDetail = (id) => {
  return fetch({
    url: `/bspay/trade/info/${id}`,
    method: 'get'
  })
}

// 获取提现余额
export const getWithdrawBalance = () => {
  return fetch({
    url: '/bspay/withdraw/balance',
    method: 'get'
  })
}

// 提现审核
export const withdrawAudit = (params) => {
  console.log('withdrawAudit----params', params)
  return fetch({
    url: '/bspay/withdraw/audit',
    method: 'post',
    params: params
  })
}

// 提现申请
export const withdrawApply = (params) => {
  return fetch({
    url: '/bspay/withdraw/apply',
    method: 'post',
    params: params
  })
}

// 导出提现数据
export const exportWithdrawData = (params) => {
  return fetch({
    url: '/bspay/withdraw/exportdata',
    method: 'get',
    params: params
  })
}
