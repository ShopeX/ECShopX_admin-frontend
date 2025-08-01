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
