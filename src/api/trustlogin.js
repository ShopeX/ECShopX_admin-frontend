/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { fetch } from './request'

// 获取信任登录列表
export function getTrustLoginList(query) {
  return fetch({
    url: 'members/trustlogin/list',
    method: 'post'
    // params: query
  })
}

// 保存信任登录状态
export function saveStatusSetting(query) {
  return fetch({
    url: 'members/trustlogin/setting',
    method: 'put',
    params: query
  })
}
