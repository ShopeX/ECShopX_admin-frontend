import fetch from '../utils/fetch'

// 美洽配置
export function getPrinterInfo (query) {
  return fetch({
    url: '/espier/printer',
    method: 'get',
    params: query
  })
}

export function savePrinter (params) {
  return fetch({
    url: '/espier/printer',
    method: 'post',
    params: params
  })
}

export function getPrinterShopList (query) {
  return fetch({
    url: '/espier/printer/shop',
    method: 'get',
    params: query
  })
}

export function createPrinter (params) {
  return fetch({
    url: '/espier/printer/shop',
    method: 'post',
    params: params
  })
}

export function updatePrinter (id, params) {
  return fetch({
    url: '/espier/printer/shop/' + id,
    method: 'put',
    params: params
  })
}

export function deletePrinter (id) {
  return fetch({
    url: '/espier/printer/shop/' + id,
    method: 'delete'
  })
}
