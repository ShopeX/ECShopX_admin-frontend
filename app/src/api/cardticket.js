import fetch from '../utils/fetch'

export function getCardList(query) {
  return fetch({
    url: '/discountcard/list',
    method: 'get',
    params: query
  })
}

export function getEffectiveCardList(query) {
  return fetch({
    url: '/effectiveDiscountcard/list',
    method: 'get',
    params: query
  })
}

export function getCardUserList(query) {
  return fetch({
    url: '/discountcard/detail/list',
    method: 'get',
    params: query
  })
}

export function getCardDetail(query) {
  return fetch({
    url: '/discountcard/get',
    method: 'get',
    params: query
  })
}

export function creatCard(query) {
  return fetch({
    url: '/discountcard',
    method: 'post',
    params: query
  })
}

export function updateCard(query) {
  return fetch({
    url: '/discountcard',
    method: 'PATCH',
    params: query
  })
}

export function removeCard(query) {
  return fetch({
    url: '/discountcard',
    method: 'delete',
    params: query
  })
}

export function getWechatColor() {
  return fetch({
    url: '/card/color',
    method: 'get'
  })
}

export function getCouponHtml(cardId) {
  return fetch({
    url: '/card/html',
    method: 'get',
    params: cardId
  })
}

export function getQRcode(cardId) {
  return fetch({
    url: '/card/qrcode/' + cardId,
    method: 'get'
  })
}

export function pullWechatCard() {
  return fetch({
    url: '/card/sync',
    method: 'get'
  })
}

export function updateStore(query) {
  return fetch({
    url: '/discountcard/updatestore',
    method: 'post',
    params: query
  })
}

export function pushToWechat(query) {
  return fetch({
    url: '/discountcard/uploadToWechat',
    method: 'post',
    params: query
  })
}

export function saveVipGrade(query) {
  return fetch({
    url: '/membercard/vipgrade',
    method: 'put',
    params: query
  })
}

export function listVipGrade(query) {
  return fetch({
    url: '/membercard/vipgrade',
    method: 'get',
    params: query
  })
}

export function getAllUserVipGrade(query) {
  return fetch({
    url: '/vipgrades/uselist',
    method: 'get',
    params: query
  })
}

export function receiveMemberCard(query) {
  return fetch({
    url: '/vipgrades/active_delay',
    method: 'put',
    params: query
  })
}

export function batchReceiveMemberCard(query) {
  return fetch({
    url: '/vipgrades/batch_active_delay',
    method: 'put',
    params: query
  })
}

export function getCouponGrantSet() {
  return fetch({
    url: '/discountcard/couponGrantSetting',
    method: 'get'
  })
}

export function saveCouponGrantSet(data) {
  return fetch({
    url: '/discountcard/couponGrantSetting',
    method: 'post',
    params: data
  })
}

export function getSalepersonCouponList(query) {
  return fetch({
    url: '/salesperson/coupon',
    method: 'get',
    params: query
  })
}

export function createSalepersonCoupon(params) {
  return fetch({
    url: '/salesperson/coupon',
    method: 'post',
    params: params
  })
}

export function deleteSalepersonCoupon(id) {
  return fetch({
    url: '/salesperson/coupon/' + id,
    method: 'delete'
  })
}
