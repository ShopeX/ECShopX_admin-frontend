import fetch from '../utils/fetch'

export function setSetting (query) {
  return fetch({
    url: '/dataAnalysis/youshu/setting',
    method: 'post',
    params: query
  })
}

export function getSetting () {
  return fetch({
    url: '/dataAnalysis/youshu/query',
    method: 'get'
  })
}
