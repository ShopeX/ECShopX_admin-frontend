import fetch from '../utils/fetch'

// 结算汇总
export function getSummary (params) {
  return fetch({
    url: '/statement/summarized',
    method: 'get',
    params
  })
}

// 添加店铺结算周期设置
export function addPeriodSetting (params) {
  return fetch({
    url: '/statement/period/setting',
    method: 'post',
    params
  })
}

// 获取默认结算周期配置
export function getDefaultSetting (params) {
  return fetch({
    url: '/statement/period/default/setting',
    method: 'get',
    params
  })
}

// 保存结算周期设置
export function savePeriodSetting (params) {
  return fetch({
    url: '/statement/period/setting',
    method: 'post',
    params
  })
}

// 确认结算
export function confirmStatement (id) {
  return fetch({
    url: `/statement/confirm/${id}`,
    method: 'post'
  })
}

// 导出
export function exportData (params) {
  return fetch({
    url: `/statement/summarized/export`,
    method: 'post',
    params
  })
}

// 导出明细
export function exportDetialData (params) {
  return fetch({
    url: `/statement/detail/export`,
    method: 'post',
    params
  })
}

export function getInvoiceSetting (params) {
  return fetch({
    url: `/order/invoice/setting`,
    method: 'get',
    params
  })
}

export function setInvoiceSetting (params) {
  return fetch({
    url: `/order/invoice/setting`,
    method: 'post',
    params
  })
}

export function getInvoiceDetail (id) {
  return fetch({
    url: `/order/invoice/info/${id}`,
    method: 'get'
  })
}
