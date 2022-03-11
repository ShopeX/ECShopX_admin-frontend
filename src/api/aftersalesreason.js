import fetch from '../utils/fetch'

// 售后原因列表
export function getAftersalesReason (query) {
  return fetch({
    url: '/aftersales/reason/list',
    method: 'get',
    params: query
  })
}

// 售后原因添加
export function addAftersalesReason (query) {
  return fetch({
    url: '/aftersales/reason/save',
    method: 'post',
    params: query
  })
}
