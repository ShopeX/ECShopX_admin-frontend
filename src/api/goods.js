// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统 
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn 
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------

import { fetch } from './request'

// 基础物料
export function getServiceLabelsList(query) {
  return fetch({
    url: '/goods/servicelabels',
    method: 'get',
    params: query
  })
}

export function getServiceLabelsDetail(labelId) {
  return fetch({
    url: '/goods/servicelabels/' + labelId,
    method: 'get'
  })
}

export function createServiceLabels(query) {
  return fetch({
    url: '/goods/servicelabels',
    method: 'post',
    params: query
  })
}

export function updateServiceLabels(labelId, query) {
  return fetch({
    url: '/goods/servicelabels/' + labelId,
    method: 'put',
    params: query
  })
}

export function deleteServiceLabels(labelId) {
  return fetch({
    url: '/goods/servicelabels/' + labelId,
    method: 'delete'
  })
}

// 商品类型
export function getItemsTypeList(query) {
  return fetch({
    url: '/goods/itemstype',
    method: 'get',
    params: query
  })
}

export function setCommissionRatio(query) {
  return fetch({
    url: '/goods/set_commission_ratio',
    method: 'post',
    params: query
  })
}

export function getItemsTypeDetail(typeId) {
  return fetch({
    url: '/goods/itemstype/' + typeId,
    method: 'get'
  })
}

export function getItemsTypeLabelsDetail(typeId) {
  return fetch({
    url: '/goods/itemstypelabels/' + typeId,
    method: 'get'
  })
}

export function createItemsType(query) {
  return fetch({
    url: '/goods/itemstype',
    method: 'post',
    params: query
  })
}

export function updateItemsType(typeId, query) {
  return fetch({
    url: '/goods/itemstype/' + typeId,
    method: 'put',
    params: query
  })
}

export function deleteItemsType(typeId) {
  return fetch({
    url: '/goods/itemstype/' + typeId,
    method: 'delete'
  })
}

// 商品
export function getItemsList(query) {
  return fetch({
    url: '/goods/items',
    method: 'get',
    params: {
      ...query,
      distributor_id: !query.distributor_id ? 0 : query.distributor_id
    }
  })
}
// 商品
export function getItemsListAll(query) {
  return fetch({
    url: '/goods/items',
    method: 'get',
    params: {
      ...query
      // distributor_id: !query.distributor_id ? 0 : query.distributor_id
    }
  })
}

// 商品
export function getDrawItemsList(query) {
  return fetch({
    url: '/goods/items',
    method: 'get',
    params: query
  })
}

export function getSkuList(query) {
  return fetch({
    url: '/goods/sku',
    method: 'get',
    params: query
  })
}

export function getItemsDetail(itemId, params) {
  return fetch({
    url: '/goods/items/' + itemId,
    method: 'get',
    params
  })
}

export function createItems(query) {
  return fetch({
    url: '/goods/items',
    method: 'post',
    params: query,
    refreshToken: true
  })
}

export function updateItems(itemId, query) {
  return fetch({
    url: '/goods/items/' + itemId,
    method: 'put',
    params: query,
    refreshToken: true
  })
}

export function setItemsTemplate(params) {
  return fetch({
    url: '/goods/setItemsTemplate',
    method: 'post',
    params: params
  })
}

export function setItemsSort(params) {
  return fetch({
    url: '/goods/setItemsSort',
    method: 'post',
    params: params
  })
}

export function setItemsCategory(params) {
  return fetch({
    url: '/goods/setItemsCategory',
    method: 'post',
    params: params
  })
}

export function deleteItems(itemId) {
  return fetch({
    url: '/goods/items/' + itemId,
    method: 'delete'
  })
}

export function getDistributionGoodsWxaCode(query) {
  return fetch({
    url: '/goods/distributionGoodsWxaCodeStream',
    method: 'get',
    params: query
  })
}

export function getItemWarningStore(query) {
  return fetch({
    url: '/goods/warning_store',
    method: 'post',
    params: query
  })
}

export function getCategory(params) {
  return fetch({
    url: '/goods/category',
    method: 'get',
    params
  })
}

export function getItemParams(params) {
  return fetch({
    url: '/goods/items/params',
    method: 'post',
    params
  })
}

export function addCategory(params) {
  return fetch({
    url: '/goods/createcategory',
    method: 'post',
    params: params
  })
}

export function editCategory(params) {
  return fetch({
    url: '/goods/category/' + params.category_id,
    method: 'put',
    params: params
  })
}

export function saveCategory(params) {
  return fetch({
    url: '/goods/category',
    method: 'post',
    params: params
  })
}

export function deleteCategory(category_id) {
  return fetch({
    url: '/goods/category/' + category_id,
    method: 'delete'
  })
}

export function updateCategory(category_id, query) {
  return fetch({
    url: '/goods/category/' + category_id,
    method: 'put',
    params: query
  })
}

export function getCategoryInfo(category_id) {
  return fetch({
    url: '/goods/category/' + category_id,
    method: 'get'
  })
}

export function getGoodsAttr(query) {
  return fetch({
    url: '/goods/attributes',
    method: 'get',
    params: query
  })
}

export function addGoodsAttr(query) {
  return fetch({
    url: '/goods/attributes',
    method: 'post',
    params: query
  })
}

export function updateGoodsAttr(attributes_id, query) {
  return fetch({
    url: '/goods/attributes/' + attributes_id,
    method: 'put',
    params: query
  })
}

export function deleteGoodsAttr(attributes_id) {
  return fetch({
    url: '/goods/attributes/' + attributes_id,
    method: 'delete'
  })
}

export function updateGoodsInfo(query) {
  return fetch({
    url: '/goods/itemsupdate',
    method: 'put',
    params: query
  })
}

