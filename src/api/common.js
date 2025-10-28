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

import fetch, { axios } from '@/utils/fetch'
import store from '@/store'

export function handleUploadFile(query) {
  return fetch({
    url: '/espier/upload_file',
    method: 'post',
    params: query
  })
}

export function getUploadLists(query) {
  return fetch({
    url: '/espier/upload_files',
    method: 'get',
    params: query
  })
}

export function exportUploadErrorFile(id, query) {
  return fetch({
    url: '/espier/upload_error_file_export/' + id,
    method: 'get',
    params: query
  })
}

export function exportUploadTemplate(query) {
  return fetch({
    url: '/espier/upload_template',
    method: 'get',
    params: query
  })
}

export function getAddress() {
  return fetch({
    url: '/espier/address',
    method: 'get'
  })
}

export function download() {
  return fetch({
    url: '/espier/upload_template',
    method: 'get',
    params: {
      file_type: 'normal_orders',
      file_name: '批量发货'
    }
  })
}

// 获取文件
export function getFileBlob(url) {
  return new Promise(function (resolve, reject) {
    axios({
      method: 'get',
      url,
      responseType: 'arraybuffer',
      headers: { Authorization: 'bearer ' + store.getters.token }
    })
      .then((data) => {
        resolve(data.data)
      })
      .catch((error) => {
        reject(error.toString())
      })
  })
}
