import fetch from '../utils/fetch'

export function getArticleList (query) {
  return fetch({
    url: '/article/management',
    method: 'get',
    params: query
  })
}

export function getArticleInfo (id) {
  return fetch({
    url: '/article/management/' + id,
    method: 'get'
  })
}

export function createArticle (query) {
  return fetch({
    url: '/article/management',
    method: 'post',
    params: query
  })
}

export function updateArticle (id, query) {
  return fetch({
    url: '/article/management/' + id,
    method: 'put',
    params: query
  })
}

export function deleteArticle (id) {
  return fetch({
    url: '/article/management/' + id,
    method: 'delete'
  })
}

export function updateArticleSortOrStatus (query) {
  return fetch({
    url: '/article/updatestatusorsort',
    method: 'put',
    params: query
  })
}

export function saveArticleCategory (query) {
  return fetch({
    url: '/article/category',
    method: 'post',
    params: query
  })
}

export function getArticleCategoryList (query) {
  return fetch({
    url: '/article/category',
    method: 'get',
    params: query
  })
}

export function getArticleCategoryInfo (id) {
  return fetch({
    url: '/article/category/' + id,
    method: 'get'
  })
}

export function deleteArticleCategoryInfo (id) {
  return fetch({
    url: '/article/category/' + id,
    method: 'delete'
  })
}

export function updateArticleCategoryInfo (id, query) {
  return fetch({
    url: '/article/category/' + id,
    method: 'put',
    params: query
  })
}
