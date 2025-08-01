import Vue from 'vue'
import store from '@/store'
import { RequestClient } from './request'

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

      return config
    }
  })

  client.addResponseInterceptor({
    fulfilled: (response) => {
      const { data: responseData, status } = response
      const {
        data: { status_code, message }
      } = responseData
      if (status >= 200 && status < 400 && typeof status_code === 'undefined') {
        return responseData.data
      }
      throw Object.assign({}, response, { response })
    }
  })

  client.addResponseInterceptor({
    fulfilled: (response) => {
      return response
    },
    rejected: (error) => {
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

      let errorMessage = ''
      const status = error?.response?.status

      switch (status) {
        case 401:
          errorMessage = '登录认证过期，请重新登录后继续'
          break
      }

      const responseData = error?.response?.data ?? {}

      Vue.prototype.$message.error(
        (responseData?.data?.error ?? responseData?.data?.message ?? '') || errorMessage
      )

      // return Promise.reject(error)
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
