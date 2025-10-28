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
import axios from 'axios'

/**
 * @description: 获取上传Token
 * @param {params: 'image' or 'video' }
 */
export const getOssToken = (
  params = {
    filetype: 'image'
  }
) => {
  return fetch({
    url: '/espier/oss_upload_token',
    method: 'post',
    params: params
  })
}

// 本地上传
export const LocalUpload = (tokenRes, file, filetype = 'image') => {
  return fetch({
    url: '/espier/upload_localimage',
    method: 'post',
    params: {
      ...tokenRes,
      images: file,
      filetype,
      isUploadFile: true
    }
  })
}

export const AliUpload = (tokenRes, file) => {
  const formData = new FormData()
  formData.append('key', tokenRes.dir)
  formData.append('policy', tokenRes.policy)
  formData.append('OSSAccessKeyId', tokenRes.accessid)
  formData.append('success_action_status', '200')
  // formData.append('callback', tokenRes.callback)
  formData.append('signature', tokenRes.signature)
  formData.append('name', file.name)
  formData.append('file', file)
  return axios({
    method: 'POST',
    url: tokenRes.host,
    headers: { 'Content-Type': 'multipart/form-data;charset=UTF-8' },
    data: formData
  })
}
