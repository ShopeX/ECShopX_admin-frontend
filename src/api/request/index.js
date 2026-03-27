/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import qs from 'qs'
import Vue from 'vue'
import store from '@/store'
import router from '@/router'
import { isObject, getBasePath } from '@/utils'
import { langMap, i18n } from '@/i18n'
import { RequestClient } from './request'

// 请求队列
let requestQueue = []
// 是否正在刷新token
let isRefreshing = false
// 刷新token的请求Promise
let refreshTokenPromise = null
// 是否正在跳转到登录页
let isRedirectingToLogin = false

// 刷新token的方法
async function refreshToken() {
  try {
    const oldToken = store.getters.token
    // 调用刷新token的接口
    const response = await requestClient.get(
      '/token/refresh',
      {},
      {
        params: {
          refresh_token: oldToken
        }
      }
    )
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
      } else {
        // 处理文件上传
        if (config.data && config.data.isUploadFile) {
          const formData = new FormData()
          Object.keys(config.data).forEach((key) => {
            if (key !== 'isUploadFile') {
              formData.append(key, config.data[key])
            }
          })
          config.data = formData
          // FormData 会自动设置 Content-Type，不需要手动设置
          delete config.headers['Content-Type']
        } else if (
          config.headers &&
          config.headers['Content-Type'] === 'application/x-www-form-urlencoded' &&
          typeof config.data === 'object' &&
          config.data !== null
        ) {
          // 声明为表单时若 data 仍是对象，则序列化为 form-urlencoded，避免后端解析失败
          config.data = qs.stringify(config.data)
        }
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
      const config = error?.config || error?.response?.config
      const showError = config?.showError !== false

      const err = error?.toString?.() ?? ''
      let errMsg = ''
      if (err?.includes('Network Error')) {
        errMsg = i18n.t('1f7b7edc.db63d0')
      } else if (error?.message?.includes?.('timeout')) {
        errMsg = i18n.t('1f7b7edc.de9296')
      }

      if (errMsg) {
        if (showError) {
          Vue.prototype.$message.error(errMsg, error)
        }
        return Promise.reject(error)
      }

      const status = error?.response?.status

      // 处理401错误
      if (status === 401) {
        // 根据当前路由路径判断basePath，而不是从URL获取
        const currentPath = router.currentRoute.path
        const pathMatch = currentPath.match(/^\/(shopadmin|supplier|merchant)(\/.*)?$/)
        const basePath = pathMatch ? pathMatch[1] : null
        const loginPath = basePath ? `/${basePath}/login` : '/login'

        // 避免重复跳转 - 使用全局标志
        if (!isRedirectingToLogin && router.currentRoute.path !== loginPath) {
          isRedirectingToLogin = true
          console.log(
            '401跳转 - basePath:',
            basePath,
            'currentPath:',
            currentPath,
            'loginPath:',
            loginPath
          )

          // 先提示token过期
          Vue.prototype.$message({
            message: i18n.t('1f7b7edc.3925e5'),
            type: 'warning',
            duration: 2000
          })

          // 清除token
          store.commit('user/logout')
          store.commit('system/logout')

          // 2秒后跳转到登录页
          setTimeout(() => {
            router
              .replace(loginPath)
              .catch((err) => {
                // 忽略导航重复错误
                if (err.name !== 'NavigationDuplicated') {
                  console.error('路由跳转错误:', err)
                }
              })
              .finally(() => {
                // 跳转完成后重置标志
                setTimeout(() => {
                  isRedirectingToLogin = false
                }, 1000)
              })
          }, 2000)
        }
        // 401错误直接返回，不继续执行后面的错误处理
        return Promise.reject(error)
      }

      // 注释掉的刷新token逻辑
      // if (!isRefreshing) {
      //   isRefreshing = true
      //   // 创建刷新token的Promise
      //   refreshTokenPromise = refreshToken()
      // }

      // // 将请求添加到队列
      // return new Promise((resolve, reject) => {
      //   requestQueue.push((token) => {
      //     // 更新请求头中的token
      //     config.headers.Authorization = `Bearer ${token}`
      //     // 重新发起请求
      //     resolve(requestClient.request(config))
      //   })
      // })
      //   .then(() => {
      //     // 刷新token成功后，处理队列中的请求
      //     refreshTokenPromise.then((token) => {
      //       handleRequestQueue(token)
      //       isRefreshing = false
      //       refreshTokenPromise = null
      //     })
      //   })
      //   .catch((error) => {
      //     // 刷新token失败，清空队列
      //     requestQueue = []
      //     isRefreshing = false
      //     refreshTokenPromise = null
      //     return Promise.reject(error)
      //   })
      // 处理其他错误（可由单请求 showError: false 关闭默认 toast，由业务自行提示）
      if (!showError) {
        return Promise.reject(error)
      }
      const responseData = error?.response?.data ?? {}
      Vue.prototype.$message.error(
        (responseData?.data?.error ?? responseData?.data?.message ?? '') ||
          i18n.t('1f7b7edc.f50bf4')
      )
      return Promise.reject(error)
    }
  })
  return client
}

const requestClient = createRequestClient()

const fetch = ({ url, method, params, skipCountryCode, ...rest }) => {
  // 如果 params 中包含 isUploadFile，需要特殊处理
  const requestConfig = {
    method,
    data: params,
    ...(skipCountryCode !== undefined && { skipCountryCode }),
    ...rest
  }
  return requestClient.request(url, requestConfig)
}

export { requestClient, fetch }
