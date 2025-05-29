import fetch from '../utils/fetch'

export function getTemplateList () {
  return fetch({
    url: '/wxa/templates/openlist',
    method: 'get'
  })
}

export function templateList () {
  return fetch({
    url: '/wxa/templates/list',
    method: 'get'
  })
}

export function templateOpen (query) {
  return fetch({
    url: '/wxa/templates/open',
    method: 'post',
    params: query
  })
}

export function getWeappId () {
  return fetch({
    url: '/wxa/templates/weappid',
    method: 'get'
  })
}

// 新模板管理
export function setPagesTemplate (query) {
  return fetch({
    url: '/pagestemplate/set',
    method: 'post',
    params: query
  })
}

export function getPagesTemplateSetInfo (query) {
  return fetch({
    url: '/pagestemplate/setInfo',
    method: 'get',
    params: query
  })
}

export function getPagesTemplateList (query) {
  return fetch({
    url: '/pagestemplate/lists',
    method: 'get',
    params: query
  })
}

export function addPagesTemplate (query) {
  return fetch({
    url: '/pagestemplate/add',
    method: 'post',
    params: query
  })
}

export function savePagesTemplate (query) {
  return fetch({
    url: '/pagestemplate/edit',
    method: 'put',
    params: query
  })
}

export function copyPagesTemplate (query) {
  return fetch({
    url: '/pagestemplate/copy',
    method: 'post',
    params: query
  })
}

export function deletePagesTemplate (id) {
  return fetch({
    url: '/pagestemplate/del/' + id,
    method: 'delete'
  })
}

export function getPagesTemplateDetail (query) {
  return fetch({
    url: '/pagestemplate/detail',
    method: 'get',
    params: query
  })
}

export function syncPagesTemplate (query) {
  return fetch({
    url: '/pagestemplate/sync',
    method: 'put',
    params: query
  })
}

export function modifyPagesTemplateStatus (query) {
  return fetch({
    url: '/pagestemplate/modifyStatus',
    method: 'put',
    params: query
  })
}

export function getALiTemplateList () {
  return fetch({
    url: '/alipayapp/templates/openlist',
    method: 'get'
  })
}

export function templateALiList () {
  return fetch({
    url: '/alipayapp/templates/list',
    method: 'get'
  })
}

export function templateALiOpen (query) {
  return fetch({
    url: '/alipayapp/templates/open',
    method: 'post',
    params: query
  })
}

// 获取货架挂件商品
// 数据类型 data_type  main_category-主类目 category-分类 seckill-限时特惠 group-拼团 sales-按销量 items-指定商品 distributor-指定店铺
// 数据配置 data_value 可以是数组，可以是整数
export function getShelvesGoods(params) {
  return fetch({
    url: '/pagestemplate/widget/items',
    method: 'get',
    params: params
  })
}
