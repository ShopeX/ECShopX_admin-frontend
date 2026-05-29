/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * 装修域 API（ThemeBundle 对齐）：Web 端商城导航菜单等
 */
import { fetch } from './request'

// -------- Web 端商城导航菜单 --------
export function getMenuList(params) {
  return fetch({
    url: '/web-menus',
    method: 'get',
    params
  })
}

export function getMenuDetail(id) {
  return fetch({
    url: '/web-menus/' + id,
    method: 'get'
  })
}

export function createMenu(params) {
  return fetch({
    url: '/web-menus',
    method: 'post',
    params
  })
}

export function updateMenu(id, params) {
  return fetch({
    url: '/web-menus/' + id,
    method: 'put',
    params
  })
}

export function removeMenu(id) {
  return fetch({
    url: '/web-menus/' + id,
    method: 'delete'
  })
}

export function createMenuItem(menuId, params) {
  return fetch({
    url: '/web-menus/' + menuId + '/items',
    method: 'post',
    params
  })
}

export function updateMenuItem(menuId, itemId, params) {
  return fetch({
    url: '/web-menus/' + menuId + '/items/' + itemId,
    method: 'put',
    params
  })
}

export function removeMenuItem(menuId, itemId) {
  return fetch({
    url: '/web-menus/' + menuId + '/items/' + itemId,
    method: 'delete'
  })
}

export function sortMenuItems(menuId, sorts) {
  return fetch({
    url: '/web-menus/' + menuId + '/items/sort',
    method: 'put',
    params: { sorts }
  })
}
