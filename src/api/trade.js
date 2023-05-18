import fetch from '../utils/fetch'

export function getTradeList(query) {
  return fetch({
    url: '/trade',
    method: 'get',
    params: query
  })
}

export function setPaymentSetting(query) {
  return fetch({
    url: '/trade/payment/setting',
    method: 'post',
    params: query
  })
}

export function getPaymentSetting(query) {
  return fetch({
    url: '/trade/payment/setting',
    method: 'get',
    params: query
  })
}

export function getOrderList(query) {
  return fetch({
    url: '/orders',
    method: 'get',
    params: query
  })
}

export function getRightsList(query) {
  return fetch({
    url: '/rights/getdata',
    method: 'get',
    params: query
  })
}

export function findRightsList(query) {
  return fetch({
    url: '/rights/list',
    method: 'get',
    params: query
  })
}

export function createRights(query) {
  return fetch({
    url: '/rights',
    method: 'post',
    params: query
  })
}

export function getOrderDetail(orderId) {
  return fetch({
    url: '/order/' + orderId,
    method: 'get'
  })
}
// 发货包裹信息
export function getDeliveryLists(query) {
  return fetch({
    url: '/delivery/lists',
    params: query,
    method: 'get'
  })
}
export function getRightsLogList(query) {
  return fetch({
    url: '/rights/log',
    method: 'get',
    params: query
  })
}

export function exportList(query) {
  return fetch({
    url: '/rights/logExport',
    method: 'get',
    params: query
  })
}

export function delayRights(query) {
  return fetch({
    url: '/rights/delay',
    method: 'post',
    params: query
  })
}

export function transferRights(query) {
  return fetch({
    url: '/transfer/rights',
    method: 'put',
    params: query
  })
}

export function transferRightsList(query) {
  return fetch({
    url: '/transfer/rights/list',
    method: 'get',
    params: query
  })
}

export function getRightsInfo(query) {
  return fetch({
    url: '/rights/info',
    method: 'get',
    params: query
  })
}

export function delivery(query) {
  return fetch({
    url: '/delivery',
    method: 'post',
    params: query
  })
}

export function updateDelivery(order_id, query) {
  return fetch({
    url: '/old_delivery/' + order_id,
    method: 'put',
    params: query
  })
}

export function updateAftersalesSendBack(query) {
  return fetch({
    url: '/aftersales/sendback ',
    method: 'post',
    params: query
  })
}

export function updateRemark(order_id, query) {
  return fetch({
    url: '/order/remark/' + order_id,
    method: 'put',
    params: query
  })
}

export function updateFreightFee(order_id, query) {
  return fetch({
    url: '/order/freightfee/' + order_id,
    method: 'put',
    params: query
  })
}

export function orderExport(query) {
  return fetch({
    url: '/orders/exportdata',
    method: 'get',
    params: query
  })
}

export function orderNormalExport(query) {
  return fetch({
    url: '/orders/exportnormaldata',
    method: 'get',
    params: query
  })
}

export function rightsExport(query) {
  return fetch({
    url: '/rights/exportdata',
    method: 'get',
    params: query
  })
}

export function getPaymentList() {
  return fetch({
    url: '/trade/payment/list',
    method: 'get'
  })
}

export function tradeExport(query) {
  return fetch({
    url: '/trades/exportdata',
    method: 'get',
    params: query
  })
}

export function ExportLogList(query) {
  return fetch({
    url: '/espier/exportlog/list',
    method: 'get',
    params: query
  })
}

export function ExportLogFileDown(query) {
  return fetch({
    url: '/espier/exportlog/file/down',
    method: 'get',
    params: query
  })
}

export function getOrderSetting(query) {
  return fetch({
    url: '/orders/setting/get',
    method: 'get',
    params: query
  })
}

export function setOrderSetting(query) {
  return fetch({
    url: '/orders/setting/set',
    method: 'post',
    params: query
  })
}

export function getCancelOrderInfo(order_id, query) {
  return fetch({
    url: '/order/' + order_id + '/cancelinfo',
    method: 'get',
    params: query
  })
}

export function processDrugOrders(order_id, query) {
  return fetch({
    url: '/order/' + order_id + '/processdrug',
    method: 'put',
    params: query
  })
}

export function cancelConfirm(order_id, query) {
  return fetch({
    url: '/order/' + order_id + '/confirmcancel',
    method: 'post',
    params: query
  })
}

export function cancelOrderConfirm(order_id, query) {
  return fetch({
    url: '/order/' + order_id + '/cancel',
    method: 'post',
    params: query
  })
}
export function OmsQueueLogList(query) {
  return fetch({
    url: '/omsqueuelog',
    method: 'get',
    params: query
  })
}

export function getCartMarketingAd(query) {
  return fetch({
    url: '/orders/cartad/get',
    method: 'get',
    params: query
  })
}

export function setCartMarketingAd(query) {
  return fetch({
    url: '/orders/cartad/set',
    method: 'post',
    params: query
  })
}

export function getLogisticsList() {
  return fetch({
    url: '/trade/logistics/list',
    method: 'get'
  })
}

