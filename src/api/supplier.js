import fetch from '../utils/fetch'

export function saveAgent (query) {
  return fetch({
    url: '/supplier/save_agent',
    method: 'post',
    params: query
  })
}

export function deleteAgent (query) {
  return fetch({
    url: '/supplier/delete_agent',
    method: 'post',
    params: query
  })
}

export function getAgentList (query) {
  return fetch({
    url: '/supplier/get_agent_list',
    method: 'get',
    params: query
  })
}

export function getSupplierShops (query) {
  return fetch({
    url: '/supplier/get_supplier_shops',
    method: 'get',
    params: query
  })
}

export function checkSupplierShop (query) {
  return fetch({
    url: '/supplier/check_supplier_shop',
    method: 'post',
    params: query
  })
}


export function getSupplierList (query) {
  return fetch({
    url: '/supplier/get_supplier_list',
    method: 'get',
    params: query
  })
}

export function checkSupplier (query) {
  return fetch({
    url: '/supplier/check_supplier',
    method: 'post',
    params: query
  })
}

export function getSupplierInfo (query) {
  return fetch({
    url: '/supplier/get_supplier_info',
    method: 'get'
  })
}

export function createSupplier (query) {
  return fetch({
    url: '/supplier/register',
    method: 'post',
    params: query
  })
}

export function getOrderList (query) {
  return fetch({
    url: '/supplier/get_order_list',
    method: 'get',
    params: query
  })
}

export function getAgentOrders (query) {
  return fetch({
    url: '/supplier/get_agent_orders',
    method: 'get',
    params: query
  })
}

export function orderPaidConfirm (query) {
  return fetch({
    url: '/supplier/order_paid_confirm',
    method: 'post',
    params: query
  })
}

