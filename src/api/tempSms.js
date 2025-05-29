import fetch from '@/utils/fetch'

// 获取短信状态
export function getaliSmsStatus() {
  return fetch({
    url: `/chuanglansms/status`,
    method: 'get'
  })
}

// 基础配置

export function getSmsConfig(params = {}) {
  return fetch({
    url: `/chuanglansms/config`,
    method: 'get',
    params
  })
}
// 修改基础配置
export function setSmsConfig(params = {}) {
  return fetch({
    url: `/chuanglansms/config`,
    method: 'post',
    params
  })
}

// 修改阿里短信状态
export function setAlisms(params = {}) {
  return fetch({
    url: `/chuanglansms/status`,
    method: 'post',
    params
  })
}

export function setTheNewSignature(params = {}) {
  return fetch({
    url: '/chuanglansms/sign/add',
    method: 'post',
    params
  })
}

export function getTheSignature(params) {
  return fetch({
    url: `/chuanglansms/sign/info`,
    method: 'get',
    params
  })
}

export function editTheSignature(params) {
  return fetch({
    url: `/chuanglansms/sign/modify`,
    method: 'post',
    params
  })
}

export function deleteTheSignature(id) {
  return fetch({
    url: `/chuanglansms/sign/delete/${id}`,
    method: 'delete'
  })
}

// 发送短信

// 短信场景列表
export function getScenarioList(params = {}) {
  return fetch({
    url: `/chuanglansms/scene/list`,
    method: 'get',
    params
  })
}

// 停用短信场景
export function offDisablingSms(params) {
  return fetch({
    url: `/chuanglansms/scene/disableItem`,
    method: 'get',
    params
  })
}

// 启用短信场景
export function onDisablingSms(params) {
  return fetch({
    url: `/chuanglansms/scene/enableItem`,
    method: 'get',
    params
  })
}

// 删除短信场景
export function deletedDisablingSms(id) {
  return fetch({
    url: `/chuanglansms/scene/deleteItem/${id}`,
    method: 'delete'
  })
}

// 短信签名列表
export function getSmsSignatureList(params) {
  return fetch({
    url: `/chuanglansms/sign/list`,
    method: 'get',
    params
  })
}

// 短信模板列表
export function getSmsTemplateList(params) {
  return fetch({
    url: `/chuanglansms/template/list`,
    method: 'get',
    params
  })
}

// 添加短信场景条目
export function addSceneItem(params) {
  return fetch({
    url: `/chuanglansms/scene/addItem`,
    method: 'post',
    params
  })
}

// 短信模板

// 签名模板列表
export function getTemplateList(params = {}) {
  return fetch({
    url: `/chuanglansms/template/list`,
    method: 'get',
    params
  })
}

// 下拉短信场景列表
export function getTemplateSeleteList(params = {}) {
  return fetch({
    url: `/chuanglansms/scene/simpleList`,
    method: 'get',
    params
  })
}

// 短信场景内容label
export function getTemplateContentLabel(params = {}) {
  return fetch({
    url: `/chuanglansms/scene/detail`,
    method: 'get',
    params
  })
}

// 添加短信模板
export function addSmsTemplate(params = {}) {
  return fetch({
    url: `/chuanglansms/template/add`,
    method: 'post',
    params
  })
}

// 短信模板detail
export function SmsTemplateDetail(params = {}) {
  return fetch({
    url: `/chuanglansms/template/info`,
    method: 'get',
    params
  })
}

// 修改短信模板
export function editSmsTemplate(params = {}) {
  return fetch({
    url: `/chuanglansms/template/modify`,
    method: 'post',
    params
  })
}

// 删除短信模板
export function deleteSmsTemplate(id) {
  return fetch({
    url: `/chuanglansms/template/delete/${id}`,
    method: 'delete'
  })
}

// 群发信息

// 添加短信任务
export function addTaskSms(params = {}) {
  return fetch({
    url: `/chuanglansms/task/add`,
    method: 'post',
    params
  })
}

// 群发任务详情
export function taskSmsDetail(params = {}) {
  return fetch({
    url: `/chuanglansms/task/info`,
    method: 'get',
    params
  })
}

// 修改群发短信
export function editTaskSms(params = {}) {
  return fetch({
    url: `/chuanglansms/task/modify`,
    method: 'post',
    params
  })
}

// 撤销删除群发短信
export function deleteTaskSms(params = {}) {
  return fetch({
    url: `/chuanglansms/task/revoke`,
    method: 'post',
    params
  })
}