export function setKdniaoSetting(query) {
  return fetch({
    url: '/trade/kuaidi/setting',
    method: 'post',
    params: query
  })
}

export function getKdniaoSetting(query) {
  return fetch({
    url: '/trade/kuaidi/setting',
    method: 'get',
    params: query
  })
}

export function seSfbspSetting(query) {
  return fetch({
    url: '/trade/sfbsp/setting',
    method: 'post',
    params: query
  })
}

export function getSfbspSetting(query) {
  return fetch({
    url: '/trade/sfbsp/setting',
    method: 'get',
    params: query
  })
}

export function getDeliveryDetail(query) {
  return fetch({
    url: '/delivery/details',
    method: 'get',
    params: query
  })
}

export function getRefundErrorLogsList(query) {
  return fetch({
    url: '/trade/refunderrorlogs/list',
    method: 'get',
    params: query
  })
}
export function getTradeRateList(query) {
  return fetch({
    url: '/trade/rate',
    method: 'get',
    params: query
  })
}

export function refundResubmit(id) {
  return fetch({
    url: '/trade/refunderrorlogs/resubmit/' + id,
    method: 'put'
  })
}

export function replyTradeRate(query) {
  return fetch({
    url: '/trade/rate',
    method: 'put',
    params: query
  })
}

export function getTradeRateDetails(rate_id) {
  return fetch({
    url: '/trade/' + rate_id + '/rate',
    method: 'get'
  })
}

export function deleteRate(id) {
  return fetch({
    url: '/trade/rate/' + id,
    method: 'delete'
  })
}

export function isBind() {
  return fetch({
    url: '/third/saascert/isbind',
    method: 'get'
  })
}

export function isBindOMS() {
  return fetch({
    url: '/third/saascert/isbind',
    method: 'get'
  })
}

export function exportInvoice(query) {
  return fetch({
    url: '/invoice/exportdata',
    method: 'get',
    params: query
  })
}

export function isInvoiced(query) {
  return fetch({
    url: '/invoice/invoiced',
    method: 'post',
    params: query
  })
}

export function exportSalesReport(query) {
  return fetch({
    url: '/financial/salesreport',
    method: 'get',
    params: query
  })
}

export function getWriteoff(order_id) {
  return fetch({
    url: '/writeoff/' + order_id,
    method: 'get'
  })
}

export function doWriteoff(order_id, query) {
  return fetch({
    url: '/writeoff/' + order_id,
    method: 'post',
    params: query
  })
}

export function getPickupcode(order_id) {
  return fetch({
    url: '/pickupcode/' + order_id,
    method: 'get'
  })
}

export function getProcessLog(order_id) {
  return fetch({
    url: '/order/process/' + order_id,
    method: 'get'
  })
}

export function getTeadeSetting() {
  return fetch({
    url: '/trade/setting',
    method: 'get'
  })
}

export function setTradeSetting(data) {
  return fetch({
    url: '/trade/setting',
    method: 'post',
    params: data
  })
}

export function getPayOrderInfo(order_id, pay_type) {
  return fetch({
    url: '/order/payorderinfo/' + order_id + '?pay_type=' + pay_type,
    method: 'get'
  })
}

export function getRefundOrderInfo(refund_bn, pay_type) {
  return fetch({
    url: '/order/refundorderinfo/' + refund_bn + '?pay_type=' + pay_type,
    method: 'get'
  })
}

export function doBusinessReceipt(order_id) {
  return fetch({
    url: '/businessreceipt/' + order_id,
    method: 'post'
  })
}

export function confirmBack(order_id) {
  return fetch({
    url: '/confirm/goods/' + order_id,
    method: 'post'
  })
}

export function editLogisticsList(orders_delivery_id, query) {
  return fetch({
    url: '/delivery/' + orders_delivery_id,
    method: 'put',
    params: query
  })
}

export function chinaumsDivisionList(query) {
  return fetch({
    url: '/division/list',
    method: 'get',
    params: query
  })
}

export function chinaumsDivisionDetailList(query) {
  return fetch({
    url: '/division/detail/list',
    method: 'get',
    params: query
  })
}

export function chinaumsDivisionErrorlogList(query) {
  return fetch({
    url: '/division/errorlog/list',
    method: 'get',
    params: query
  })
}

export function chinaumsDivisionErrorlogResubmit(id) {
  return fetch({
    url: '/division/errorlog/resubmit/' + id,
    method: 'put'
  })
}

export function chinaumsDivisionExportData(query) {
  return fetch({
    url: '/division/exportdata',
    method: 'get',
    params: query
  })
}

export function chinaumsDivisionDetailExportData(query) {
  return fetch({
    url: '/division/detail/exportdata',
    method: 'get',
    params: query
  })
}

// 订单改价
export function changePrice(params) {
  return fetch({
    url: '/order/markdown',
    method: 'post',
    params
  })
}

// 订单改价确认
export function changePriceConfirm(params) {
  return fetch({
    url: '/order/markdown/confirm',
    method: 'post',
    params
  })
}

// 售后申请
export function salesAfterApply(params) {
  return fetch({
    url: '/aftersales/apply',
    method: 'post',
    params
  })
}
