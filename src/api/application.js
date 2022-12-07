import fetch from '../utils/fetch'

export function adapayIsOpen() {
  return fetch({
    url: '/adapay/is_open',
    method: 'get'
  })
}

export function list() {
  return fetch({
    url: '/company/applications',
    method: 'get'
  })
}
