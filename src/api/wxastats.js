import fetch from '../utils/fetch'

//概况
export function getSummaryTrend(query) {
  return fetch({
    url: '/wxa/stats/summarytrend',
    method: 'post',
    params: query
  })
}

//综合概况
export function summarybydate(query) {
  return fetch({
    url: '/wxa/stats/summarybydate',
    method: 'post',
    params: query
  })
}

//访问页面
export function getVisitPage(query) {
  return fetch({
    url: '/wxa/stats/visitpage',
    method: 'post',
    params: query
  })
}

//访问趋势
export function getVisitTrend(query) {
  return fetch({
    url: '/wxa/stats/visittrend',
    method: 'post',
    params: query
  })
}

//访问分布
export function getVisitDistribution(query) {
  return fetch({
    url: '/wxa/stats/visitdistribution',
    method: 'post',
    params: query
  })
}

//获取访问留存
export function getRetaininfo(query) {
  return fetch({
    url: '/wxa/stats/retaininfo',
    method: 'post',
    params: query
  })
}

//获取用户画像
export function getUserPortrait(query) {
  return fetch({
    url: '/wxa/stats/userportrait',
    method: 'post',
    params: query
  })
}

// 获取图片广告详情
export function getPictureAdDetail(id) {
  return fetch({
    url: `/adplace/${id}`,
    method: 'get'
  })
}

// 更新图片广告
export function updatePictureAd(id, data) {
  return fetch({
    url: `/adplace/${id}`,
    method: 'put',
    params: data
  })
}

// 删除图片广告
export function deletePictureAd(id) {
  return fetch({
    url: `/adplace/${id}`,
    method: 'delete'
  })
}

// 创建图片广告
export function createPictureAd(data) {
  return fetch({
    url: '/adplace',
    method: 'post',
    params: data
  })
}


// 提交审核广告位
export function submitAd(id) {
  return fetch({
    url: `/adplace/submit/${id}`,
    method: 'post'
  })
}

// 撤销审核申请
export function withdrawAd(id) {
  return fetch({
    url: `/adplace/withdraw/${id}`,
    method: 'post'
  })
}

// 审核广告位
export function auditAd(id,data) {
  return fetch({
    url: `/adplace/audit/${id}`,
    method: 'post',
    params: data
  })
}