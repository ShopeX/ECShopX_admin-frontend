/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
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
  // 支持字符串或对象 { url: '...' }
  const src =
    url && typeof url === 'object' && url.url != null ? url.url : typeof url === 'string' ? url : ''
  if (!src) {
    callback(375)
    return
  }
  const videoElement = document.createElement('video')
  videoElement.src = src
  videoElement.addEventListener('loadedmetadata', function () {
    // 仅对 blob URL 调用 revokeObjectURL，避免对普通 http(s) 地址误用
    if (typeof src === 'string' && src.startsWith('blob:')) {
      URL.revokeObjectURL(src)
    }
    const width = videoElement.videoWidth
    const height = videoElement.videoHeight
    const radio = 375 / width
    callback(height * radio)
  })
  videoElement.addEventListener('error', function () {
    callback(375)
  })
}
