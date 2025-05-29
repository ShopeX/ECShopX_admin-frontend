import fetch from '../utils/fetch'

//实体订单列表/自营订单列表 （备注）
export function remarks({ orderId, ...restParams }) {
  return fetch({
    url: `/remarks/${orderId}`,
    method: 'put',
    params: restParams
  })
}

//售后列表添加备注功能
export function afterRemarks(params) {
  return fetch({
    url: `/aftersales/remark`,
    method: 'put',
    params: params
  })
}

// 更新发票信息
export function updateInvoice(id, params) {
  return fetch({
    url: `/order/invoice/update/${id}`,
    method: 'post',
    params: params
  })
}

// 获取发票信息
export function getInvoice(id, params) {
  return fetch({
    url: `/order/invoice/info/${id}`,
    method: 'get',
    params: params
  })
}

// 更新发票备注
export function updateInvoiceRemark(id, params) {
  return fetch({
    url: `/order/invoice/updateremark/${id}`,
    method: 'post',
    params: params
  })
}

// 获取发票日志列表
export function getInvoiceLog(params) {
  return fetch({
    url: `/order/invoice/log/list`,
    method: 'get',
    params: params
  })
}

// 重发至邮箱
export function resendInvoiceEmail(params) {
  return fetch({
    url: `/order/invoice/resend`,
    method: 'get',
    params: params
  })
}

// 新版 查询订单列表
export function getOrderItems(params) {
  return fetch({
    url: `/orders/items`,
    method: 'get',
    params: params
  })
}



// 创建售后规则
export function approvalRuleCreate(params) {
  return fetch({
    url: `/order/aftersaleapproval/rule/create`,
    method: 'post',
    params: params
  })
}




// 更新
export function approvalRuleUpdate(id, params) {
  return fetch({
    url: `/order/aftersaleapproval/rule/update/${id}`,
    method: 'post',
    params: params
  })
}


// 删除
export function approvalRuleDelete(id) {
  return fetch({
    url: `/order/aftersaleapproval/rule/delete/${id}`,
    method: 'post'
  })
}

