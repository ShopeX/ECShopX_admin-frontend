import fetch from '../utils/fetch'
export function getPcItemsList (query) {
  query.distributor_id = !query.distributor_id ? 0 : query.distributor_id
  return fetch({
    url: '/goods/items',
    method: 'get',
    params: query
  })
}
