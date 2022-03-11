import fetch from '../utils/fetch'

// 基础物料
export function getServiceLabelsList (query) {
  return fetch({
    url: '/pointsmall/goods/servicelabels',
    method: 'get',
    params: query
  })
}

export function getServiceLabelsDetail (labelId) {
  return fetch({
    url: '/pointsmall/goods/servicelabels/' + labelId,
    method: 'get'
  })
}

export function createServiceLabels (query) {
  return fetch({
    url: '/pointsmall/goods/servicelabels',
    method: 'post',
    params: query
  })
}

export function updateServiceLabels (labelId, query) {
  return fetch({
    url: '/pointsmall/goods/servicelabels/' + labelId,
    method: 'put',
    params: query
  })
}

export function deleteServiceLabels (labelId) {
  return fetch({
    url: '/pointsmall/goods/servicelabels/' + labelId,
    method: 'delete'
  })
}

// 商品类型
export function getItemsTypeList (query) {
  return fetch({
    url: '/pointsmall/goods/itemstype',
    method: 'get',
    params: query
  })
}

export function getItemsTypeDetail (typeId) {
  return fetch({
    url: '/pointsmall/goods/itemstype/' + typeId,
    method: 'get'
  })
}

export function getItemsTypeLabelsDetail (typeId) {
  return fetch({
    url: '/pointsmall/goods/itemstypelabels/' + typeId,
    method: 'get'
  })
}

export function createItemsType (query) {
  return fetch({
    url: '/pointsmall/goods/itemstype',
    method: 'post',
    params: query
  })
}

export function updateItemsType (typeId, query) {
  return fetch({
    url: '/pointsmall/goods/itemstype/' + typeId,
    method: 'put',
    params: query
  })
}

export function deleteItemsType (typeId) {
  return fetch({
    url: '/pointsmall/goods/itemstype/' + typeId,
    method: 'delete'
  })
}

// 商品
export function getItemsList (query) {
  return fetch({
    url: '/pointsmall/goods/items',
    method: 'get',
    params: query
  })
}

export function getSkuList (query) {
  return fetch({
    url: '/pointsmall/goods/sku',
    method: 'get',
    params: query
  })
}

export function getItemsDetail (itemId) {
  return fetch({
    url: '/pointsmall/goods/items/' + itemId,
    method: 'get'
  })
}

export function createItems (query) {
  return fetch({
    url: '/pointsmall/goods/items',
    method: 'post',
    params: query,
    refreshToken: true
  })
}

export function updateItems (itemId, query) {
  return fetch({
    url: '/pointsmall/goods/items/' + itemId,
    method: 'put',
    params: query,
    refreshToken: true
  })
}

export function setItemsTemplate (params) {
  return fetch({
    url: '/pointsmall/goods/setItemsTemplate',
    method: 'post',
    params: params
  })
}

export function setItemsSort (params) {
  return fetch({
    url: '/pointsmall/goods/setItemsSort',
    method: 'post',
    params: params
  })
}

export function setItemsCategory (params) {
  return fetch({
    url: '/pointsmall/goods/setItemsCategory',
    method: 'post',
    params: params
  })
}

export function deleteItems (itemId) {
  return fetch({
    url: '/pointsmall/goods/items/' + itemId,
    method: 'delete'
  })
}

export function getDistributionGoodsWxaCode (query) {
  return fetch({
    url: '/pointsmall/goods/distributionGoodsWxaCodeStream',
    method: 'get',
    params: query
  })
}

export function getItemWarningStore (query) {
  return fetch({
    url: '/pointsmall/goods/warning_store',
    method: 'post',
    params: query
  })
}

export function getCategory (query) {
  return fetch({
    url: '/pointsmall/goods/category',
    method: 'get',
    params: query
  })
}

export function saveCategory (params) {
  return fetch({
    url: '/pointsmall/goods/category',
    method: 'post',
    params: params
  })
}

export function deleteCategory (category_id) {
  return fetch({
    url: '/pointsmall/goods/category/' + category_id,
    method: 'delete'
  })
}

export function updateCategory (category_id, query) {
  return fetch({
    url: '/pointsmall/goods/category/' + category_id,
    method: 'put',
    params: query
  })
}

export function getCategoryInfo (category_id) {
  return fetch({
    url: '/pointsmall/goods/category/' + category_id,
    method: 'get'
  })
}

