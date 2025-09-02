import { requestClient } from '../request'

export function getShopsProtocol(query) {
  return requestClient.get('/shops/protocol', query)
}

export function updateShopsProtocol(query) {
  return requestClient.put('/shops/protocol', query)
}
