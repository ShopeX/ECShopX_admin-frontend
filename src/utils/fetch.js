import axios from 'axios'
import Vue from 'vue'
import qs from 'qs'
import store from '../store'
import Router from '../router'
import { isInSalesCenter, goLink, isInMerchant, isObject } from '@/utils'

function resolveGetMethod(inst) {
  const origGetMethod = inst.get
  inst.get = function (url, _params, config = {}) {
    // 兼容finder params
    if (_params) {
      const { params } = _params
      if (params && params.finderId) {
        config = {
          ..._params,
          ...config
        }
      } else {
        config = {
          params: _params,
          ...config
        }
      }
    }
    return origGetMethod(url, config)
  }
}

export function errorToast(data) {
  console.log(data, 'toast数据')

  const { status_code, message } = data
  if (status_code == 40101) {
    Vue.prototype.$message.error('账号密码错误，请重新登录')
  } else if (status_code == 401) {
    // Token has expired
    if (isInSalesCenter()) {
      goLink()
    }
    // Vue.prototype.$message.error( '登录信息已过期，请重新登录' )
    store.commit('CLEAR_TOKEN')
    // Router.push( { path: '/auth/login', replace: true } )
    // 如果是商家入驻
    if (isInMerchant()) {
      window.location.href = '/merchant'
    } else {
      window.location.href = '/'
    }
  } else {
    Vue.prototype.$message.error(message)
  }
}

function createAxios(inst, isJson = true) {
  inst = inst || axios.create()
  inst.defaults.timeout = process.env.NODE_ENV === 'production' ? 30000 : 30 * 1000
  inst.defaults.baseURL = inst.defaults.baseURL || process.env.VUE_APP_BASE_API || '/'
  inst.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
  inst.interceptors.request.use((config) => {
    const isGetMethod = config.method === 'get'
    const isPutMethod = config.method === 'put'
    const isDeleteMethod = config.method === 'delete'
    const showError = config.showError === undefined ? true : config.showError
    config.headers['Authorization'] = 'Bearer ' + store.getters.token
    if (isGetMethod || isDeleteMethod) {
      if (isObject(config.params)) {
        let params = {}
        Object.keys(config.params).forEach((key) => {
          if (config.params[key] !== '') {
            params[key] = config.params[key]
          }
        })
        config.params = params
      } else {
        config.params = {
          ...config.params
        }
      }
    } else {
      console.log('xxx')
      if (isJson) {
        const { params } = config
        if (params) {
          const { isUploadFile } = params
          if (isUploadFile) {
            let formParams = new FormData()
            for (var key in config.params) {
              if (key !== 'isUploadFile') {
                formParams.append(key, config.params[key])
              }
            }
            config.data = formParams
            delete config.params
          } else {
            config.data = qs.stringify(config.params)
            delete config.params
          }
        }
      }
    }
    config.showError = showError
    return config
  })

  // 是否正在刷新的标记
  let isRefreshing = false
  // 重试队列，每一项将是一个待执行的函数形式
  let requests = []
  inst.interceptors.response.use(
    (res) => {
      const {
        data,
        status,
        config: { showError }
      } = res
      if (status >= 200 && status < 300) {
        const resData = data.data
        if (!resData) {
          return
        }
        const { status_code } = resData
        if (status_code) {
          if (status_code == 40103) {
            // token过期，刷新token，重新请求接口
            const config = res.config
            if (!isRefreshing) {
              isRefreshing = true
              return refresh()
                .then((data) => {
                  const { token } = data
                  store.dispatch('setToken', { token })
                  config.headers['Authorization'] = 'Bearer ' + token
                  // 已经刷新了token，将所有队列中的请求进行重试
                  requests.forEach((cb) => cb(token))
                  // 重试完了清空这个队列
                  requests = []
                  return inst(config)
                })
                .catch(() => {
                  Router.push({ path: '/auth/login', replace: true })
                })
                .finally(() => {
                  isRefreshing = false
                })
            } else {
              // 正在刷新token，返回一个未执行resolve的promise
              return new Promise((resolve) => {
                // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
                requests.push((token) => {
                  store.dispatch('setToken', { token })
                  config.headers['Authorization'] = 'Bearer ' + token
                  resolve(inst(config))
                })
              })
            }
          } else {
            errorToast(resData)
          }
        } else {
          return res
        }
      }
      return Promise.reject(res)
    },

    (err) => {
      //
      console.log('req-err', err)
      err.response && errorToast(err.response.data.data)
      return Promise.reject(err)
    }
  )

  resolveGetMethod(inst)
  return inst
}

export default createAxios()

export { createAxios, axios }
