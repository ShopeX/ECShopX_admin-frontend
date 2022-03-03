import fetch from '@/utils/fetch'

// 经销商开户信息
export function getDealderInfo () {
  return fetch({
    url: 'adapay/member/get',
    method: 'get'
  })
}

// 开户审批
export function getOpenApprovedList (params) {
  return fetch({
    url: '/adapay/sub_approve/list',
    method: 'get',
    params
  })
}

// 获取开户审批详情页
export function getOpenApproveDetail (id) {
  return fetch({
    url: '/adapay/sub_approve/info/' + id,
    method: 'get'
  })
}

// 开户审批审批接
export function setDetailApprove (params) {
  return fetch({
    url: '/adapay/sub_approve/save_split_ledger',
    method: 'post',
    params
  })
}

// 获取开户信息
export function getOpenDetail () {
  return fetch({
    url: '/adapay/open_account/step',
    method: 'get'
  })
}
