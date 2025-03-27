import fetch from '../utils/fetch'

export function saveSetting (query) {
  return fetch({
    url: '/selfhelp/formdata',
    method: 'post',
    params: query
  })
}

export function getSettingList (query) {
  return fetch({
    url: '/selfhelp/formdata',
    method: 'get',
    params: query
  })
}

export function getSettingInfo (id) {
  return fetch({
    url: '/selfhelp/formdata/' + id,
    method: 'get'
  })
}

export function updateSetting (query) {
  return fetch({
    url: '/selfhelp/formdata',
    method: 'put',
    params: query
  })
}

export function deleteSetting (id) {
  return fetch({
    url: '/selfhelp/formdata/discard/' + id,
    method: 'post'
  })
}

export function restoreSetting (id) {
  return fetch({
    url: '/selfhelp/formdata/restore/' + id,
    method: 'post'
  })
}

export function saveTemplate (query) {
  return fetch({
    url: '/selfhelp/formtem',
    method: 'post',
    params: query
  })
}

export function getTemplateList (query) {
  return fetch({
    url: '/selfhelp/formtem',
    method: 'get',
    params: query
  })
}

export function getTemplateInfo (id) {
  return fetch({
    url: '/selfhelp/formtem/' + id,
    method: 'get'
  })
}

export function updateTemplate (query) {
  return fetch({
    url: '/selfhelp/formtem',
    method: 'put',
    params: query
  })
}

export function deleteTemplate (id) {
  return fetch({
    url: '/selfhelp/formtem/discard/' + id,
    method: 'post'
  })
}

export function restoreTemplate (id) {
  return fetch({
    url: '/selfhelp/formtem/restore/' + id,
    method: 'post'
  })
}

export function physicalFirst () {
  return fetch({
    url: '/selfhelp/setting/physical',
    method: 'get'
  })
}

export function physicalNormal (query) {
  return fetch({
    url: '/selfhelp/setting/physical',
    method: 'post',
    params: query
  })
}

export function allUserList (query) {
  return fetch({
    url: '/selfhelp/physical/alluserlist',
    method: 'get',
    params: query
  })
}

export function allUserData (query) {
  return fetch({
    url: '/selfhelp/physical/userdata',
    method: 'get',
    params: query
  })
}

export function timeData (query) {
  return fetch({
    url: '/selfhelp/physical/datelist',
    method: 'get',
    params: query
  })
}

// 活动
export function regActivityList (query) {
  return fetch({
    url: '/selfhelp/registrationActivity/list',
    method: 'get',
    params: query
  })
}

export function regActivityEasylist (query) {
  return fetch({
    url: '/selfhelp/registrationActivity/easylist',
    method: 'get',
    params: query
  })
}

export function regActivityAdd (query) {
  return fetch({
    url: '/selfhelp/registrationActivity/create',
    method: 'post',
    params: query
  })
}

// 活动
export function regActivityGet (query) {
  return fetch({
    url: '/selfhelp/registrationActivity/get',
    method: 'get',
    params: query
  })
}

export function regActivityUpdate (query) {
  return fetch({
    url: '/selfhelp/registrationActivity/update',
    method: 'put',
    params: query
  })
}

// 活动
export function regActivityInvalid (query) {
  return fetch({
    url: '/selfhelp/registrationActivity/invalid',
    method: 'post',
    params: query
  })
}

export function regActivityDel (query) {
  return fetch({
    url: '/selfhelp/registrationActivity/del',
    method: 'post',
    params: query
  })
}

export function regActivityRecordlist (query) {
  return fetch({
    url: '/selfhelp/registrationRecord/list',
    method: 'get',
    params: query
  })
}
export function regActivityRecordinfo (query) {
  return fetch({
    url: '/selfhelp/registrationRecord/get',
    method: 'get',
    params: query
  })
}

export function recordExport (query) {
  return fetch({
    url: '/selfhelp/registrationRecord/export',
    method: 'get',
    params: query
  })
}
export function registrationReview (query) {
  return fetch({
    url: '/selfhelp/registrationReview',
    method: 'put',
    params: query
  })
}

export function registrationVerifyLog (query) { // 核销记录
  return fetch({
    url: '/selfhelp/registrationVerifyLog',
    method: 'get',
    params: query
  })
}

export function registrationVerify (query) { // 活动核销
  return fetch({
    url: '/selfhelp/registrationVerify',
    method: 'post',
    params: query
  })
}