import fetch from '@/utils/fetch'

// 申请脱敏
export function createEncrypt(params) {
  return fetch({
    url: '/datapass',
    method: 'post',
    params
  })
}

export function encryptList(params) {
  return fetch({
    url: '/datapass',
    method: 'get',
    params
  })
}

export function datapassLog(params) {
  return fetch({
    url: '/datapasslog',
    method: 'get',
    params
  })
}

export function encryptDetail(id) {
  return fetch({
    url: '/datapass/' + id,
    method: 'get'
  })
}

export function encryptApprove(id, params) {
  return fetch({
    url: '/datapass/apply/' + id,
    method: 'put',
    params
  })
}

export function encryptClose(id, params) {
  return fetch({
    url: '/datapass/close/' + id,
    method: 'put',
    params
  })
}

export function encryptOpen(id, params) {
  return fetch({
    url: '/datapass/open/' + id,
    method: 'put',
    params
  })
}
