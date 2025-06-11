import fetch from '@/utils/fetch'

export function login(query) {
  return fetch({
    url: '/operator/login',
    method: 'post',
    params: query
  })
}

export function getPermission(query) {
  return fetch({
    url: '/permission',
    method: 'get',
    params: query
  })
}

export function refreshToken(params) {
  return fetch({
    url: '/token/refresh',
    method: 'get'
  })
}

export function getAgreementContent() {
  return fetch({
    url: '/espier/system/agreement',
    method: 'post'
  })
}
