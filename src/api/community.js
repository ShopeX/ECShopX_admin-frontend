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

export function getCommunityOrderList (query) {
  return fetch({
    url: '/community/orders',
    method: 'get',
    params: query
  })
}

export function getCommunityOrderDetail (orderId) {
  return fetch({
    url: '/community/order/' + orderId,
    method: 'get'
  })
}

// 添加活动商品
export function addActivityGoods (params) {
  return fetch({
    url: `/community/items`,
    method: 'post',
    params
  })
}

// 获取社区拼团商品列表
export function getActivityGoods (params) {
  return fetch({
    url: `/community/items`,
    method: 'get',
    params
  })
}

// 删除商品
export function deleteActivityGoods (id) {
  return fetch({
    url: `/community/item/${id}`,
    method: 'delete'
  })
}

// 修改商品起送量
export function modifyGoodsDeliverNum (params) {
  return fetch({
    url: `/community/itemMinDeliveryNum`,
    method: 'post',
    params
  })
}

// 修改商品排序编号
export function modifyGoodsSort (params) {
  return fetch({
    url: `/community/itemSort`,
    method: 'post',
    params
  })
}

// 保存社区团购设置
export function modifyActivitySetting (params) {
  return fetch({
    url: `/community/activity/setting`,
    method: 'post',
    params
  })
}

// 获取社区团购设置
export function getActivitySetting (params) {
  return fetch({
    url: `/community/activity/setting`,
    method: 'get',
    params
  })
}

// 配置字段列表
export function getCommunityChiefApplyFields (params) {
  return fetch({
    url: `/community/chief/apply_fields`,
    method: 'get',
    params
  })
}

// 创建字段
export function createCommunityChiefApplyFields (params) {
  return fetch({
    url: `/community/chief/apply_field`,
    method: 'post',
    params
  })
}

// 更新字段的开关
export function modifyFieldSwitch (id, params) {
  return fetch({
    url: `/community/chief/apply_field/switch/${id}`,
    method: 'post',
    params
  })
}

// 删除字段
export function deleteCommunityField (id) {
  return fetch({
    url: `/community/chief/apply_field/${id}`,
    method: 'delete'
  })
}

// 更新字段的内容
export function modifyCommunityField (params) {
  const { id } = params
  return fetch({
    url: `/community/chief/apply_field/${id}`,
    method: 'post',
    params
  })
}

// 团长申请列表
export function getChiefList (params) {
  return fetch({
    url: `/community/chief/apply/list`,
    method: 'get',
    params
  })
}

// 团长申请详情
export function getChiefDetail (id) {
  return fetch({
    url: `/community/chief/apply/info/${id}`,
    method: 'get'
  })
}

// 团长申请审批
export function approveChief (apply_id, params) {
  return fetch({
    url: `/community/chief/approve/${apply_id}`,
    method: 'post',
    params
  })
}

// 获取小程序码
export function getChiefWxCode (params) {
  return fetch({
    url: `/community/chief/apply/wxaCode`,
    method: 'get',
    params
  })
}
