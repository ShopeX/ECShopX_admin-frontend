import fetch from '@/utils/fetch'

// 获取dada基本信息
export function getDadaInfo (params = {}) {
  return fetch({
    url: '/company/dada/info',
    method: 'get',
    params: params
  })
}
