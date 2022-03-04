import fetch from '../utils/fetch'

export function getALi (aliid) {
  return fetch({
    url: '/miniapp/' + aliid,
    method: 'get'
  })
}

export function submitALi (query) {
  return fetch({
    url: '/miniapp/upload',
    method: 'post',
    params: query
  })
}

export function submitCheck (query) {
  return fetch({
    url: '/miniapp/commitaudit',
    method: 'post',
    params: query
  })
}

export function cancelAudit (query) {
  return fetch({
    url: '/miniapp/cancelaudit',
    method: 'post',
    params: query
  })
}

export function onLine (query) {
  return fetch({
    url: '/miniapp/online',
    method: 'post',
    params: query
  })
}

export function offLine (query) {
  return fetch({
    url: '/miniapp/offline',
    method: 'post',
    params: query
  })
}

export function backDev (query) {
  return fetch({
    url: '/miniapp/cancelaudited',
    method: 'post',
    params: query
  })
}

export function rollBack (query) {
  return fetch({
    url: '/miniapp/rollback',
    method: 'post',
    params: query
  })
}

export function getALiCreatQrcode (query) {
  return fetch({
    url: '/miniapp/experience/create',
    method: 'post',
    params: query
  })
}

export function getALiTestQrcode (query) {
  return fetch({
    url: '/miniapp/queryexperience',
    method: 'post',
    params: query
  })
}

export function getALiPreAuthUrl (query) {
  return fetch({
    url: '/alipay/pre_auth_url',
    method: 'get',
    params: query
  })
}

export function setALiPageParams (query) {
  return fetch({
    url: '/alipay/pageparams/setting',
    method: 'post',
    params: query
  })
}

export function getALiParamByTempName (query) {
  return fetch({
    url: '/alipay/pageparams/setting',
    method: 'get',
    params: query
  })
}

export function updateALiParamsById (query) {
  return fetch({
    url: '/alipay/pageparams/setting',
    method: 'put',
    params: query
  })
}

export function saveALiPageParams (query) {
  return fetch({
    url: '/alipay/pageparams/setting_all',
    method: 'post',
    params: query
  })
}

export function getALiCodeUnlimit (query) {
  return fetch({
    url: '/miniapp/qrcode/create',
    method: 'post',
    params: query
  })
}

export function getALiCustomPageList () {
  return console.log('//避免报错')
}
