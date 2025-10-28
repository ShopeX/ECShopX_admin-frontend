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

import axios from 'axios'
import { merge, bindMethods } from '@/utils'
import { InterceptorManager } from './interceptor'

class RequestClient {
  constructor(options = {}) {
    // 合并配置
    const defaultConfig = {
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      timeout: 30000
    }
    const { ...axiosConfig } = options
    const requestConfig = {
      ...defaultConfig,
      ...axiosConfig
    }
    this.instance = axios.create(requestConfig)

    // bindMethods(this)

    // 实例化拦截器管理
    const interceptorManager = new InterceptorManager(this.instance)
    this.addRequestInterceptor = interceptorManager.addRequestInterceptor.bind(interceptorManager)
    this.addResponseInterceptor = interceptorManager.addResponseInterceptor.bind(interceptorManager)
  }

  get(url, data, config) {
    return this.request(url, { ...config, method: 'GET', data })
  }

  post(url, data, config) {
    return this.request(url, { ...config, method: 'POST', data })
  }

  put(url, data, config) {
    return this.request(url, { ...config, method: 'PUT', data })
  }

  delete(url, config) {
    return this.request(url, { ...config, method: 'DELETE' })
  }

  async request(url, config) {
    try {
      const lang = window.localStorage.getItem('lang')
      const langMap = {
        zhcn: 'zh-CN',
        en: 'en-CN',
        zhtw: 'zh-TW'
      }
      console.log('config', config, url)
      if (lang) {
        if (config.data) {
          config.data.country_code = langMap[lang]
        } else {
          config.data = {
            country_code: langMap[lang]
          }
        }
      }
      const response = await this.instance.request({
        url,
        ...config
      })
      return response
    } catch (error) {
      throw error.response ? error.response.data : error
    }
  }
}

export { RequestClient }
