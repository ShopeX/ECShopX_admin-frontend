import fetch from '../utils/fetch'

// tdk全局配置获取
export function getTdkglobalset (query) {
  return fetch({
    url: '/pcdecoration/tdkglobalset',
    method: 'get',
    params: query
  })
}

// tdk全局配置保存
export function saveTdkglobalset (query) {
  return fetch({
    url: '/pcdecoration/tdkglobalset',
    method: 'post',
    params: query
  })
}

export function getTdkgivensetDetail (params) {
  return fetch({
    url: '/pcdecoration/tdkgivenset/details',
    method: 'get',
    params
  })
}

export function saveTdkgivensetDetail (data) {
  return fetch({
    url: '/pcdecoration/tdkgivenset/details',
    method: 'post',
    params: data
  })
}

export function getTdkgivensetList (params) {
  return fetch({
    url: '/pcdecoration/tdkgivenset/list',
    method: 'get',
    params
  })
}

export function saveTdkgivensetList (data) {
  return fetch({
    url: '/pcdecoration/tdkgivenset/list',
    method: 'post',
    params: data
  })
}
