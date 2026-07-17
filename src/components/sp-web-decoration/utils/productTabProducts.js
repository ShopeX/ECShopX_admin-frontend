import { fetch } from '@/api/request'

function normalizeProductSnapshot(product = {}) {
  return {
    item_id: product.item_id,
    item_name: product.item_name || '',
    pics: product.pics || [],
    price: product.price
  }
}

function unwrapProductList(response) {
  return response?.data?.data?.list || response?.data?.list || response?.list || []
}

export async function fetchProductTabProducts(productIds = []) {
  if (!productIds.length) return []

  const response = await fetch({
    url: '/goods/items',
    method: 'get',
    params: {
      item_id: productIds,
      item_type: 'normal',
      page: 1,
      pageSize: Math.max(50, productIds.length)
    },
    showError: false
  })

  return unwrapProductList(response).map((product) => normalizeProductSnapshot(product))
}

export function mergeProductTabProducts(productIds = [], latestProducts = [], snapshots = []) {
  const latestProductMap = new Map(
    latestProducts
      .filter((product) => product?.item_id)
      .map((product) => [String(product.item_id), product])
  )
  const snapshotMap = new Map(
    snapshots
      .filter((product) => product?.item_id)
      .map((product) => [String(product.item_id), product])
  )

  return productIds.map(
    (id) =>
      latestProductMap.get(String(id)) ||
      snapshotMap.get(String(id)) || { item_id: id, item_name: id }
  )
}

export default {
  fetchProductTabProducts,
  mergeProductTabProducts
}
