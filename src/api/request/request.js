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

  get(url, config) {
    return this.request(url, { ...config, method: 'GET' })
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
