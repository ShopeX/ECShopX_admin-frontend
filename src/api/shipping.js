/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import qs from 'qs'
import { fetch } from './request'

export function getShippingTemplatesList(query) {
  return fetch({
    url: '/shipping/templates/list',
    method: 'get',
    params: query
  })
}

export function getShippingTemplatesInfo(id) {
  return fetch({
    url: '/shipping/templates/info/' + id,
    method: 'get'
  })
}

/** 以表单格式提交，避免 Content-Type 为 form-urlencoded 但 body 为 JSON 导致后端解析失败 */
export function createShippingTemplates(params) {
  return fetch({
    url: '/shipping/templates/create',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    params,
    data: qs.stringify(params)
  })
}

/** 编辑同样以表单格式提交 */
export function updateShippingTemplates(id, params) {
  return fetch({
    url: '/shipping/templates/update/' + id,
    method: 'put',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    params,
    data: qs.stringify(params)
  })
}

export function deleteShippingTemplates(id) {
  return fetch({
    url: '/shipping/templates/delete/' + id,
    method: 'delete'
  })
}
