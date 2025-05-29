import fetch from '@/utils/fetch'

export function getPlaceholderList(query) {
  return fetch({
    url: '/search/placeholder/list',
    method: 'get',
    params: query
  })
}

export function getPlaceholderInfo(id) {
  return fetch({
    url: 'search/placeholder/info/' + id,
    method: 'get'
  })
}

export function addPlaceholder(query) {
  return fetch({
    url: '/search/placeholder',
    method: 'post',
    params: query
  })
}

export function updatePlaceholder(id, query) {
  return fetch({
    url: `/search/placeholder/${id}`,
    method: 'put',
    params: query
  })
}

export function deletePlaceholder(id, query) {
  return fetch({
    url: `/search/placeholder/${id}`,
    method: 'delete',
    params: query
  })
}
