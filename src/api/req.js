import axios from 'axios'
import Vue from 'vue'
import store from '@/store'
import Router from '@/router/index'
// import S from '@/spx'
import { refreshToken } from '@/api/auth'

function reqErr(res, msg = '') {
  const { data } = res.data || {}
  msg = data.msg || data.err_msg || msg
  const err = new Error(msg)
  err.res = res

  return err
}

function resolveGetMethod(inst) {
  const origGetMethod = inst.get

  inst.get = function (url, params, config = {}) {
    config = {
      params,
      ...config
    }
    return origGetMethod(url, config)
  }
}

function errorToast(data) {
  const { status_code, errcode, errmsg, message } = data
  const err = message || errmsg
  const code = status_code || errcode
  //Token has expired
  if (err == 'Token has expired') {
    Vue.prototype.$message({
      message: '当前页面已过期',
      type: 'error',
      onClose: async () => {
        Router.push({ path: '/auth/login', replace: true })
        // window.location.href = `${window.location.origin}/#/auth/login`
        // const data = await refresh()
        // this.setToken({ token: data.token })
        // window.refresh()
      }
    })
  } else if (err == 'The token has been blacklisted') {
    Router.push({ path: '/auth/login', replace: true })
  } else {
    Vue.prototype.$message.error(err)
  }
}

function createAxios(inst) {
  inst = inst || axios.create()
  inst.defaults.timeout = process.env.NODE_ENV === 'production' ? 10000 : 30 * 1000
  inst.defaults.baseURL = process.env.VUE_APP_BASE_API || '/'
  inst.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

  inst.interceptors.request.use(async (config) => {
    // await refreshToken()

    const isGetMethod = config.method === 'get'
    const showError = config.showError === undefined ? true : config.showError
    config.headers['Authorization'] = 'Bearer ' + store.getters.token
    if (isGetMethod) {
      config.params = {
        ...config.params,
        ...config.data
      }
    } else {
      config.data = {
        ...config.data
      }
    }

    config.showError = showError
    // config.transformRequest = [
    //   function (data, headers) {
    //     return qs.stringify(data)
    //   }
    // ]

    return config
  })

  inst.interceptors.response.use(
    (res) => {
      const {
        data,
        status,
        config: { showError }
      } = res
      if (status === 200) {

        console.log('data',data.data)
        if (data.data) {
          console.log('data',data.data)
          if(data.data.status_code){
            if (showError) {
              errorToast(data.data)
            }
            return Promise.reject(data)
          }
          return data.data
        } else {
          if (showError) {
            errorToast(data)
          }
          return Promise.reject(data)
        }
      }
      return Promise.reject(reqErr(res))
    },
    (err) => {
      //
      errorToast(err.response.data.error)
      return Promise.reject(err)
    }
  )

  resolveGetMethod(inst)
  return inst
}

export default createAxios()

export { createAxios, axios }
