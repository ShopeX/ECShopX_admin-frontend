/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { fetch } from './request'

export function getBrandLogo() {
  return fetch({
    url: '/companys/setting',
    method: 'get'
  })
}

//获取分享设置
export function getShareParams() {
  return fetch({
    url: '/shareParameters/setting',
    method: 'get'
  })
}

//设置分享设置
export function saveShareParams(data) {
  return fetch({
    url: '/shareParameters/setting',
    method: 'post',
    params: data
  })
}

//获取web隐私声明设置
export function getWebPrivacyStatement() {
  return fetch({
    url: '/company/privacy_setting',
    method: 'get'
  })
}

//保存web隐私声明设置
export function saveWebPrivacyStatement(data) {
  return fetch({
    url: '/company/privacy_setting',
    method: 'post',
    params: data
  })
}
