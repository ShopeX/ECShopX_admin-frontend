import fetch from '../utils/fetch'

// 地区权限列表
export function getRegionauth (query) {
  return fetch({
    url: '/regionauth',
    method: 'get',
    params: query
  })
}

// 地区权限添加
export function addRegionauth (query) {
  return fetch({
    url: '/regionauth',
    method: 'post',
    params: query
  })
}

// 地区权限修改
export function updateRegionauth (regionauth_id, query) {
  return fetch({
    url: '/regionauth/' + regionauth_id,
    method: 'put',
    params: query
  })
}

// 地区权限删除
export function delRegionauth (regionauth_id, query) {
  return fetch({
    url: '/regionauth/' + regionauth_id,
    method: 'delete',
    params: query
  })
}

// 地区权限状态更改
export function enableRegionauth (regionauth_id, query) {
  return fetch({
    url: '/regionauth/enable/' + regionauth_id,
    method: 'put',
    params: query
  })
}
