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

import fetch from '@/utils/fetch'

// 获取模板
export function getTemplate(query) {
  return fetch({
    url: '/espier/upload_template',
    method: 'get',
    params: query
  })
}

// 上传文件
export function uploadFiles(query) {
  return fetch({
    url: '/espier/upload_file',
    method: 'post',
    params: query
  })
}

// 获取上传文件列表
export function getFlieList(query) {
  return fetch({
    url: '/espier/upload_files',
    method: 'get',
    params: query
  })
}

// 处理失败
export function exportUploadErrorFile(id, query) {
  return fetch({
    url: '/espier/upload_error_file_export/' + id,
    method: 'get',
    params: query
  })
}
