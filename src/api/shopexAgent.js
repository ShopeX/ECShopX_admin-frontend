import { fetch } from './request'

export function getShopexAgentApplications(query) {
  return fetch({
    url: '/ai/shopex-agent/applications',
    method: 'get',
    params: query
  })
}

export function applyShopexAgentApplication(query) {
  return fetch({
    url: '/ai/shopex-agent/applications/apply',
    method: 'post',
    params: query
  })
}

export function getShopexAgentWallet(query) {
  return fetch({
    url: '/ai/shopex-agent/wallet',
    method: 'get',
    params: query
  })
}

export function getShopexAgentUsage(query) {
  return fetch({
    url: '/ai/shopex-agent/usage',
    method: 'get',
    params: query
  })
}

export function runShopexAgentWorkflow(query) {
  return fetch({
    url: '/ai/shopex-agent/workflow/run',
    method: 'post',
    params: query
  })
}

export function sendShopexAgentChatMessage(query) {
  return fetch({
    url: '/ai/shopex-agent/chat/messages',
    method: 'post',
    params: query
  })
}
