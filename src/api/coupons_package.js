import fetch from '@/utils/fetch'
// 获取卡券包列表
export const packageList = (params) => {
  return fetch({
    url: '/voucher/package/list',
    method: 'get',
    params
  })
}

// 获取优惠券列表
export const couponList = (params) => {
  return fetch({
    url: '/discountcard/list',
    method: 'get',
    params
  })
}

// 创建劵包
export const createdCoupons = (params) => {
  return fetch({
    url: '/voucher/package',
    method: 'post',
    params
  })
}
// 查看卡劵包
export const couponDetail = (params) => {
  return fetch({
    url: '/voucher/package/details',
    method: 'get',
    params
  })
}

// 编辑卡劵包
export const editCouponPackage = (params) => {
  return fetch({
    url: '/voucher/package',
    method: 'patch',
    params
  })
}

// 删除劵包
export const deleteCoupon = (params) => {
  return fetch({
    url: '/voucher/package',
    method: 'delete',
    params
  })
}

// 卡劵包领取日志
export const couponLog = (params) => {
  return fetch({
    url: '/voucher/package/get_receives_log',
    method: 'get',
    params
  })
}

// 检测包内优惠券等级限制，获取不可领用的等级

export const checkCouponPackage = (params) => {
  return fetch({
    url: '/voucher/package/check_grade_limit',
    method: 'post',
    params
  })
}
