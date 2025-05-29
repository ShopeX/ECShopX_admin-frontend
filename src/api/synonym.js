import fetch from '@/utils/fetch'

export function getSynonymList(query) {
  return fetch({
    url: '/search/synonym/list',
    method: 'get',
    params: query
  })
}

export function getSynonymInfo(id) {
  return fetch({
    url: '/search/synonym/info/' + id,
    method: 'get'
  })
}

export function addSynonym(query) {
  return fetch({
    url: '/search/synonym',
    method: 'post',
    params: query
  })
}

export function updateSynonym(id, query) {
  return fetch({
    url: `/search/synonym/${id}`,
    method: 'put',
    params: query
  })
}

export function deleteSynonym(id, query) {
  return fetch({
    url: `/search/synonym/${id}`,
    method: 'delete',
    params: query
  })
}

// 获取智能搜索开关
export function isOpenSynonym(query) {
  return fetch({
    url: '/search/isopen',
    method: 'get',
    params: query
  })
}

// 更新智能搜索开关
export function updateSynonymSwitch(query) {
  return fetch({
    url: '/search/switch',
    method: 'post',
    params: query
  })
}



// 导出智能搜索词
export function exportSynonym(query) {
  return fetch({
    url: '/search/synonym/export',
    method: 'get',
    params: query
  })
}