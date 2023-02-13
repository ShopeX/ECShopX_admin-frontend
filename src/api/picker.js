import fetch from '@/utils/fetch'

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
