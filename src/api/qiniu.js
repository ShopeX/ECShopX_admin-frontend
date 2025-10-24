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

export function getUploadQiniuPicToken(query) {
  return fetch({
    url: '/espier/image_upload_token',
    method: 'post',
    params: query
  })
}

export function uploadQiniuPic(query) {
  return fetch({
    url: 'espier/image',
    method: 'post',
    params: query
  })
}

export function getQiniuPicList(query) {
  return fetch({
    url: '/espier/images',
    method: 'get',
    params: query
  })
}

export function deleteImage(query) {
  return fetch({
    url: '/espier/images',
    method: 'delete',
    params: query
  })
}

export function getUploadQiniuVideoToken(query) {
  return fetch({
    url: '/espier/video_upload_token',
    method: 'post',
    params: query
  })
}

export function uploadQiniuVideo(query) {
  return fetch({
    url: 'espier/image',
    method: 'post',
    params: query
  })
}

export function getQiniuVideoList(query) {
  return fetch({
    url: '/espier/images',
    method: 'get',
    params: query
  })
}

export function deleteVideo(query) {
  return fetch({
    url: '/espier/images',
    method: 'delete',
    params: query
  })
}
