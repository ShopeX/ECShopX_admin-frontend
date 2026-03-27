/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { requestClient } from './../request'

/**
 * 获取店铺规则配置
 * @returns {Promise} 请求结果
 */
export const fetchEntryStoreRules = () => {
  return requestClient.get('/distributor/config/inRule')
}

/**
 * 保存店铺规则配置
 * @param {Object} params - 需要保存的店铺规则参数
 * @returns {Promise} 请求结果
 */
export const saveEntryStoreRules = (params) => {
  return requestClient.post('/distributor/config/inRule', params)
}

/**
 * 获取门店分类列表
 * @param {Object} params - 查询参数
 * @returns {Promise} 请求结果
 */
export const getStoreCategoryList = (params) => {
  return requestClient.get('/distributor/category', params)
}

/**
 * 创建门店分类
 * @param {Object} params - 分类数据
 * @returns {Promise} 请求结果
 */
export const createStoreCategory = (params) => {
  return requestClient.post('/distributor/category', params)
}

/**
 * 更新门店分类
 * @param {Number} id - 分类ID
 * @param {Object} params - 分类数据
 * @returns {Promise} 请求结果
 */
export const updateStoreCategory = (id, params) => {
  return requestClient.put(`/distributor/category/${id}`, params)
}

/**
 * 删除门店分类
 * @param {Number} id - 分类ID
 * @returns {Promise} 请求结果
 */
export const deleteStoreCategory = (id) => {
  return requestClient.delete(`/distributor/category/${id}`)
}

/**
 * 获取附近门店背景图
 * @returns {Promise} 请求结果
 */
export const getNearbyStoreBackground = () => {
  return requestClient.get('/distributor/list/background')
}

/**
 * 保存附近门店背景图
 * @param {Object} params - 背景图参数
 * @param {String} params.background_url - 背景图URL
 * @returns {Promise} 请求结果
 */
export const saveNearbyStoreBackground = (params) => {
  return requestClient.post('/distributor/list/background', params)
}
