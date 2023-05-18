import fetch from '../utils/fetch'

export function getAliMiniAppSetting() {
  return fetch({
    url: '/aliminiapp/setting/info',
    method: 'get'
  })
}

export function saveAliMiniAppSetting(params) {
  return fetch({
    url: '/aliminiapp/setting/save',
    method: 'post',
    params: params
  })
}
