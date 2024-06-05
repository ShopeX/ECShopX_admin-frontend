import Vue from 'vue'
import VueRouter from 'vue-router'
import qs from 'qs'
import store from '@/store'
import ErrorPage from '@/view/404'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { log, isBoolean, isInSalesCenter } from '@/utils'
import { actions } from '@/utils/micr-app'

import constantRouterMap from './src'
Vue.use(VueRouter)

const { RouteAuth, RouteShopAdminShopList, RouteDealerIndex, RouteShopAdminBase } =
  constantRouterMap
const router = new VueRouter({
  routes: [...RouteAuth, RouteShopAdminShopList, RouteDealerIndex, RouteShopAdminBase],
  mode: 'history'
})

// 动态路由
router.beforeEach((to, from, next) => {
  NProgress.start()
  // 加载PC模版设计器
  if (to.path == '/wxapp/pcmall/design') {
    const { id } = to.query
    console.log(`【shop】pageid is: ${id}`)
    actions.setGlobalState({
      mode: 'pc',
      token: store.getters.token,
      pageid: id,
      baseUrl: process.env.VUE_APP_BASE_API
    })
  }
  if (isInSalesCenter()) {
    const { token } = qs.parse(self.location.search.replace(/\?/, ''))
    if (token) {
      store.commit('SET_TOKEN', { token })
    }
  }

  const _token = store.getters.token
  const _menus = store.getters.menus

  if (_token) {
    const curPath = constantRouterMap.RouteAuth.find((item) => item.path == to.path)
    if (curPath || to.path == '/shopadmin/shoplist' || to.path == '/dealer/index') {
      return next()
    }
    if (_menus.length == 0) {
      const shopId = store.getters.shopId
      const login_type = store.getters.login_type
      let permissionParams = {}
      if (login_type == 'distributor') {
        permissionParams['distributor_id'] = shopId
      }
      store.dispatch('getPermission', permissionParams).then(() => {
        // 根据权限菜单动态加载路由
        const customRouterUrls = []
        const menus = store.getters.menus
        // 无权限
        if (menus.length == 0) {
          if (isInSalesCenter()) {
            next('/notExistAuth')
          } else {
            next('/login')
          }
        }

        menus.forEach((item) => {
          if (item.children) {
            const smenus = item.children
            smenus.forEach((sitem) => {
              if (sitem.children) {
                const tmenus = sitem.children
                tmenus.forEach((titem) => {
                  customRouterUrls.push(titem.url)
                })
              } else {
                customRouterUrls.push(sitem.url)
              }
            })
          } else {
            customRouterUrls.push(item.url)
          }
        })

        const newRouter = []
        // console.log(Object.keys(constantRouterMap))
        // console.log('menu:', customRouterUrls)

        Object.keys(constantRouterMap).forEach((key) => {
          if (key != 'RouteAuth') {
            const route = constantRouterMap[key]
            // 二级菜单
            if (route.children) {
              const _route = {
                ...route,
                children: []
              }
              _route.children = route.children.filter((item) => {
                if (item.name == 'dashboard') {
                  return (
                    customRouterUrls.includes(`/`) ||
                    customRouterUrls.includes(`/merchant`) ||
                    customRouterUrls.includes(`/shopadmin`)
                  )
                } else {
                  return customRouterUrls.includes(`${route.path}/${item.path}`)
                }
                // // 三级菜单呢
                // if (item.children) {
                //   return item.children.filter((sitem) => {
                //     return customRouterUrls.includes(`${route.path}/${item.path}/${sitem.path}`)
                //   })
                // } else {
                //   return customRouterUrls.includes(`${route.path}/${item.path}`)
                // }
              })
              if (_route.children.length > 0) {
                newRouter.push(_route)
              }
            } else {
              // 一级菜单
              if (customRouterUrls.includes(route.path)) {
                newRouter.push(route)
              }
            }
          }
        })
        newRouter.push(
          {
            path: '/404',
            component: ErrorPage
          },
          {
            path: '*',
            redirect: '/404'
          }
        )
        // log.debug(`newRouter: `, newRouter)

        router.addRoutes(newRouter)
        if (to.path == '/') {
          next(customRouterUrls[0])
        } else {
          next({ ...to })
        }
        // next( customRouterUrls[0] )
      })
    } else {
      next()
    }
  } else {
    if (isBoolean(to.meta.auth) && !to.meta.auth) {
      next()
    } else {
      if (to.path.includes('/shopadmin')) {
        window.location.href = constantRouterMap.RouteAuth[1].path
      } else if (to.path.includes('/merchant')) {
        window.location.href = constantRouterMap.RouteAuth[2].path
      } else {
        // 登录
        window.location.href = constantRouterMap.RouteAuth[0].path
      }
    }
  }
})

router.afterEach((to, form) => {
  //进度条消失
  NProgress.done()
})

export default router