export function getGoodsPrice(id) {
  return fetch({
    url: '/goods/memberprice/' + id,
    method: 'get'
  })
}

export function getGoodsProfitPrice(id) {
  return fetch({
    url: '/goods/profit/' + id,
    method: 'get'
  })
}

export function saveGoodsProfitPrice(params) {
  return fetch({
    url: '/goods/profit/save',
    method: 'post',
    params: params
  })
}

export function saveCategoryProfitPrice(params) {
  return fetch({
    url: '/goods/category/profit/save',
    method: 'post',
    params: params
  })
}

export function updateGoodsPrice(query) {
  return fetch({
    url: '/goods/memberprice/save',
    method: 'post',
    params: query
  })
}

export function updateItemRebateConf(query) {
  return fetch({
    url: '/goods/rebateconf',
    method: 'post',
    params: query
  })
}

export function saveTag(query) {
  return fetch({
    url: '/goods/tag',
    method: 'post',
    params: query
  })
}

export function getTagList(query) {
  return fetch({
    url: '/goods/tag',
    method: 'get',
    params: query
  })
}

export function getTagInfo(tagId) {
  return fetch({
    url: '/goods/tag/' + tagId,
    method: 'get'
  })
}

export function updateTag(query) {
  return fetch({
    url: '/goods/tag',
    method: 'put',
    params: query
  })
}

export function deleteTag(tagId) {
  return fetch({
    url: '/goods/tag/' + tagId,
    method: 'delete'
  })
}

export function itemsRelTags(query) {
  return fetch({
    url: '/goods/reltag',
    method: 'post',
    params: query
  })
}

export function tagSearchItem(query) {
  return fetch({
    url: '/goods/tagsearch',
    method: 'GET',
    params: query
  })
}

export function setHotKeywords(query) {
  return fetch({
    url: '/goods/hotkeywords',
    method: 'post',
    params: query
  })
}

export function getHotKeywords() {
  return fetch({
    url: '/goods/hotkeywords',
    method: 'get'
  })
}

export function updateItemsStore(query) {
  return fetch({
    url: '/goods/itemstoreupdate',
    method: 'put',
    params: query
  })
}

export function updateItemsStatus(query) {
  return fetch({
    url: '/goods/itemstatusupdate',
    method: 'put',
    params: query
  })
}

export function auditItems(query) {
  return fetch({
    url: '/goods/audit/items',
    method: 'put',
    params: query
  })
}

export function getGoodsExport(query) {
  return fetch({
    url: '/goods/export',
    method: 'get',
    params: query
  })
}

export function exportItemsData(data) {
  return fetch({
    url: '/goods/export',
    method: 'post',
    params: data
  })
}

export function exportItemsTagData(data) {
  return fetch({
    url: '/goods/tag/export',
    method: 'post',
    params: data
  })
}

export function syncItems() {
  return fetch({
    url: '/goods/sync/items',
    method: 'post'
  })
}

export function syncMainCategory() {
  return fetch({
    url: '/goods/sync/itemCategory',
    method: 'post'
  })
}

export function syncItemSpec() {
  return fetch({
    url: '/goods/sync/itemSpec',
    method: 'post'
  })
}

export function syncBrand() {
  return fetch({
    url: '/goods/sync/brand',
    method: 'post'
  })
}

export function saveIsGifts(query) {
  return fetch({
    url: '/goods/itemsisgiftupdate',
    method: 'put',
    params: query
  })
}

// 获取商品分享设置
export function getShareSetting(query) {
  return fetch({
    url: '/itemshare/setting',
    method: 'get',
    params: query
  })
}

// 保存商品分享设置
export function saveShareSetting(query) {
  return fetch({
    url: '/itemshare/setting',
    method: 'post',
    params: query
  })
}

// 导出小程序太阳码/h5二维码
export function exportGoodsCode(params) {
  return fetch({
    url: '/goods/code/export',
    method: 'post',
    params
  })
}

// 选品商品
export function getSelectItemsList(query) {
  return fetch({
    url: '/goods/selectItems',
    method: 'get',
    params: query
  })
}
// 确定选品商品
export function flowItems(query) {
  return fetch({
    url: '/goods/flowItems',
    method: 'post',
    params: query
  })
}

// 获取商品佣金配置
export function getGoodsCommission(id) {
  return fetch({
    url: 'goods/commission/' + id,
    method: 'get'
  })
}
// 保存商品佣金配置
export function saveGoodsCommission(query) {
  return fetch({
    url: '/goods/commission/save',
    method: 'post',
    params: query
  })
}

// 自定义分类开关
export function getCategoryPageSetting(query) {
  return fetch({
    url: '/categoryPage/setting',
    method: 'get',
    params: query
  })
}

// 自定义分类开关
export function postCategoryPageSetting(query) {
  return fetch({
    url: '/categoryPage/setting',
    method: 'post',
    params: query
  })
}

//批量审核供应商商品
export function batchReviewItems(query) {
  return fetch({
    url: '/supplier/batch_review_items',
    method: 'post',
    params: query
  })
}

export function uploadWdtErpItems(data) {
  return fetch({
    url: '/goods/upload/wdterp/items',
    method: 'post',
    data
  })
}

// 上传商品到聚水潭
export function uploadJstErpItems(data) {
  return fetch({
    url: '/goods/upload/items',
    method: 'post',
    data
  })
}

// 同步聚水潭商品库存
export function queryInventory(data) {
  return fetch({
    url: '/goods/query/inventory',
    method: 'post',
    data
  })
}

export function medicineItemsSync(data) {
  return fetch({
    url: '/goods/medicineItems/sync',
    method: 'post',
    data
  })
}
