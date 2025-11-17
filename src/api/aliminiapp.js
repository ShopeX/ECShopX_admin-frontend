/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { fetch } from './request'

export function getAliMiniAppSetting() {
  return fetch({
    url: '/aliminiapp/setting/info',
    method: 'get'
  })
}

export function saveAliMiniAppSetting(params) {
  return fetch({
    url: '/aliminiapp/setting/save',
    method: 'post',
    params: params
  })
}
