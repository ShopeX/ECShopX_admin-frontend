import fetch from '../utils/fetch'
import { Message } from 'element-ui'
import store from '@/store'

export function getShopMenu (query) {
  console.log(query)
  var object = fetch({ url: '/shopmenu', method: 'get', params: query })
  return object.then((res) => {
    return res.data.data
  })
}

export function saveMenu (isEdit, query) {
  if (isEdit) {
    var data = fetch({ url: '/shopmenu', method: 'put', params: query })
    var msg = '更新菜单成功'
  } else {
    var data = fetch({ url: '/shopmenu', method: 'post', params: query })
    var msg = '添加菜单成功'
  }

  return data.then((res) => {
    Message({ message: msg, type: 'success', duration: 3 * 1000 })
    return res.data.data
  })
}

export function deleteMenu (id) {
  var data = fetch({ url: '/shopmenu/' + id, method: 'delete' })
  return data.then((res) => {
    Message({ message: '删除成功', type: 'success', duration: 3 * 1000 })
    return res.data.data
  })
}

export function downMenu (version) {
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

export function uploadMenu (data) {
  var result = fetch({ url: '/shopmenu/upload', method: 'POST', params: data })
  return result.then((res) => {
    Message({ message: '导入成功', type: 'success', duration: 3 * 1000 })
    return res
  })
}
