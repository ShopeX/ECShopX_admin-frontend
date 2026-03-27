/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { fetch } from './request'
import { Message } from 'element-ui'
import store from '@/store'
import { i18n } from '@/i18n'

export function getShopMenu(query) {
  console.log(query)
  var object = fetch({ url: '/shopmenu', method: 'get', params: query })
  return object.then((res) => {
    return res.data.data
  })
}

export function saveMenu(isEdit, query) {
  let data, msg
  if (isEdit) {
    data = fetch({
      url: '/shopmenu',
      method: 'put',
      params: {
        ...query,
        is_menu: query.is_menu ? 'true' : 'false',
        is_show: query.is_show ? 'true' : 'false'
      }
    })
    msg = i18n.t('995dc510.7d662b')
  } else {
    data = fetch({
      url: '/shopmenu',
      method: 'post',
      params: {
        ...query,
        is_menu: query.is_menu ? 'true' : 'false',
        is_show: query.is_show ? 'true' : 'false'
      }
    })
    msg = i18n.t('995dc510.5e6ef1')
  }

  return data.then((res) => {
    Message({ message: msg, type: 'success', duration: 3 * 1000 })
    return res.data.data
  })
}

export function deleteMenu(id) {
  var data = fetch({ url: '/shopmenu/' + id, method: 'delete' })
  return data.then((res) => {
    Message({ message: i18n.t('995dc510.0007d1'), type: 'success', duration: 3 * 1000 })
    return res.data.data
  })
}

export function downMenu(version) {
  var data = fetch({
    url: '/shopmenu/down',
    method: 'get',
    params: { version: version, menu_type: store.getters.versionMode }
  })
  return data.then((res) => {
    var a = document.createElement('a')
    a.href = res.data.data.file
    a.download = res.data.data.name
    document.body.appendChild(a)
    a.click()
    a.remove()
  })
}

export function uploadMenu(data) {
  var result = fetch({ url: '/shopmenu/upload', method: 'POST', params: data })
  return result.then((res) => {
    Message({ message: i18n.t('995dc510.b6d16a'), type: 'success', duration: 3 * 1000 })
    return res
  })
}
