/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { fetch } from './request'

export function getMenuTree(query) {
  return fetch({
    url: '/wechat/menutree',
    method: 'get'
  })
}

export function addMenu(query) {
  return fetch({
    url: '/wechat/menu',
    method: 'post',
    params: query
  })
}

export function getParentMenu(query) {
  return fetch({
    url: '/wechat/menu',
    method: 'get',
    params: query
  })
}

export function updateMenu(query) {
  return fetch({
    url: '/wechat/menu',
    method: 'patch',
    params: query
  })
}
