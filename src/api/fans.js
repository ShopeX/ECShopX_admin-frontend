import fetch from '../utils/fetch'

export function getTagList (query) {
  return fetch({
    url: '/wechat/tags',
    method: 'get',
    params: query
  })
}

export function getFansList (query) {
  return fetch({
    url: '/wechat/fans/list',
    method: 'get',
    params: query
  })
}

export function getFansOfTag (query) {
  return fetch({
    url: '/wechat/tag/fans',
    method: 'get',
    params: query
  })
}

export function getTagsOfFans (query) {
  return fetch({
    url: '/wechat/fans/tags',
    method: 'get',
    params: query
  })
}

export function getFansInfo (query) {
  return fetch({
    url: '/wechat/fans',
    method: 'get',
    params: query
  })
}

export function remark (query) {
  return fetch({
    url: '/wechat/fans/remark',
    method: 'put',
    params: query
  })
}

export function createTag (query) {
  return fetch({
    url: '/wechat/tag',
    method: 'post',
    params: query
  })
}

export function updateTag (query) {
  return fetch({
    url: '/wechat/tag',
    method: 'put',
    params: query
  })
}

export function deleteTag (query) {
  return fetch({
    url: '/wechat/tag',
    method: 'delete',
    params: query
  })
}

export function batchSetUserTags (query) {
  return fetch({
    url: '/wechat/tag/batchSet',
    method: 'patch',
    params: query
  })
}

export function syncFans (query) {
  return fetch({
    url: '/wechat/fans/sync',
    method: 'get',
    params: query
  })
}

export function syncTags (query) {
  return fetch({
    url: '/wechat/tag/sync',
    method: 'get',
    params: query
  })
}
