import { fetch } from './request'

// 榜单配置相关 API
export function getRankingList(params) {
  return fetch({
    url: '/goods/ranking/list',
    method: 'get',
    params: params
  })
}

export function getRankingInfo(id, params) {
  return fetch({
    url: `/goods/ranking/${id}`,
    method: 'get',
    params: params
  })
}

export function createRanking(query) {
  return fetch({
    url: '/goods/ranking',
    method: 'post',
    params: query
  })
}

export function editRanking(id, query) {
  return fetch({
    url: `/goods/ranking/${id}`,
    method: 'put',
    params: query
  })
}

export function deleteRanking(id) {
  return fetch({
    url: `/goods/ranking/${id}`,
    method: 'delete'
  })
}
