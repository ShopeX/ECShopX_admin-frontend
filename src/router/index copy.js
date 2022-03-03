import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import ErrorPage from '@/view/404'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { log, isInSalesCenter } from '@/utils'

import constantRouterMap from './src'
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    constantRouterMap.RouteAuth
    // ...constantRouterMap
  ],
  mode: 'history'
})

const routerBefore = {
  goToPath: function (to, from, next) {
    let licenseValid = store.getters.license_authorize
      ? JSON.parse(Base64.decode(store.getters.license_authorize))
      : undefined
    //let licenseValid=undefined;
    if (licenseValid && (licenseValid.valid == 'false' || !licenseValid.valid)) {
      if (to.path.indexOf('assetaccountactivation') === -1) {
        next({ path: matchInternalRoute('assetaccountactivation') })
        NProgress.done()
      } else {
        next()
      }
    } else if (to.path === passport.path) {
      next({ path: pathPrefix ? `/${pathPrefix}` : '/' })
      NProgress.done()
    } else if (to.path === shoppassport.path) {
      console.log('---licenseValid23--', licenseValid)
      next({ path: pathPrefix ? `/${pathPrefix}/shopadmin` : '/shopadmin' })
      NProgress.done()
    } else {
      next()
    }
  }
}

const matchInternalRoute = function (name) {
  const menus = store.getters.menus
  if (menus) {
    return findName(menus, name)
  }
  function findName (menus, name) {
    for (let item of menus) {
      let url = item.url.split('/')
      if (url[url.length - 1] === name) {
        return item.url
      }
      if (item.children && item.children.length > 0) {
        let obj = findName(item.children, name)
        if (obj) {
          return obj
        }
      }
    }
  }
}

const whiteList = [
  passport.path,
  forget.path,
  shoppassport.path,
  activelicense.path,
  '/record',
  '/iframeLogin'
] // 不重定向白名单

// 动态路由
router.beforeEach((to, from, next) => {
  // 加载PC模版设计器
  if (to.path.includes('/pc/design')) {
    const { id } = to.query
    console.log(`【shop】pageid is: ${id}`)
    actions.setGlobalState({
      mode: 'pc',
      token: store.getters.token,
      pageid: id,
      baseUrl: process.env.VUE_APP_BASE_API
    })
  }

  // if (to.path.indexOf('shopadmin') !== -1) {
  //   store.dispatch('setLoginType', 'distributor')
  // } else {
  //   store.dispatch("setLoginType", store.getters.login_type);
  // }
  // 保证类型已经存储到cookie中了
  setTimeout(function () {
    console.log(store.getters.login_type)
  }, 200)

  NProgress.start()

  let timestamp = Date.parse(new Date()) / 1000

  // 在iframe中
  if (isInSalesCenter()) {
    const { token } = qs.parse(self.location.search.replace(/\?/, ''))
    store.commit('setIsFrame', true)
    if (token) {
      localStorage.removeItem('menu')
      localStorage.setItem('SALE_CENTER_TOKEN', token)
      store.dispatch('setToken', token)
    } else {
      store.dispatch('setToken', localStorage.getItem('SALE_CENTER_TOKEN'))
    }
  }
  console.log('router store token:', store.getters.token, to.path)
  if (store.getters.token && whiteList.indexOf(to.path) === -1) {
    // 验证token有效期 提前五分种刷新token
    console.log(
      'token validate time: ',
      Number(store.getters.exp),
      timestamp,
      Number(store.getters.exp) - timestamp
    )
    if (Number(store.getters.exp) - timestamp <= 300) {
      fetch({ url: '/token/refresh', method: 'get' })
        .then((response) => {
          store.dispatch('setToken', response.headers.authorization)
          // 在iframe中，更新主应用
          if (isInSalesCenter()) {
            // 向主应用发送新的token
            console.log(`send token to main app: ${response.headers.authorization}`)
            window.parent.postMessage(
              {
                cmd: 'getToken',
                params: {
                  token: response.headers.authorization
                }
              },
              '*'
            )
          }
          routerBefore.goToPath(to, from, next)
        })
        .catch((error) => {
          if (to.path.indexOf('shopadmin') !== -1) {
            next(shoppassport.path) // 否则全部重定向到登录页
          } else {
            next(passport.path) // 否则全部重定向到登录页
          }
          NProgress.done() // 在hash模式下 改变手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
        })
    } else if (!store.getters.menus) {
      fetch({ url: '/permission', method: 'get' }).then((response) => {
        console.log('permission menus:', response.data.data)
        store.dispatch('setMenu', response.data.data)
        let extendsRoutes = loadRouters.addRouters(response.data.data)
        // this.$router.addRoutes(extendsRoutes)
        routerBefore.goToPath(to, from, next)
      })
    } else {
      routerBefore.goToPath(to, from, next)
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      const { routes } = router.options
      const fd = routes.find((item) => item.path == to.path)
      console.log('fd: ', fd)
      if (fd) {
        next()
      } else {
        window.location.href = constantRouterMap.RouteAuth.path
      }
    }
  }
})

router.afterEach(() => {
  //进度条消失
  NProgress.done()
})

export default router