export function getGoodsAttr (query) {
  return fetch({
    url: '/pointsmall/goods/attributes',
    method: 'get',
    params: query
  })
}

export function addGoodsAttr (query) {
  return fetch({
    url: '/pointsmall/goods/attributes',
    method: 'post',
    params: query
  })
}

export function updateGoodsAttr (attributes_id, query) {
  return fetch({
    url: '/pointsmall/goods/attributes/' + attributes_id,
    method: 'put',
    params: query
  })
}

export function deleteGoodsAttr (attributes_id) {
  return fetch({
    url: '/pointsmall/goods/attributes/' + attributes_id,
    method: 'delete'
  })
}

export function updateGoodsInfo (query) {
  return fetch({
    url: '/pointsmall/goods/itemsupdate',
    method: 'put',
    params: query
  })
}

export function getGoodsPrice (id) {
  return fetch({
    url: '/pointsmall/goods/memberprice/' + id,
    method: 'get'
  })
}

// export function getGoodsProfitPrice (id) {
//   return fetch({
//     url: '/pointsmall/goods/profit/' + id,
//     method: 'get'
//   })
// }

// export function saveGoodsProfitPrice (params) {
//   return fetch({
//     url: '/pointsmall/goods/profit/save',
//     method: 'post',
//     data: params
//   })
// }

// export function saveCategoryProfitPrice (params) {
//   return fetch({
//     url: '/pointsmall/goods/category/profit/save',
//     method: 'post',
//     data: params
//   })
// }

export function updateGoodsPrice (query) {
  return fetch({
    url: '/pointsmall/goods/memberprice/save',
    method: 'post',
    params: query
  })
}

// export function updateItemRebateConf(query) {
//   return fetch({
//     url: '/pointsmall/goods/rebateconf',
//     method: 'post',
//     data: query
//   })
// }

// export function saveTag (query) {
//   return fetch({
//     url: '/pointsmall/goods/tag',
//     method: 'post',
//     data: query
//   })
// }

// export function getTagList (query) {
//   return fetch({
//     url: '/pointsmall/goods/tag',
//     method: 'get',
//     params: query
//   })
// }

// export function getTagInfo (tagId) {
//   return fetch({
//     url: '/pointsmall/goods/tag/' + tagId,
//     method: 'get'
//   })
// }

export function updateTag (query) {
  return fetch({
    url: '/pointsmall/goods/tag',
    method: 'put',
    params: query
  })
}

export function deleteTag (tagId) {
  return fetch({
    url: '/pointsmall/goods/tag/' + tagId,
    method: 'delete'
  })
}

export function itemsRelTags (query) {
  return fetch({
    url: '/pointsmall/goods/reltag/',
    method: 'post',
    params: query
  })
}

export function tagSearchItem (query) {
  return fetch({
    url: '/pointsmall/goods/tagsearch',
    method: 'GET',
    params: query
  })
}

export function setHotKeywords (query) {
  return fetch({
    url: '/pointsmall/goods/hotkeywords',
    method: 'post',
    params: query
  })
}

export function getHotKeywords () {
  return fetch({
    url: '/pointsmall/goods/hotkeywords',
    method: 'get'
  })
}

export function updateItemsStore (query) {
  return fetch({
    url: '/pointsmall/goods/itemstoreupdate',
    method: 'put',
    params: query
  })
}

export function updateItemsStatus (query) {
  return fetch({
    url: '/pointsmall/goods/itemstatusupdate',
    method: 'put',
    params: query
  })
}

export function auditItems (query) {
  return fetch({
    url: '/pointsmall/goods/audit/items',
    method: 'put',
    params: query
  })
}

export function getGoodsExport (query) {
  return fetch({
    url: '/pointsmall/goods/export',
    method: 'get',
    params: query
  })
}

export function exportItemsData (data) {
  return fetch({
    url: '/pointsmall/goods/export',
    method: 'post',
    params: data
  })
}

export function getSetting () {
  return fetch({
    url: '/pointsmall/setting',
    method: 'get'
  })
}

export function saveSetting (data) {
  return fetch({
    url: '/pointsmall/setting',
    method: 'post',
    params: data
  })
}

export function getTemplateSetting () {
  return fetch({
    url: '/pointsmall/template/setting',
    method: 'get'
  })
}

export function saveTemplateSetting (data) {
  return fetch({
    url: '/pointsmall/template/setting',
    method: 'post',
    params: data
  })
}
