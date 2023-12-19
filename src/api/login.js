import fetch from '../utils/fetch'

export function login(query) {
  return fetch({
    url: '/operator/login',
    method: 'post',
    params: query
  })
}

export function getSmsCode(params) {
  return fetch({
    url: '/operator/sms/code',
    method: 'post',
    params: params
  })
}

export function getImageCode() {
  return fetch({
    url: '/operator/images/code',
    method: 'get'
  })
}

export function resetPassword(params) {
  return fetch({
    url: '/operator/resetpassword',
    method: 'post',
    params: params
  })
}

export function getAdminInfo() {
  return fetch({
    url: '/operator/getinfo',
    method: 'get'
  })
}

export function updateAdminInfo(query) {
  return fetch({
    url: '/operator/updatedata',
    method: 'put',
    params: query
  })
}

export function changeOperatorStatus(query) {
  return fetch({
    url: '/operator/changestatus',
    method: 'put',
    params: query
  })
}

export function getAuthorizeUrl(params) {
  return fetch({
    url: '/operator/authorizeurl',
    method: 'get',
    params
  })
}
export function getAuthorizeLogin(data) {
  return fetch({
    url: '/operator/oauth/login',
    method: 'post',
    params: data
  })
}

export function getAuthorizelogout(params) {
  return fetch({
    url: '/operator/oauth/logout',
    method: 'get',
    params
  })
}

export function invalidateToken() {
  return fetch({
    url: '/token/invalidate',
    method: 'get'
  })
}
