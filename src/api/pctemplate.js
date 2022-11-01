import fetch from '../utils/fetch'

export function getParamByTempName (query) {
  return fetch({
    url: '/wxa/pageparams/setting',
    method: 'get',
    params: query
  })
}
export function savePageParams (query) {
  return fetch({
    url: '/wxa/pageparams/setting_all',
    method: 'post',
    params: query
  })
}
