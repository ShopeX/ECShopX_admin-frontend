import fetch from '../utils/fetch'

export function getShopScreenSlider (params) {
  return fetch({
    url: '/shopScreen/slider',
    method: 'get',
    params
  })
}
export function postShopScreenSlider (data) {
  return fetch({
    url: '/shopScreen/slider',
    method: 'post',
    params: data
  })
}
export function getShopScreenAd (params) {
  return fetch({
    url: '/shopScreen/advertisement',
    method: 'get',
    params
  })
}

export function postShopScreenAd (data) {
  return fetch({
    url: '/shopScreen/advertisement',
    method: 'post',
    params: data
  })
}
export function putShopScreenAd (data) {
  return fetch({
    url: '/shopScreen/advertisement',
    method: 'put',
    params: data
  })
}

export function delShopScreenAd (id) {
  return fetch({
    url: `/shopScreen/advertisement/${id}`,
    method: 'delete'
  })
}
// 关键词
export function getKeywords (params) {
  return fetch({
    url: '/goods/keywords',
    method: 'get',
    params
  })
}
export function postKeywords (data) {
  return fetch({
    url: '/goods/keywords',
    method: 'post',
    params: data
  })
}
export function delKeywords (id) {
  return fetch({
    url: `/goods/keywords/${id}`,
    method: 'delete'
  })
}
