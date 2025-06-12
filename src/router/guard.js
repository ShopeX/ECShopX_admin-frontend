import { useNProgress } from '@/composables'
import store from '@/store'
import { generateAccess } from './access'
import { accessRoutes } from './routes'

const { startProgress, stopProgress } = useNProgress()

function setupCommonGuard(router) {
  router.beforeEach((to, from, next) => {
    startProgress()
    next()
  })

  router.afterEach((to, from, next) => {
    stopProgress()
  })
}

function setupAccessGuard(router) {
  router.beforeEach(async (to, from, next) => {
    console.log('setupAccessGuard beforeEach', to, from)
    const hasToken = store.state.user.token
    if (!hasToken) {
      // return {
      //   path: '/login',
      //   query: {
      //     redirect: encodeURIComponent(to.fullPath)
      //   },
      //   replace: true
      // }
      if (/^\/(shopadmin|supplier|merchant)?\/?login$/.test(to.path)) {
        next()
      } else {
        next('/login')
      }
      return
    }
    // 菜单已加载标志
    if (store.state.access.isAccessChecked) {
      // to.path如果访问的不在路由中，重定向到路由默认菜单的第一个

      next()
      return
    }

    // 生成菜单和路由
    const { accessibleMenus, accessibleRoutes } = await generateAccess({
      router,
      routes: accessRoutes
    })

    store.commit('access/setIsAccessChecked', true)

    // return {
    //   path: '/dashboard',
    //   replace: true
    // }

    // next('/dashboard')
    // 检查目标路径是否在可访问路由中
    const isPathAccessible = (path, routes, parentPath = '') => {
      return routes.some(route => route.path === path)
      // for (const route of routes) {
      //   // 拼接当前路径
      //   parentPath = parentPath + route.path
      //   // 递归检查子路由,传入当前拼接的路径作为父路径
      //   if (route.children) {
      //     return isPathAccessible(path, route.children, parentPath)
      //   } else {
      //     // 判断完整路径是否匹配
      //     if (parentPath === path) return true
      //   }
      // }
      // return false
    }

    // 获取第一个可访问路由的路径
    const getFirstRoutePath = routes => {
      if (!routes || !routes.length) return '/dashboard'

      const findFirstPath = (route, parentPath = '') => {
        const currentPath = parentPath + route.path

        if (!route.children || !route.children.length) {
          return currentPath
        }

        return findFirstPath(route.children[0], currentPath)
      }

      return findFirstPath(routes[0])
    }

    // 如果目标路径不可访问，重定向到第一个可访问路由
    if (!isPathAccessible(to.path, router.getRoutes())) {
      const firstPath = getFirstRoutePath(accessibleRoutes)
      next(firstPath)
      return
    }
    next(to)
  })
}

function createRouterGuard(router) {
  setupCommonGuard(router)

  setupAccessGuard(router)
}

export { createRouterGuard }
