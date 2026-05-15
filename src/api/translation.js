/**
 * AI Translation API module
 */
import { fetch } from './request'

export function getTranslationConfig() {
  return fetch({
    url: '/ai/translation/config',
    method: 'get'
  })
}

export function saveTranslationConfig(query) {
  return fetch({
    url: '/ai/translation/config',
    method: 'post',
    params: query
  })
}

export function syncTranslate(query) {
  return fetch({
    url: '/ai/translation/sync',
    method: 'post',
    params: query
  })
}

export function getTranslateTasks(query) {
  return fetch({
    url: '/ai/translation/tasks',
    method: 'get',
    params: query
  })
}

export function createTranslateTask(query) {
  return fetch({
    url: '/ai/translation/tasks',
    method: 'post',
    params: query
  })
}

export function getTranslateTask(taskId) {
  return fetch({
    url: `/ai/translation/tasks/${taskId}`,
    method: 'get'
  })
}

export function retryTranslateTask(taskId) {
  return fetch({
    url: `/ai/translation/tasks/${taskId}/retry`,
    method: 'post'
  })
}
