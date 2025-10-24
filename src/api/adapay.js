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

// adapay_merchant 开户设置

import { fetch } from './request'

// 商户开户步骤
export const getStep = () => {
  return fetch({
    url: '/adapay/open_account/step',
    method: 'get'
  })
}

// 商户结算银行
export const getBank = (params) => {
  return fetch({
    url: '/adapay/bank/list',
    method: 'get',
    params
  })
}

// 获取地区（4位）
export const getPro = (id) => {
  return fetch({
    url: '/adapay/regions/list',
    method: 'get',
    params: id
  })
}

// 获取地区（6位）
export const getCity = (id) => {
  return fetch({
    url: `/adapay/regions_third/list/`,
    method: 'get',
    params: id
  })
}

// 开户企业
export const accountCreate = (params) => {
  return fetch({
    url: '/adapay/merchant_entry/create',
    method: 'post',
    params
  })
}
// 开户个人
export const accountCreatePerson = (params) => {
  return fetch({
    url: '/adapay/member/create',
    method: 'post',
    params
  })
}
// 查询企业对象
export const accountQueryCorp = () => {
  return fetch({
    url: '/adapay/member/get',
    method: 'get'
  })
}
// 更新开户企业
export const accountUpdate = (params) => {
  return fetch({
    url: '/adapay/corp_member/update',
    method: 'post',
    params
  })
}
export const accountUpdateCorp = (params) => {
  return fetch({
    url: 'adapay/corp_member/modify',
    method: 'post',
    params
  })
}
// 更新开户个人
export const accountUpdatePerson = (params) => {
  return fetch({
    url: '/adapay/member/update',
    method: 'post',
    params
  })
}

// 店铺、经销商开户更新
export const accountPersonUpdate = (params) => {
  return fetch({
    url: 'adapay/member/modify',
    method: 'post',
    params
  })
}

// 支付渠道基础配置
export const pay_options = () => {
  return fetch({
    url: 'adapay/other/cat',
    method: 'get'
  })
}

// 获取经营类目
export const getCategoryList = (params) => {
  return fetch({
    url: '/adapay/wx_business_cat/list',
    method: 'get',
    params
  })
}

// 获取商户种类
export const getMerTypeOption = (params) => {
  return fetch({
    url: '/adapay/other/cat',
    method: 'get',
    params
  })
}

// 提交支付渠道入驻
export const submitPay = (params) => {
  return fetch({
    url: '/adapay/merchant_resident/create',
    method: 'post',
    params
  })
}

// 上传图片
export const uploadPic = (params) => {
  return fetch({
    url: '/adapay/license/upload',
    method: 'post',
    params
  })
}

// 提交photo审核
export const submitPhoto = (params) => {
  return fetch({
    url: '/adapay/license_submit/create',
    method: 'post',
    params
  })
}

// 分账
export const subAccount = (params) => {
  return fetch({
    url: '/adapay/trade/list',
    method: 'get',
    params
  })
}
// 导出分账文件
export const exportFileList = (params) => {
  return fetch({
    url: '/adapay/trade/exportdata',
    method: 'get',
    params
  })
}

// 查看分账详情
export const subAccountDetail = (id) => {
  return fetch({
    url: `/adapay/trade/info/${id}`,
    method: 'get'
  })
}

// 获取提现记录
export const withdrawList = (params) => {
  return fetch({
    url: '/adapay/drawcash/getList',
    method: 'get',
    params
  })
}

// 获取提现审核列表
export const withdrawAuditList = (params) => {
  return fetch({
    url: '/adapay/withdraw/audit/list',
    method: 'get',
    params
  })
}

// 申请提现
export const applyForWithdrawal = (params) => {
  return fetch({
    url: '/adapay/withdraw',
    method: 'post',
    params
  })
}

// adapay支付配置
export const getAdapayPaySettingKey = () => {
  return fetch({
    url: '/adapay/generate/key',
    method: 'get'
  })
}
export const getAdapayPaySetting = () => {
  return fetch({
    url: '/trade/payment/setting',
    method: 'get'
  })
}
export const postAdapayPaySetting = (params) => {
  return fetch({
    url: '/trade/payment/setting',
    method: 'post',
    params
  })
}

// 设置子商户每日提现额度
export const setChildWithdraw = (params) => {
  return fetch({
    url: '/adapay/sub_approve/draw_limit',
    method: 'post',
    params
  })
}

// 获取子商户每日提现额度
export const getChildWithdraw = () => {
  return fetch({
    url: '/adapay/sub_approve/draw_limit',
    method: 'get'
  })
}

/* 汇付二期 */

// 获取提现设置
export const withDrawSetting = () => {
  return fetch({
    url: '/adapay/sub_approve/draw_cash_config',
    method: 'get'
  })
}

// 选择商户
export const seleteBusiness = (params) => {
  return fetch({
    url: '/adapay/member/list',
    method: 'get',
    params
  })
}

// 保存提现设置
export const saveDrawSetting = (params) => {
  return fetch({
    url: '/adapay/sub_approve/draw_cash_config',
    method: 'post',
    params
  })
}

// 生成Adapay秘钥
export const createAdapayKey = () => {
  return fetch({
    url: '/trade/payment/rsakey',
    method: 'get'
  })
}
