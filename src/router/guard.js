import { useNProgress } from '@/composables'
import store from '@/store'
import { generateAccess } from './access'
import { accessRoutes, routes as coreRoutes } from './routes'
import { IS_ADMIN, IS_DISTRIBUTOR, IS_MERCHANT, IS_SUPPLIER, traverseTreeValues } from '@/utils'
import { actions } from '@/utils/micr-app'

const coreRoutesNames = traverseTreeValues(coreRoutes, (item) => item.path)

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
    if (to.path == '/decoration/web/template/edit') {
      const { id } = to.query
      console.log(`【shop】pageid is: ${id}`)
      actions.setGlobalState({
        mode: 'pc',
        token: store.state.user.token,
        pageid: id,
        baseUrl: process.env.VUE_APP_BASE_API
      })
    }

    // 如果路径在核心路由中，直接放行
    if (coreRoutesNames.includes(to.path) || to.name === 'FallbackNotFound') {
      next()
      return
    }

    const hasToken = store.state.user.token
    if (!hasToken) {
      if (/\/login$/.test(to.path)) {
        next()
      } else if (
        /^https?:\/\/[^/]+\/(shopadmin|supplier|merchant)(\/.*)?$/.test(location.origin + to.path)
      ) {
        const basePath = to.path.match(/\/(shopadmin|supplier|merchant)(\/.*)?$/)?.[1]
        next(`/${basePath}/login`)
      } else {
        next('/login')
      }
      return
    }

    // 如果当前访问的端不是当前登录的端，则退出登录，并重定向到登录页
    const basePath = window.location.href.match(/\/(shopadmin|supplier|merchant)(\/.*)?$/)?.[1]
    if ((basePath == null && !IS_ADMIN()) || (basePath == 'shopadmin' && !IS_DISTRIBUTOR())) {
      store.commit('user/logout')
      next(basePath ? `/${basePath}/login` : '/login')
      return
    }

    // 菜单已加载标志
    if (store.state.access.isAccessChecked) {
      next()
      return
    }

    // 生成菜单和路由
    const { accessibleMenus, accessibleRoutes } = await generateAccess({
      router,
      routes: accessRoutes
    })

    store.commit('access/setIsAccessChecked', true)

    // 检查目标路径是否在可访问路由中
    const isPathAccessible = (path, routes, parentPath = '') => {
      return routes.some((route) => route.regex.test(path) && route.path !== '')
      // return routes.some(route => route.path === path)
    }

    // 获取第一个可访问路由的路径
    const getFirstRoutePath = () => {
      const routes = router.getRoutes()
      const [firstPermission] = store.state.access.permissions

      const firstRoute = routes.find((route) => route?.meta?.permissions?.includes(firstPermission))
      if (firstRoute) {
        return firstRoute.path
      }

      return '/'
    }

    // 如果目标路径不可访问，重定向到第一个可访问路由
    if (
      !isPathAccessible(to.path, router.getRoutes()) ||
      to.path === '/shopadmin' ||
      to.path === '/supplier' ||
      to.path === '/merchant'
    ) {
      const firstPath = getFirstRoutePath()
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
