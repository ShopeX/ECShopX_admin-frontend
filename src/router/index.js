/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import { createRouterGuard } from './guard'
import { routes } from './routes'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  // 与 vue.config.js publicPath / VUE_APP_PUBLIC_PATH 对齐（宝塔部署为 /admin/）
  base: process.env.VUE_APP_PUBLIC_PATH || '/',
  routes
})

// 创建路由守卫
createRouterGuard(router)

export default router
