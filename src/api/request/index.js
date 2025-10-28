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

import Vue from 'vue'
import store from '@/store'
import router from '@/router'
import { isObject } from '@/utils'
import { langMap } from '@/i18n'
import { RequestClient } from './request'

// 请求队列
let requestQueue = []
// 是否正在刷新token
let isRefreshing = false
// 刷新token的请求Promise
let refreshTokenPromise = null

// 刷新token的方法
async function refreshToken() {
  try {
    const oldToken = store.getters.token
    // 调用刷新token的接口
    const response = await requestClient.post('/auth/refresh', {
      refresh_token: oldToken
    })
    // 更新store中的token
    store.commit('user/setToken', { token: response.token })
    return response.token
  } catch (error) {
    // 刷新token失败，清除token并跳转登录页
    store.commit('user/setToken', { token: '' })
    router.push('/login')
    return Promise.reject(error)
  }
}

// 处理请求队列
function handleRequestQueue(token) {
  requestQueue.forEach((callback) => {
    callback(token)
  })
  requestQueue = []
}

function createRequestClient() {
  const client = new RequestClient({
    baseURL: process.env.VUE_APP_BASE_API
  })

  client.addRequestInterceptor({
    fulfilled: async (config) => {
      const token = store.getters.token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      // 多语言处理
      const lang = window.localStorage.getItem('lang')
      if (lang) {
        config.headers['Accept-Language'] = langMap[lang]
      }

      if (config.method === 'get') {
        config.params = {
          ...config.params,
          ...config.data
        }
        const params = {}
        Object.keys(config.params).forEach((key) => {
          if (config.params[key] !== '') {
            params[key] = config.params[key]
          }
        })
        config.params = params
        delete config.data
      }

      return config
    }
  })

  client.addResponseInterceptor({
    fulfilled: (response) => {
      const { data: responseData, status } = response
      const {
        data: { status_code, message }
      } = isObject(responseData) ? responseData : { data: {} }
      if (status >= 200 && status < 400 && typeof status_code === 'undefined') {
        return response
      }
      throw Object.assign({}, response, { response })
    }
  })

  client.addResponseInterceptor({
    fulfilled: (response) => {
      return response
    },
    rejected: async (error) => {
      const err = error?.toString?.() ?? ''
      let errMsg = ''
      if (err?.includes('Network Error')) {
        errMsg = '网络异常，请检查您的网络连接后重试'
      } else if (error?.message?.includes?.('timeout')) {
        errMsg = '请求超时，请稍后再试'
      }

      if (errMsg) {
        Vue.prototype.$message.error(errMsg, error)
        return Promise.reject(error)
      }

      const status = error?.response?.status
      const config = error.config

      // 处理401错误
      if (status === 401) {
        if (!isRefreshing) {
          isRefreshing = true
          // 创建刷新token的Promise
          refreshTokenPromise = refreshToken()
        }

        // 将请求添加到队列
        return new Promise((resolve, reject) => {
          requestQueue.push((token) => {
            // 更新请求头中的token
            config.headers.Authorization = `Bearer ${token}`
            // 重新发起请求
            resolve(requestClient.request(config))
          })
        })
          .then(() => {
            // 刷新token成功后，处理队列中的请求
            refreshTokenPromise.then((token) => {
              handleRequestQueue(token)
              isRefreshing = false
              refreshTokenPromise = null
            })
          })
          .catch((error) => {
            // 刷新token失败，清空队列
            requestQueue = []
            isRefreshing = false
            refreshTokenPromise = null
            return Promise.reject(error)
          })
      }
      const responseData = error?.response?.data ?? {}
      Vue.prototype.$message.error(
        (responseData?.data?.error ?? responseData?.data?.message ?? '') || '请求失败'
      )
      return Promise.reject(error)
    }
  })
  return client
}

const requestClient = createRequestClient()

const fetch = ({ url, method, params }) => {
  return requestClient.request(url, {
    method,
    data: params
  })
}

export { requestClient, fetch }
