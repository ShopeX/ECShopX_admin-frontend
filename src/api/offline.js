/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { fetch } from './request'

export function getOfflineAccount(id) {
  return fetch({
    url: '/espier/offline/backaccount/' + id,
    method: 'get'
  })
}

export function createOfflineAccount(params) {
  return fetch({
    url: '/espier/offline/backaccount/create',
    method: 'post',
    params
  })
}

export function updateOfflineAccount(params) {
  return fetch({
    url: '/espier/offline/backaccount/update',
    method: 'post',
    params
  })
}

export function deleteOfflineAccount(id) {
  return fetch({
    url: '/espier/offline/backaccount/' + id,
    method: 'delete'
  })
}

export function getOfflineList() {
  return fetch({
    url: '/espier/offline/backaccount/lists',
    method: 'get'
  })
}
