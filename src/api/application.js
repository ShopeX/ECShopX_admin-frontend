import fetch from '../utils/fetch'

export function adapayIsOpen () {
  return fetch({
    url: '/adapay/is_open',
    method: 'get'
  })
}
