import { fetch } from './request'
// 获取经销商列表
export function getList(query) {
  return fetch({
    url: '/adapay/member/list',
    method: 'get',
    params: query
  })
}

// 获取省市
export function getAreaList(query) {
  return fetch({
    url: '/adapay/corp_member/get_area',
    method: 'get',
    params: query
  })
}
// 获取银行
export function getBankList(query) {
  return fetch({
    url: '/adapay/corp_member/get_bank',
    method: 'get',
    params: query
  })
}

// 创建企业用户对象
export function createCorp(query) {
  return fetch({
    url: '/adapay/corp_member/create',
    method: 'post',
    params: query
  })
}
// 更新企业用户对象
export function updateCorp(id, query) {
  return fetch({
    url: `/adapay/corp_member/update/${id}`,
    method: 'post',
    params: query
  })
}
// 创建个人用户对象
export function createPerson(query) {
  return fetch({
    url: '/adapay/member/create',
    method: 'post',
    params: query
  })
}
// 更新个人用户对象
export function updatePerson(id, query) {
  return fetch({
    url: '/adapay/member/update/' + id,
    method: 'post',
    params: query
  })
}

// 查看  账户类型（个人）
export function checkPerson(id) {
  return fetch({
    url: `/adapay/member/get/${id}`,
    method: 'get'
  })
}
// 查看 账户类型（企业）
export function checkCorp(id) {
  return fetch({
    url: `/adapay/corp_member/get/${id}`,
    method: 'get'
  })
}

// 查看 账户类型（企业）
export function getConfirmLetterFile(id) {
  return fetch({
    url: `/adapay/corp_member/get_file_url/${id}`,
    method: 'get'
  })
}

// 个人提交
export function submitReviewPerson(query) {
  return fetch({
    url: `/adapay/member/submit_review/`,
    method: 'get',
    params: query
  })
}

// // 企业提交
// export function submitReviewCorp(query){
//   return fetch({
//     url:`/adapay/member/submit_review/`,
//     method:'get',
//     params: query
//   })
// }

// 查看用户状态
export function userStatus() {
  return fetch({
    url: '/adapay/member/auditState',
    method: 'get'
  })
}
