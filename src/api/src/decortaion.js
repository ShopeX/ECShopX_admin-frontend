import { requestClient } from './../request'

/**
 * 获取自定义页面信息
 * @param {string} id - 自定义页面ID
 * @returns {Promise} 请求结果
 */
export const fetchCustomPageInfo = (id) => {
  return requestClient.get(`/wxa/customizepage/${id}`)
}
