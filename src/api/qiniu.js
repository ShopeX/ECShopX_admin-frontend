import fetch from '../utils/fetch'

export function getUploadQiniuPicToken (query) {
  return fetch({
    url: '/espier/image_upload_token',
    method: 'post',
    params: query
  })
}

export function uploadQiniuPic (query) {
  return fetch({
    url: 'espier/image',
    method: 'post',
    params: query
  })
}

export function getQiniuPicList (query) {
  return fetch({
    url: '/espier/images',
    method: 'get',
    params: query
  })
}

export function deleteImage (query) {
  return fetch({
    url: '/espier/images',
    method: 'delete',
    params: query
  })
}

export function getUploadQiniuVideoToken (query) {
  return fetch({
    url: '/espier/video_upload_token',
    method: 'post',
    params: query
  })
}

export function uploadQiniuVideo (query) {
  return fetch({
    url: 'espier/image',
    method: 'post',
    params: query
  })
}

export function getQiniuVideoList (query) {
  return fetch({
    url: '/espier/images',
    method: 'get',
    params: query
  })
}

export function deleteVideo (query) {
  return fetch({
    url: '/espier/images',
    method: 'delete',
    params: query
  })
}
