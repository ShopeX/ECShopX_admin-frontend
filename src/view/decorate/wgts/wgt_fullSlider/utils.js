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

export const getImageAttribute = (url, callback) => {
  if (!url) {
    callback(375)
    return
  }
  let img = new Image()
  img.onload = function () {
    let width = img.width
    let height = img.height
    let radio = 375 / width
    callback(height * radio)
  }
  img.onerror = function () {
    callback(375)
  }
  img.src = url
}
export const getVideoAttribute = (url, callback) => {
  if (!url) {
    callback(375)
    return
  }
  let videoElement = document.createElement('video')
  videoElement.src = url
  videoElement.addEventListener('loadedmetadata', function () {
    URL.revokeObjectURL(url)
    let width = videoElement.videoWidth
    let height = videoElement.videoHeight
    let radio = 375 / width
    callback(height * radio)
  })
}
