/**
 * AI 素材库 API
 */
import { fetch } from './request'

export function generateImage(payload) {
  return fetch({ url: '/ai/material/generate', method: 'post', params: payload })
}

export function regenerate(payload) {
  return fetch({ url: '/ai/material/regenerate', method: 'post', params: payload })
}

export function getSizeMap() {
  return fetch({ url: '/ai/material/size-map', method: 'get' })
}

export function listConversations(params) {
  return fetch({ url: '/ai/material/conversations', method: 'get', params })
}

export function getConversation(id) {
  return fetch({ url: `/ai/material/conversations/${id}`, method: 'get' })
}

export function deleteConversation(id) {
  return fetch({ url: `/ai/material/conversations/${id}`, method: 'delete' })
}

// 唯一入口：后端薄封装到老素材表 espier_uploadimages, source=ai_generate
export function saveToLibrary(payload) {
  return fetch({ url: '/ai/material/save-to-library', method: 'post', params: payload })
}

// 注：原 listLibrary / updateMaterial / deleteMaterial / listTags / createTag 已废弃
//     AI 素材列表 / 删除 / 移动分组：直接调老接口（'@/api/picker' / '@/api/qiniu' 中的 deleteImage）
//     AI 素材分组：'@/api/picker' 的 getImageAllCatgory / addImageCatgory，请求时带 source=ai_generate

export function listTemplates(params) {
  return fetch({ url: '/ai/material/templates', method: 'get', params })
}

export function createTemplate(payload) {
  return fetch({ url: '/ai/material/templates', method: 'post', params: payload })
}

export function updateTemplate(id, payload) {
  return fetch({ url: `/ai/material/templates/${id}`, method: 'put', params: payload })
}

export function deleteTemplate(id) {
  return fetch({ url: `/ai/material/templates/${id}`, method: 'delete' })
}
