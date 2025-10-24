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

// 会员路由
const name = '模板'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/wxapp',
  component: Layout,
  children: [
    // 小程序
    {
      path: 'manage/templateedit',
      name: `模板编辑`,
      // component: () => import('@/view/wxapp/management')
      component: () => import('@/view/wxapp/home')
    },
    {
      path: 'manage/editcategory',
      name: `自定义分类`,
      component: () => import('@/view/wxapp/category/categorize')
    },
    {
      path: 'manage/classificationTemplate',
      name: `分类模版`,
      component: () => import('@/view/wxapp/classificationTemplate')
    },
    {
      path: 'manage/custompage',
      name: `自定义页面`,
      component: () => import('@/view/wxapp/customPage')
    },
    {
      path: 'manage/floorguide',
      name: `楼层引导`,
      component: () => import('@/view/wxapp/floor_guide')
    },
    {
      path: 'manage/colorstyle',
      name: `风格配色`,
      component: () => import('@/view/wxapp/theme/colorStyle')
    },
    {
      path: 'manage/membercentersetting',
      name: `会员中心设置`,
      component: () => import('@/view/wxapp/memberCenter')
    },
    {
      path: 'manage/wxshopsetting',
      name: `商城信息`,
      component: () => import('@/view/wxapp/shopInfo')
    },
    {
      path: 'manage/openscreenad',
      name: `开屏广告`,
      component: () => import('@/view/base/screen/openScreenAD')
    },
    // 小程序模板装修
    // {
    //   path: 'manage/decorate',
    //   name: `模板编辑`,
    //   component: () => import('@/view/decorate/index')
    // },
    // PC商城
    {
      path: 'pcmall/templatelist',
      name: `模板列表`,
      component: () => import('@/view/pc/pctemplate')
    },
    {
      path: 'pcmall/design',
      name: `模板编辑`,
      meta: {
        hidemenu: true
      }
    },
    {
      path: 'pcmall/loginPageSetting',
      name: `登陆页设置`,
      component: () => import('@/view/pc/pctemplate/login')
    },
    {
      path: 'pcmall/seo',
      name: `SEO配置`,
      component: () => import('@/view/pc/tdk/globalset')
    },
    {
      path: 'pcmall/pageseo',
      name: `页面SEO`,
      component: () => import('@/view/pc/tdk/givenset')
    },

    {
      path: 'manage/wxapp',
      name: `模板列表`,
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
      name: `授权设置`,
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
      name: `购物车提醒`,
      component: () => import('@/view/wxapp/cartremind')
    },
    {
      path: 'aliapp/template',
      name: `模板列表`,
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
      name: `模板编辑`,
      component: () => import('@/view/wxapp/aliapp/management')
    },
    {
      path: 'aliapp/editauthorize',
      name: `授权设置`,
      component: () => import('@/view/wxapp/aliapp/authorize/index')
    },
    {
      path: 'aliapp/editcategory',
      name: `自定义分类`,
      component: () => import('@/view/wxapp/aliapp/category')
    },
    {
      path: 'aliapp/colorstyle',
      name: `风格配色`,
      component: () => import('@/view/wxapp/aliapp/color_style')
    }
    // {
    //   path: 'aliapp/membercentersetting',
    //   name: `会员中心设置`,
    //   component: () => import('@/view/wxapp/aliapp/member_center_setting')
    // }
  ]
}
