// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统 
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn 
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------

import { fetch } from './request'

export function getArticleList(query) {
  return fetch({
    url: '/article/management',
    method: 'get',
    params: query
  })
}

export function getArticleInfo(id) {
  return fetch({
    url: '/article/management/' + id,
    method: 'get'
  })
}

export function createArticle(query) {
  return fetch({
    url: '/article/management',
    method: 'post',
    params: query
  })
}

export function updateArticle(id, query) {
  return fetch({
    url: '/article/management/' + id,
    method: 'put',
    params: query
  })
}

export function deleteArticle(id) {
  return fetch({
    url: '/article/management/' + id,
    method: 'delete'
  })
}

export function updateArticleSortOrStatus(query) {
  return fetch({
    url: '/article/updatestatusorsort',
    method: 'put',
    params: query
  })
}

export function saveArticleCategory(query) {
  return fetch({
    url: '/article/category',
    method: 'post',
    params: query
  })
}

export function getArticleCategoryList(query) {
  return fetch({
    url: '/article/category',
    method: 'get',
    params: query
  })
}

export function getArticleCategoryInfo(id) {
  return fetch({
    url: '/article/category/' + id,
    method: 'get'
  })
}

export function deleteArticleCategoryInfo(id) {
  return fetch({
    url: '/article/category/' + id,
    method: 'delete'
  })
}

export function updateArticleCategoryInfo(id, query) {
  return fetch({
    url: '/article/category/' + id,
    method: 'put',
    params: query
  })
}

export function createArticleByAI(query) {
  return fetch({
    url: '/article/generate-direct',
    method: 'post',
    params: query
  })
}
