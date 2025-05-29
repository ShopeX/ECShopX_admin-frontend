import fetch from '../utils/fetch'

// 主播账号列表
export function getAnchorList(query) {
  return fetch({
    url: 'polyv/anchor/list',
    method: 'get',
    params: query
  })
}

// 添加账号
export function addAnchor(query) {
  return fetch({
    url: 'polyv/anchor',
    method: 'post',
    params: query
  })
}

// 查询
export function getAnchorInfo(id, query) {
  return fetch({
    url: 'polyv/anchor/' + id,
    method: 'get',
    params: query
  })
}

// 修改
export function editAnchorInfo(id, query) {
  return fetch({
    url: 'polyv/anchor/' + id,
    method: 'put',
    params: query
  })
}

//删除
export function deleteAnchorInfo(id, query) {
  return fetch({
    url: 'polyv/anchor/' + id,
    method: 'delete',
    params: query
  })
}
