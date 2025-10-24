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

import { coreRoutes } from './core'

const dynamicRouteFiles = (() => {
  const basePath = window.location.href.match(/\/(shopadmin|supplier|merchant)(\/.*)?$/)?.[1]

  if (basePath == 'shopadmin') {
    return require.context('./shopadmin', false, /\.js$/)
  } else if (basePath == 'supplier') {
    return require.context('./supplier', false, /\.js$/)
  } else if (basePath == 'merchant') {
    return require.context('./merchant', false, /\.js$/)
  } else {
    return require.context('./modules', false, /\.js$/)
  }
})()

function mergeRouteModules(routeModules) {
  const mergedRoutes = []

  for (const routeModule of Object.values(routeModules)) {
    const moduleRoutes = dynamicRouteFiles(routeModule)?.default ?? []
    mergedRoutes.push(...moduleRoutes)
  }

  return mergedRoutes
}

const dynamicRoutes = mergeRouteModules(
  dynamicRouteFiles.keys().filter((key) => key.startsWith('./'))
)

// 基础路由
const routes = [...coreRoutes]

// 动态路由
const accessRoutes = [...dynamicRoutes]

export { accessRoutes, routes }
