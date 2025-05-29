import fetch from '@/utils/fetch'

// 同步直播频道
export function channelSync(params) {
  return fetch({
    url: 'polyv/channel/sync',
    method: 'get',
    params
  })
}

// 获取直播列表
export function getChannelList(params) {
  return fetch({
    url: 'polyv/channel/list',
    method: 'get',
    params
  })
}
// 获取直播详情
export function getChannelInfo(id, params) {
  return fetch({
    url: 'polyv/channel/' + id,
    method: 'get',
    params
  })
}
//删除直播
export function deleteChannelInfo(id, params) {
  return fetch({
    url: 'polyv/channel/' + id,
    method: 'delete',
    params
  })
}
//更新直播
export function dupdateChannelInfo(id, params) {
  return fetch({
    url: 'polyv/channel/' + id,
    method: 'put',
    params
  })
}

// 获取单点登录地址
export function getChannelssoAuthUrl(id, params) {
  return fetch({
    url: 'polyv/channelsso/authurl/' + id,
    method: 'get',
    params
  })
}
// 修改直播状态
export function editChannelStatus(id, params) {
  return fetch({
    url: 'polyv/channel/audit_status/' + id,
    method: 'post',
    params
  })
}
// 关联直播商品
export function editChannelRelItems(id, params) {
  return fetch({
    url: 'polyv/channel/rel-items/' + id,
    method: 'post',
    params
  })
}
// 获取直播关联商品
export function getChannelRelItems(id, params) {
  return fetch({
    url: 'polyv/channel/rel-items/' + id,
    method: 'get',
    params
  })
}
// 保存关联页面
export function saveChannelRelPages(id, params) {
  return fetch({
    url: 'polyv/channel/rel-pages/' + id,
    method: 'post',
    params
  })
}
// 获取关联页面
export function getChannelRelPages(id, params) {
  return fetch({
    url: 'polyv/channel/rel-pages/' + id,
    method: 'get',
    params
  })
}
// 获取直播券包
export function getChannelRelCouponPackage(id, params) {
  return fetch({
    url: 'polyv/channel/rel-coupon-package/' + id,
    method: 'get',
    params
  })
}
// 保存直播券包
export function saveChannelRelCouponPackage(id, params) {
  return fetch({
    url: 'polyv/channel/rel-coupon-package/' + id,
    method: 'post',
    params
  })
}

// 获取直播优惠券
export function getChannelRelCoupon(id, params) {
  return fetch({
    url: 'polyv/channel/rel-coupon/' + id,
    method: 'get',
    params
  })
}
// 保存直播优惠券
export function saveChannelRelCoupon(id, params) {
  return fetch({
    url: 'polyv/channel/rel-coupon/' + id,
    method: 'post',
    params
  })
}
