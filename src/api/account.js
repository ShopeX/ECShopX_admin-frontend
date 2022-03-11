import fetch from '../utils/fetch'
export function get_DD_Account () {
  return fetch({
    url: '/dada/finance/info',
    method: 'get'
  })
}

export function getRechargeURL (amount) {
  return fetch({
    url: '/dada/finance/create',
    method: 'post',
    params: amount
  })
}
