import fetch from '../utils/fetch'

export function getShippingTemplatesList (query) {
  return fetch({
    url: '/shipping/templates/list',
    method: 'get',
    params: query
  })
}

export function getShippingTemplatesInfo (id) {
  return fetch({
    url: '/shipping/templates/info/' + id,
    method: 'get'
  })
}

export function createShippingTemplates (params) {
  return fetch({
    url: '/shipping/templates/create',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    params: params
  })
}

export function updateShippingTemplates (id, params) {
  return fetch({
    url: '/shipping/templates/update/' + id,
    method: 'put',
    params: params
  })
}

export function deleteShippingTemplates (id) {
  return fetch({
    url: '/shipping/templates/delete/' + id,
    method: 'delete'
  })
}
