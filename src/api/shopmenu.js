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

import { fetch } from './request'
import { Message } from 'element-ui'
import store from '@/store'

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
    msg = '更新菜单成功'
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
    msg = '添加菜单成功'
  }

  return data.then((res) => {
    Message({ message: msg, type: 'success', duration: 3 * 1000 })
    return res.data.data
  })
}

export function deleteMenu(id) {
  var data = fetch({ url: '/shopmenu/' + id, method: 'delete' })
  return data.then((res) => {
    Message({ message: '删除成功', type: 'success', duration: 3 * 1000 })
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
    Message({ message: '导入成功', type: 'success', duration: 3 * 1000 })
    return res
  })
}
