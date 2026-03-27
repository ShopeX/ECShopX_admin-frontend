/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
const name = '390b6df9.59cf15'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/wxapp',
  component: Layout,
  children: [
    // 小程序
    {
      path: 'manage/templateedit',
      name: '390b6df9.72c663',
      // component: () => import('@/view/wxapp/management')
      component: () => import('@/view/wxapp/home')
    },
    {
      path: 'manage/editcategory',
      name: '390b6df9.9e5765',
      component: () => import('@/view/wxapp/category/categorize')
    },
    {
      path: 'manage/classificationTemplate',
      name: '390b6df9.891a89',
      component: () => import('@/view/wxapp/classificationTemplate')
    },
    {
      path: 'manage/custompage',
      name: '390b6df9.cee6eb',
      component: () => import('@/view/wxapp/customPage')
    },
    {
      path: 'manage/floorguide',
      name: '390b6df9.a5c567',
      component: () => import('@/view/wxapp/floor_guide')
    },
    {
      path: 'manage/colorstyle',
      name: '390b6df9.732762',
      component: () => import('@/view/wxapp/theme/colorStyle')
    },
    {
      path: 'manage/membercentersetting',
      name: '390b6df9.b04a32',
      component: () => import('@/view/wxapp/memberCenter')
    },
    {
      path: 'manage/wxshopsetting',
      name: '390b6df9.cc5507',
      component: () => import('@/view/wxapp/shopInfo')
    },
    {
      path: 'manage/openscreenad',
      name: '390b6df9.1c1143',
      component: () => import('@/view/base/screen/openScreenAD')
    },
    {
      path: '/manage/activitycollection',
      name: '390b6df9.e7d847',
      component: () => import('@/view/wxapp/manage/activitycollection/index.vue')
    },
    // 小程序模板装修
    // {
    //   path: 'manage/decorate',
    //   name: '390b6df9.72c663',
    //   component: () => import('@/view/decorate/index')
    // },
    // PC商城
    {
      path: 'pcmall/templatelist',
      name: '390b6df9.5a0a70',
      component: () => import('@/view/pc/pctemplate')
    },
    {
      path: 'pcmall/design',
      name: '390b6df9.72c663',
      meta: {
        hidemenu: true
      }
    },
    {
      path: 'pcmall/loginPageSetting',
      name: '390b6df9.b9f357',
      component: () => import('@/view/pc/pctemplate/login')
    },
    {
      path: 'pcmall/seo',
      name: '390b6df9.e807b2',
      component: () => import('@/view/pc/tdk/globalset')
    },
    {
      path: 'pcmall/pageseo',
      name: '390b6df9.06bc38',
      component: () => import('@/view/pc/tdk/givenset')
    },

    {
      path: 'manage/wxapp',
      name: '390b6df9.5a0a70',
      meta: {
        hidemenu: true
      },
      component: () => import('@/view/wxapp/index'),
      children: [
        {
          path: 'wxapp_templ',
          component: () => import('@/view/wxapp/template')
        }
      ]
    },

    {
      path: 'manage/editauthorize',
      name: '390b6df9.053215',
      component: () => import('@/view/wxapp/authorize/index'),
      children: [
        {
          path: 'policy',
          component: () => import('@/view/wxapp/authorize/policy')
        }
      ]
    },
    {
      path: 'manage/cartremind',
      name: '390b6df9.f6f5b3',
      component: () => import('@/view/wxapp/cartremind')
    },
    {
      path: 'aliapp/template',
      name: '390b6df9.5a0a70',
      meta: {
        hidemenu: true
      },
      component: () => import('@/view/wxapp/index'),
      children: [
        {
          path: 'aliapp_templ',
          component: () => import('@/view/wxapp/aliapp/template')
        }
      ]
    },
    {
      path: 'aliapp/templateedit',
      name: '390b6df9.72c663',
      component: () => import('@/view/wxapp/aliapp/management')
    },
    {
      path: 'aliapp/editauthorize',
      name: '390b6df9.053215',
      component: () => import('@/view/wxapp/aliapp/authorize/index')
    },
    {
      path: 'aliapp/editcategory',
      name: '390b6df9.9e5765',
      component: () => import('@/view/wxapp/aliapp/category')
    },
    {
      path: 'aliapp/colorstyle',
      name: '390b6df9.732762',
      component: () => import('@/view/wxapp/aliapp/color_style')
    }
    // {
    //   path: 'aliapp/membercentersetting',
    //   name: '390b6df9.b04a32',
    //   component: () => import('@/view/wxapp/aliapp/member_center_setting')
    // }
  ]
}
