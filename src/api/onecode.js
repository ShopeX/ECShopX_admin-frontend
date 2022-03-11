import fetch from '../utils/fetch'

// 物品
export function getThingsList (query) {
  return fetch({
    url: '/onecode/things',
    method: 'get',
    params: query
  })
}

export function getThingsDetail (thingId) {
  return fetch({
    url: '/onecode/things/' + thingId,
    method: 'get'
  })
}

export function createThings (query) {
  return fetch({
    url: '/onecode/things',
    method: 'post',
    params: query
  })
}

export function updateThings (thingId, query) {
  return fetch({
    url: '/onecode/things/' + thingId,
    method: 'put',
    params: query
  })
}

export function deleteThings (thingId) {
  return fetch({
    url: '/onecode/things/' + thingId,
    method: 'delete'
  })
}

// 批次
export function getBatchsList (query) {
  return fetch({
    url: '/onecode/batchs',
    method: 'get',
    params: query
  })
}

export function getBatchsDetail (batchId) {
  return fetch({
    url: '/onecode/batchs/' + batchId,
    method: 'get'
  })
}

export function createBatchs (query) {
  return fetch({
    url: '/onecode/batchs',
    method: 'post',
    params: query
  })
}

export function updateBatchs (batchId, query) {
  return fetch({
    url: '/onecode/batchs/' + batchId,
    method: 'put',
    params: query
  })
}

export function deleteBatchs (batchId) {
  return fetch({
    url: '/onecode/batchs/' + batchId,
    method: 'delete'
  })
}

export function getWxaOneCodeStream (query) {
  return fetch({
    url: '/onecode/wxaOneCodeStream',
    method: 'get',
    params: query
  })
}
