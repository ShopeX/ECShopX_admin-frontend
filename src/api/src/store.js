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
