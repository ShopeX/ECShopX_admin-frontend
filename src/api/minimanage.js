import fetch from '../utils/fetch'
export function gettemplateweapplist () {
  return fetch({
    url: '/wxa/gettemplateweapplist',
    method: 'get'
  })
}

export function gettemplateweappdetail (query) {
  return fetch({
    url: '/wxa/gettemplateweappdetail',
    method: 'get',
    params: query
  })
}
