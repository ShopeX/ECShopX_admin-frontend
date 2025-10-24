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

const defaultRequestInterceptorConfig = {
  fulfilled: (config) => config,
  rejected: (error) => Promise.reject(error)
}

const defaultResponseInterceptorConfig = {
  fulfilled: (response) => response,
  rejected: (error) => Promise.reject(error)
}

class InterceptorManager {
  constructor(instance) {
    this.axiosInstance = instance
  }

  addRequestInterceptor({ fulfilled, rejected } = defaultRequestInterceptorConfig) {
    this.axiosInstance.interceptors.request.use(fulfilled, rejected)
  }

  addResponseInterceptor({ fulfilled, rejected } = defaultResponseInterceptorConfig) {
    this.axiosInstance.interceptors.response.use(fulfilled, rejected)
  }
}

export { InterceptorManager }
