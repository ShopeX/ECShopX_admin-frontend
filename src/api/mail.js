/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { fetch } from './request'

/** 店铺端：读取本企业 SMTP 配置（GET .../mail/setting） */
export function getMailSetting(query) {
  return fetch({
    url: '/mail/setting',
    method: 'get',
    params: query
  })
}

/** 店铺端：保存本企业 SMTP 配置（POST .../mail/setting） */
export function saveMailSetting(params) {
  return fetch({
    url: '/mail/setting',
    method: 'post',
    params
  })
}
