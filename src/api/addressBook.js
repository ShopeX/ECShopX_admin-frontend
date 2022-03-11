import fetch from '../utils/fetch'

// 获取部门列表
export function getWorkwechat (params = {}) {
  return fetch({
    url: '/workwechat/report',
    method: 'get',
    params: params
  })
}

// 获取部门成员
export function getMemberByClub (departmentId) {
  return fetch({
    url: `/workwechat/report/${departmentId}`,
    method: 'get'
  })
}

// 同步部门信息到店铺
export function syncClubToStore (data) {
  return fetch({
    url: '/workwechat/report/syncDistributor',
    method: 'post',
    params: data
  })
}

// 同步成员到导购员
export function syncMemberToGuide (data) {
  return fetch({
    url: '/workwechat/report/syncSalesperson',
    method: 'post',
    params: data
  })
}
