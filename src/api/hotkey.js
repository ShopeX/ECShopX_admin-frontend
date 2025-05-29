import fetch from '@/utils/fetch'

export function getHotkeywordList(query) {
  return fetch({
    url: '/search/hotkeyword/list',
    method: 'get',
    params: query
  })
}

export function getHotkeywordInfo(id) {
  return fetch({
    url: 'search/hotkeyword/info/' + id,
    method: 'get'
  })
}

export function addHotkeyword(query) {
  return fetch({
    url: '/search/hotkeyword',
    method: 'post',
    params: query
  })
}

export function updateHotkeyword(id, query) {
  return fetch({
    url: `/search/hotkeyword/${id}`,
    method: 'put',
    params: query
  })
}

export function deleteHotkeyword(id, query) {
  return fetch({
    url: `/search/hotkeyword/${id}`,
    method: 'delete',
    params: query
  })
}
