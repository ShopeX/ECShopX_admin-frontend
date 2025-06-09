import fetch from '../utils/fetch'

//实体订单列表/自营订单列表 （备注）
export function remarks ({ orderId, ...restParams }) {
  return fetch({
    url: `/remarks/${orderId}`,
    method: 'put',
    params: restParams
  })
}

//售后列表添加备注功能
export function afterRemarks (params) {
  return fetch({
    url: `/aftersales/remark`,
    method: 'put',
    params: params
  })
}
