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

export function getImageList(params) {
  return fetch({
    url: '/espier/images',
    method: 'get',
    params
  })
}

// 添加图片分组
export function addImageCatgory(params) {
  return fetch({
    url: '/espier/image/cat',
    method: 'post',
    params
  })
}

// 获取图片分组
export function getImageAllCatgory(params) {
  return fetch({
    url: `/espier/image/cat/children`,
    method: 'get',
    params
  })
}

// 删除图片分组
export function deleteImageGroup(image_cat_id) {
  return fetch({
    url: `/espier/image/cat/${image_cat_id}`,
    method: 'delete'
  })
}

// 移动图片分组
export function moveImageGroup(params) {
  return fetch({
    url: '/espier/image/movecat',
    method: 'post',
    params
  })
}
