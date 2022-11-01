import fetch from '../utils/fetch'

export function createRechargeRule (query) {
  return fetch({
    url: '/deposit/rechargerule',
    method: 'post',
    params: query
  })
}

export function getRechargeRuleList (query) {
  return fetch({
    url: '/deposit/rechargerules',
    method: 'get',
    params: query
  })
}

export function deleteRechargeRuleById (id) {
  return fetch({
    url: '/deposit/rechargerule/' + id,
    method: 'delete'
  })
}

export function editRechargeRuleById (query) {
  return fetch({
    url: '/deposit/rechargerule',
    method: 'put',
    params: query
  })
}

export function setRechargeAgreement (query) {
  return fetch({
    url: '/deposit/recharge/agreement',
    method: 'post',
    params: query
  })
}

export function getRechargeAgreementByCompanyId () {
  return fetch({
    url: '/deposit/recharge/agreement',
    method: 'get'
  })
}

export function setRechargeMultiple (query) {
  return fetch({
    url: '/deposit/recharge/multiple',
    method: 'post',
    params: query
  })
}

export function getRechargeMultipleByCompanyId () {
  return fetch({
    url: '/deposit/recharge/multiple',
    method: 'get'
  })
}

export function getDepositTradeList (query) {
  return fetch({
    url: '/deposit/trades',
    method: 'get',
    params: query
  })
}

export function getDepositCountIndex () {
  return fetch({
    url: '/deposit/count/index',
    method: 'get'
  })
}
