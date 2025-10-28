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

export const fetchTemplateList = (params) => {
  return fetch({
    url: '/pctemplate/lists',
    method: 'get',
    params
  })
}

export const addPageTemplate = (data) => {
  return fetch({
    url: '/pctemplate/add',
    method: 'post',
    params: data
  })
}

export const editPageTemplate = (data) => {
  return fetch({
    url: '/pctemplate/edit',
    method: 'put',
    params: data
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
