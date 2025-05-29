import fetch from '@/utils/fetch'

export function getNoresultList(query) {
  return fetch({
    url: '/search/noresult-adplace/list',
    method: 'get',
    params: query
  })
}

export function getNoresultInfo(id) {
  return fetch({
    url: 'search/noresult-adplace//info/' + id,
    method: 'get'
  })
}

export function addNoresult(query) {
  return fetch({
    url: '/search/noresult-adplace',
    method: 'post',
    params: query
  })
}

export function updateNoresult(id, query) {
  return fetch({
    url: `/search/noresult-adplace/${id}`,
    method: 'put',
    params: query
  })
}

export function deleteNoresult(id, query) {
  return fetch({
    url: `/search/noresult-adplace/${id}`,
    method: 'delete',
    params: query
  })
}
