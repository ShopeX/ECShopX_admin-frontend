import fetch from '../utils/fetch'

export function getMembers(query) {
  return fetch({
    url: '/members',
    method: 'get',
    params: query
  })
}
export function getMember(query) {
  return fetch({
    url: '/member',
    method: 'get',
    params: query
  })
}

export function setMemberRegisterSetting(query) {
  return fetch({
    url: '/members/register/setting',
    method: 'post',
    params: query
  })
}

export function setMemberRegisterContentSetting(query) {
  return fetch({
    url: '/members/register/setting',
    method: 'post',
    params: query
  })
}

export function setMemberanalysisrightsContent(query) {
  return fetch({
    url: '/members/analysisrights/content',
    method: 'post',
    params: query
  })
}

export function getMemberanalysisrightsContent() {
  return fetch({
    url: '/members/analysisrights/content',
    method: 'get'
  })
}

export function getMemberRegisterSetting() {
  return fetch({
    url: '/members/register/setting',
    method: 'get'
  })
}

export function memberSmsSend(query) {
  return fetch({
    url: '/member/smssend',
    method: 'post',
    params: query
  })
}

export function saveTag(query) {
  return fetch({
    url: '/member/tag',
    method: 'post',
    params: query
  })
}

export function getTagList(query) {
  return fetch({
    url: '/member/tag',
    method: 'get',
    params: query
  })
}

export function updateMemberMobile(query) {
  return fetch({
    url: '/member',
    method: 'put',
    params: query
  })
}

export function setSindusersalespersonrel(query) {
  return fetch({
    url: '/member/bindusersalespersonrel',
    method: 'post',
    params: query
  })
}

export function updateMemberGrade(query) {
  return fetch({
    url: '/member/grade',
    method: 'put',
    params: query
  })
}

export function batchupdateMemberGrade(query) {
  return fetch({
    url: '/member/grade',
    method: 'patch',
    params: query
  })
}

export function updateMemberInfo(query) {
  return fetch({
    url: '/member',
    method: 'patch',
    params: query
  })
}

export function getMemberOperateLog(query) {
  return fetch({
    url: '/operate/loglist',
    method: 'get',
    params: query
  })
}

export function getTagInfo(tagId) {
  return fetch({
    url: '/member/tag/' + tagId,
    method: 'get'
  })
}

export function updateTag(query) {
  return fetch({
    url: '/member/tag',
    method: 'put',
    params: query
  })
}

export function deleteTag(tagId) {
  return fetch({
    url: '/member/tag/' + tagId,
    method: 'delete'
  })
}

export function usersRelTagsDel(query) {
  return fetch({
    url: '/member/reltagdel/',
    method: 'post',
    params: query
  })
}

export function tagSearchUser(query) {
  return fetch({
    url: '/member/tagsearch',
    method: 'GET',
    params: query
  })
}

export function listVipGrade(query) {
  return fetch({
    url: '/vipgrade/order',
    method: 'GET',
    params: query
  })
}

export function memberExport(query) {
  return fetch({
    url: '/member/export',
    method: 'GET',
    params: query
  })
}

export function salespersonBindExport(query) {
  return fetch({
    url: '/salespersonbind/export',
    method: 'GET',
    params: query
  })
}

export function createTagCategory(query) {
  return fetch({
    url: '/member/tagcategory',
    method: 'post',
    params: query
  })
}

export function getTagCategoryList(query) {
  return fetch({
    url: '/member/tagcategory',
    method: 'get',
    params: query
  })
}

export function getTagCategoryInfo(categoryId) {
  return fetch({
    url: '/member/tagcategory/' + categoryId,
    method: 'get'
  })
}

export function updateTagCategory(categoryId, query) {
  return fetch({
    url: '/member/tagcategory/' + categoryId,
    method: 'put',
    params: query
  })
}

export function deleteTagCategory(categoryId) {
  return fetch({
    url: '/member/tagcategory/' + categoryId,
    method: 'delete'
  })
}

export function batchOperating(query) {
  return fetch({
    url: '/member/batchOperating',
    method: 'POST',
    params: query
  })
}

export function updateMemberBasicInfo(query) {
  return fetch({
    url: '/member/update',
    method: 'put',
    params: query
  })
}

export function getMembersWhitelistList(query) {
  return fetch({
    url: '/members/whitelist/list',
    method: 'get',
    params: query
  })
}

export function createMembersWhitelist(query) {
  return fetch({
    url: '/members/whitelist',
    method: 'post',
    params: query
  })
}

export function updateMembersWhitelist(id, query) {
  return fetch({
    url: '/members/whitelist/' + id,
    method: 'post',
    params: query
  })
}

export function deleteMembersWhitelist(id) {
  return fetch({
    url: '/members/whitelist/' + id,
    method: 'delete'
  })
}

export function getSubscribeList(query) {
  return fetch({
    url: '/members/subscribe/list',
    method: 'get',
    params: query
  })
}

// 会员信息表单字段获取
export function getRegForm(query) {
  return fetch({
    url: '/espier/config/request_fields',
    method: 'get',
    params: query
  })
}

// 会员信息表单字段更新
export function updateRegForm(query) {
  return fetch({
    url: '/espier/config/request_fields/info',
    method: 'put',
    params: query
  })
}

// 会员信息表单字段删除
export function deleteRegForm(query) {
  return fetch({
    url: '/espier/config/request_fields',
    method: 'delete',
    params: query
  })
}

// 会员信息表单字段新增
export function createRegForm(query) {
  return fetch({
    url: '/espier/config/request_fields',
    method: 'post',
    params: query
  })
}

// 会员信息表单状态切换
export function toggleRegForm(query) {
  return fetch({
    url: '/espier/config/request_fields/switch',
    method: 'put',
    params: query
  })
}

export function getMemberFieldSetting(query) {
  return fetch({
    url: '/espier/config/request_field_setting',
    method: 'get',
    params: query
  })
}

export function saveMemberFieldSetting(params) {
  return fetch({
    url: 'espier/config/request_field_setting',
    method: 'post',
    params: params
  })
}

export function setCheif(query) {
  return fetch({
    url: '/community/chief/setMemberCommunity',
    method: 'post',
    params: query
  })
}

// 获取内购企业列表
export function getEnterpriseList(params) {
  return fetch({
    url: '/members/enterprise',
    method: 'get',
    params
  })
}

// 新增内购企业
export function addEnterpriseInfo(params) {
  return fetch({
    url: '/members/enterprise',
    method: 'post',
    params
  })
}

// 获取内购企业详情
export function getEnterpriseDetail(id) {
  return fetch({
    url: '/members/enterprise/' + id,
    method: 'get'
  })
}

// 更新内购企业
export function updateEnterpriseInfo(id, params) {
  return fetch({
    url: '/members/enterprise/' + id,
    method: 'put',
    params
  })
}

// 删内购企业
export function deteleEnterpriseInfo(id, params) {
  return fetch({
    url: '/members/enterprise' + id,
    method: 'delete',
    params
  })
}

// 更新内购企业状态
export function updateEnterpriseStaus(id, params) {
  return fetch({
    url: '/members/enterprise/updateStatus/' + id,
    method: 'put',
    params
  })
}
