import fetch from '../utils/fetch'

//概况
export function getSummaryTrend (query) {
  return fetch({
    url: '/wxa/stats/summarytrend',
    method: 'post',
    params: query
  })
}

//综合概况
export function summarybydate (query) {
  return fetch({
    url: '/wxa/stats/summarybydate',
    method: 'post',
    params: query
  })
}

//访问页面
export function getVisitPage (query) {
  return fetch({
    url: '/wxa/stats/visitpage',
    method: 'post',
    params: query
  })
}

//访问趋势
export function getVisitTrend (query) {
  return fetch({
    url: '/wxa/stats/visittrend',
    method: 'post',
    params: query
  })
}

//访问分布
export function getVisitDistribution (query) {
  return fetch({
    url: '/wxa/stats/visitdistribution',
    method: 'post',
    params: query
  })
}

//获取访问留存
export function getRetaininfo (query) {
  return fetch({
    url: '/wxa/stats/retaininfo',
    method: 'post',
    params: query
  })
}

//获取用户画像
export function getUserPortrait (query) {
  return fetch({
    url: '/wxa/stats/userportrait',
    method: 'post',
    params: query
  })
}
