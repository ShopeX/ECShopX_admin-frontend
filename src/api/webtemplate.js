/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { fetch } from './request'

function normalizeTemplateParams(params = {}) {
  const nextParams = { ...params }
  if (nextParams.distributor_id === undefined) {
    delete nextParams.distributor_id
  }
  return nextParams
}

export const fetchTemplateList = (params) => {
  return fetch({
    url: '/pctemplate/lists',
    method: 'get',
    params: normalizeTemplateParams(params)
  })
}

export const addPageTemplate = (data) => {
  return fetch({
    url: '/pctemplate/add',
    method: 'post',
    params: normalizeTemplateParams(data)
  })
}

export const editPageTemplate = (data) => {
  return fetch({
    url: '/pctemplate/edit',
    method: 'put',
    params: normalizeTemplateParams(data)
  })
}

export const deletePageTemplate = (id) => {
  return fetch({
    url: `/pctemplate/delete/${id}`,
    method: 'delete'
  })
}

export const getTemplateContent = (params) => {
  return fetch({
    url: '/pctemplate/getTemplateContent',
    method: 'get',
    params
  })
}

export const getDecorationContent = (params) => {
  return fetch({
    url: '/pctemplate/getDecorationContent',
    method: 'get',
    params
  })
}

/** 头/尾或全局装修块：按 page_name 查询单条 content（params 为 JSON 字符串） */
export const getHeaderOrFooter = (params) => {
  return fetch({
    url: '/pctemplate/getHeaderOrFooter',
    method: 'get',
    params
  })
}

// 保存页面模版装修内容
export const saveTemplateContent = (params) => {
  return fetch({
    url: '/pctemplate/saveTemplateContent',
    method: 'post',
    params
  })
}

// 保存头部或尾部
export const saveHeaderOrFooter = (params) => {
  return fetch({
    url: '/pctemplate/saveHeaderOrFooter',
    method: 'post',
    params
  })
}

export const getLoginPageSetting = (params) => {
  return fetch({
    url: '/pctemplate/loginPage/setting',
    method: 'get',
    params
  })
}

export const saveLoginPageSetting = (params) => {
  return fetch({
    url: '/pctemplate/loginPage/setting',
    method: 'post',
    params
  })
}
