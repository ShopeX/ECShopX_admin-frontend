import axios from 'axios'
import { Message } from 'element-ui'
import store from '../store'
import errorMsg from './errorMsg.js'
import Qs from 'qs'
import NProgress from 'nprogress'
import router from '@/router/index'

// 创建axios实例
const service = axios.create({
  baseURL:
    process.env.VUE_APP_BASE_API.indexOf('http') !== -1
      ? process.env.VUE_APP_BASE_API
      : window.location.origin + '/api',
  timeout: 50000 // 请求超时时间
})

// console.log(process.env.VUE_APP_INSET, 'process.env.VUE_APP_INSET')
// // 获取父组件传值，并保存
// if (process.env.VUE_APP_INSET) {
//   console.log('shop端嵌入式...')
//   window.addEventListener(
//     'message',
//     function(e) {
//       let data = e.data
//       if (data && data.cmd === 'getTokenInfo') {
//         console.log('shop端成功接收message...')
//         localStorage.setItem('tokenInfo', JSON.stringify(data.params));

//         service({ url: "/permission", method: "get" }).then((response) => {
//           store.dispatch("setMenu", response.data.data);
//           let extendsRoutes = loadRouters.addRouters(response.data.data);
//           // this.$router.addRoutes(extendsRoutes)
//           routerBefore.goToPath(to, from, next);
//         });
//         // 向父vue页面发送信息
//         window.parent.postMessage(
//           {
//             cmd: 'getToken',
//             params: {
//               success: true
//             }
//           },
//           '*'
//         )
//       }
//     },
//     false
//   )
// }

async function transformConfig (config) {
  if (config.refreshToken && store.getters.token) {
    let timestamp = Date.parse(new Date()) / 1000
    if (Number(store.getters.exp) - timestamp <= 300) {
      await getRefresh()
    }
  }

  // if (localStorage.getItem('tokenInfo') && store.getters.isInFrame) {
  //   config.headers['Authorization'] =
  //     'Bearer ' + JSON.parse(localStorage.getItem('tokenInfo')).token
  // } else
  if (store.getters.token) {
    config.headers['Authorization'] = 'bearer ' + store.getters.token // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
  }

  config.transformRequest = function (data) {
    if (data && data.isUploadFile) {
      let params = new FormData()
      for (var key in data) {
        if (key !== 'isUploadFile') {
          params.append(key, data[key])
        }
      }
      return params
    } else {
      return Qs.stringify(data)
    }
  }

  return config
}

// request拦截器
service.interceptors.request.use(
  (config) => {
    return transformConfig(config)
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error)
  }
)

// 刷新token
function getRefresh () {
  return service
    .get('/token/refresh', {
      params: {
        token_refresh: true
      }
    })
    .then(function (response) {
      if (response.headers.authorization) {
        store.dispatch('setToken', response.headers.authorization)
      }
    })
}

// response拦截器
service.interceptors.response.use(
  (response) => {
    if (response.config.method != 'get') {
      Message.closeAll()
    }
    return response
    /**
     * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
     * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
     */
  },
  (error) => {
    const loginPath = process.env.PREFIXES ? `/${process.env.PREFIXES}/login` : '/login'
    Message.closeAll()
    var msg = ''
    // 如果token已经过期，则刷新token
    if (
      error.response.data.error.message === 'The token has been blacklisted' ||
      error.response.data.error.message === 'Token has expired'
    ) {
      msg = '当前页面已过期，请刷新'
    } else if (
      error.response &&
      error.response.status === 403 &&
      error.response.data.error.message == 'access denied, username password are not match'
    ) {
      msg = '用户名或密码错误'
    } else if (
      error.response &&
      error.response.status === 403 &&
      error.response.data.error.message == 'Token Signature could not be verified.'
    ) {
      router.push({ path: loginPath })
      NProgress.done()
    } else {
      if (
        error.response &&
        error.response.data.error.code &&
        errorMsg['code' + error.response.data.error.code]
      ) {
        msg = errorMsg['code' + error.response.data.error.code]
      } else {
        msg = error.response.data.error.message
      }
    }

    if (!msg) {
      msg = '系统繁忙，请重试'
    }

    Message({ message: msg, type: 'error', duration: 3 * 1000 })

    return Promise.reject(error)
  }
)

export default service
