import fetch from '@/utils/fetch'

export function getBrandLogo () {
  return fetch({
    url: '/companys/setting',
    method: 'get'
  })
}

//获取分享设置
export function getShareParams () {
  return fetch({
    url: '/shareParameters/setting',
    method: 'get'
  })
}

//设置分享设置
export function saveShareParams (data) {
  return fetch({
    url: '/shareParameters/setting',
    method: 'post',
    params: data
  })
}
