import fetch from '../utils/fetch'

export function getNotes(query) {
  return fetch({
    url: '/ugc/post/list',
    method: 'get',
    params: query
  })
}

export function getNotesDetail(query) {
  return fetch({
    url: '/ugc/post/detail',
    method: 'get',
    params: query
  })
}

export function notesCreate(query) {
  return fetch({
    url: '/ugc/post/create',
    method: 'post',
    params: query
  })
}

export function notesDelete(query) {
  return fetch({
    url: '/ugc/post/delete',
    method: 'post',
    params: query
  })
}

export function notesVerify(query) {
  return fetch({
    url: '/ugc/post/verify',
    method: 'post',
    params: query
  })
}

export function notesSimpleEdit(query) {
  return fetch({
    url: '/ugc/post/edit',
    method: 'post',
    params: query
  })
}

export function notesSetting(query) {
  return fetch({
    url: '/ugc/post/setting',
    method: 'get',
    params: query
  })
}

export function getBadge(query) {
  return fetch({
    url: '/ugc/badge/list',
    method: 'get',
    params: query
  })
}

export function createBadge(query) {
  return fetch({
    url: '/ugc/badge/create',
    method: 'post',
    params: query
  })
}

export function badgeDelete(query) {
  return fetch({
    url: '/ugc/badge/delete',
    method: 'post',
    params: query
  })
}

export function batchSetBadges(query) {
  return fetch({
    url: '/ugc/post/setBadges',
    method: 'post',
    params: query
  })
}

export function badgeVerify(query) {
  return fetch({
    url: '/ugc/badge/verify',
    method: 'post',
    params: query
  })
}

export function getTopics(query) {
  return fetch({
    url: '/ugc/topic/list',
    method: 'get',
    params: query
  })
}

export function createTopics(query) {
  return fetch({
    url: '/ugc/topic/create',
    method: 'post',
    params: query
  })
}

export function topicVerify(query) {
  return fetch({
    url: '/ugc/topic/verify',
    method: 'post',
    params: query
  })
}

export function topicSettop(query) {
  return fetch({
    url: '/ugc/topic/settop',
    method: 'post',
    params: query
  })
}

export function topicDelete(query) {
  return fetch({
    url: '/ugc/topic/delete',
    method: 'post',
    params: query
  })
}

export function getTags(query) {
  return fetch({
    url: '/ugc/tag/list',
    method: 'get',
    params: query
  })
}

export function tagVerify(query) {
  return fetch({
    url: '/ugc/tag/verify',
    method: 'post',
    params: query
  })
}

export function getComment(query) {
  return fetch({
    url: '/ugc/comment/list',
    method: 'get',
    params: query
  })
}

export function getCommentDetail(query) {
  return fetch({
    url: '/ugc/comment/detail',
    method: 'get',
    params: query
  })
}

export function commentVerify(query) {
  return fetch({
    url: '/ugc/comment/verify',
    method: 'post',
    params: query
  })
}

export function getUGCSetting(query) {
  return fetch({
    url: '/ugc/setting/point/getSetting',
    method: 'get',
    params: query
  })
}

export function setUGCSetting(query) {
  return fetch({
    url: '/ugc/setting/point/saveSetting',
    method: 'post',
    params: query
  })
}
