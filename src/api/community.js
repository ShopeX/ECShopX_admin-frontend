import fetch from '../utils/fetch'

export function getCommunityDetail (id) {
  return fetch({
    url: '/community/' + id,
    method: 'get'
  })
}

export function communityCreate (query) {
  return fetch({
    url: '/community',
    method: 'post',
    params: query
  })
}

export function communityUpdate (id, query) {
  return fetch({
    url: '/community/' + id,
    method: 'put',
    params: query
  })
}

export function communityDelete (id) {
  return fetch({
    url: '/community/' + id,
    method: 'delete'
  })
}

export function getCommunityList (query) {
  return fetch({
    url: '/community',
    method: 'get',
    params: query
  })
}

export function CommunityStatusUpdate (query) {
  return fetch({
    url: '/communitys/updateStatus',
    method: 'put',
    params: query
  })
}

export function CommunityActivityCreate (query) {
  return fetch({
    url: '/promotions/community/activity',
    method: 'post',
    params: query,
    refreshToken: true
  })
}

export function CommunityActivityList (query) {
  return fetch({
    url: '/promotions/community/activity',
    method: 'get',
    params: query
  })
}

export function CommunityActivityInfo (id, query) {
  return fetch({
    url: '/promotions/community/activity/' + id,
    method: 'get',
    params: query
  })
}

export function CommunityActivityStatusUpdate (query) {
  return fetch({
    url: '/promotions/community/activitys/updatestatus',
    method: 'put',
    params: query
  })
}

export function communityActivityItemList (id, query) {
  return fetch({
    url: '/promotions/community/activityItemList/' + id,
    method: 'get',
    params: query
  })
}

export function getDeliveryOrderList (query) {
  return fetch({
    url: '/promotions/community/deliveryorder',
    method: 'get',
    params: query
  })
}

export function getDeliveryOrderDetail (deliveryid) {
  return fetch({
    url: '/promotions/community/deliveryorder/' + deliveryid,
    method: 'get'
  })
}

export function shippingDeliveryorder (query) {
  return fetch({
    url: '/promotions/community/deliveryorder',
    method: 'put',
    params: query
  })
}

export function batchShippingDeliveryorder (query) {
  return fetch({
    url: '/promotions/community/batchdeliveryorder',
    method: 'put',
    params: query
  })
}
export function CommunityActivityUpdate (id, query) {
  return fetch({
    url: '/promotions/community/activity/' + id,
    method: 'put',
    params: query,
    refreshToken: true
  })
}
export function setDeliveryorderMemo (query) {
  return fetch({
    url: '/promotions/community/deliveryordermemo',
    method: 'put',
    params: query
  })
}

export function exportDeliveryorder (query) {
  return fetch({
    url: '/promotions/community/deliveryorderexport',
    method: 'get',
    params: query
  })
}

export function exportDeliveryorderInfo (query) {
  return fetch({
    url: '/promotions/community/deliveryorderinfo/export',
    method: 'get',
    params: query
  })
}

export function exportActivityItemList (query) {
  return fetch({
    url: '/promotions/community/activityGoodsExport',
    method: 'get',
    params: query
  })
}

export function getCommunityPointList (query) {
  return fetch({
    url: '/promotions/community/point',
    method: 'get',
    params: query
  })
}

export function changeCommunityPoint (query) {
  return fetch({
    url: '/promotions/community/point',
    method: 'post',
    params: query
  })
}

export function processCashWithdrawal (cash_withdrawal_id, query) {
  return fetch({
    url: '/promotions/community/cash_withdrawals/' + cash_withdrawal_id,
    method: 'put',
    params: query
  })
}

export function getCashWithdrawalList (query) {
  return fetch({
    url: '/promotions/community/cashWithdrawals',
    method: 'get',
    params: query
  })
}

export function getMerchantTradeList (cash_withdrawal_id, query) {
  return fetch({
    url: '/promotions/community/cashWithdrawal/payinfo/' + cash_withdrawal_id,
    method: 'get',
    params: query
  })
}

export function withdrawExport (query) {
  return fetch({
    url: '/promotions/community/cashWithdrawals/export/',
    method: 'get',
    params: query
  })
}

export function batchProcessCashWithdrawal (query) {
  return fetch({
    url: '/community/cashWithdrawal/batchpayinfo',
    method: 'put',
    params: query
  })
}
