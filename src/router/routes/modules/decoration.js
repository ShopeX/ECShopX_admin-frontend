/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { BasicLayout, LayoutDynamic, EmptyLayout } from '@/layout/basic'
import SubLayout from '@/view/sublayout'
import { i18n } from '@/i18n'

const routes = [
  {
    component: LayoutDynamic,
    meta: {
      aliasName: 'wxapp-template',
      icon: 'page-template',
      keepAlive: true,
      title: i18n.t('7d3fbb6d.81b2cb')
    },
    name: 'decoration',
    path: '/decoration',
    children: [
      {
        name: 'homeTemplate',
        path: 'mobile/home-template',
        meta: {
          aliasName: 'wxapp-template-edit',
          icon: 'pay-circle',
          title: i18n.t('7d3fbb6d.db1c89'),
          permissions: ['wxapp-template.wxappmanage.wxapp-template-edit']
        },
        component: () => import('@/view/wxapp/home'),
        children: [
          {
            meta: {
              layout: 'empty'
            },
            path: 'edit',
            component: () => import('@/view/decorate/index')
          }
        ]
      },
      {
        name: 'storeTemplate',
        path: 'mobile/store-template',
        meta: {
          aliasName: 'classificationTemplate',
          icon: 'pay-circle',
          title: i18n.t('7d3fbb6d.398e60'),
          permissions: ['wxapp-template.wxappmanage.classificationTemplate']
        },
        component: () => import('@/view/wxapp/classificationTemplate')
      },
      {
        name: 'categoryTemplate',
        path: 'mobile/category-template',
        meta: {
          aliasName: 'wxapp-editcategory',
          icon: 'pay-circle',
          title: i18n.t('7d3fbb6d.226fc6'),
          permissions: ['wxapp-template.wxappmanage.wxapp-editcategory']
        },
        component: () => import('@/view/wxapp/category/categorize')
      },
      {
        name: 'customizeTemplate',
        path: 'mobile/customize-template',
        meta: {
          aliasName: 'wxapp-custompage',
          icon: 'pay-circle',
          title: i18n.t('7d3fbb6d.ec20e4'),
          permissions: ['wxapp-template.wxappmanage.wxapp-custompage']
        },
        component: () => import('@/view/wxapp/customPage')
      },
      {
        name: 'mallTheme',
        path: 'mobile/mall-theme',
        meta: {
          aliasName: 'colorstyle',
          icon: 'pay-circle',
          title: i18n.t('7d3fbb6d.c701e9'),
          permissions: ['wxapp-template.wxappmanage.colorstyle']
        },
        component: () => import('@/view/wxapp/theme/colorStyle')
      },
      {
        name: 'memberCenter',
        path: 'mobile/member-center',
        meta: {
          aliasName: 'membercentersetting',
          icon: 'pay-circle',
          title: i18n.t('7d3fbb6d.12688a'),
          permissions: ['wxapp-template.wxappmanage.membercentersetting']
        },
        component: () => import('@/view/wxapp/memberCenter')
      },
      {
        name: 'mall-info',
        path: 'mobile/mall-info',
        meta: {
          aliasName: 'wxshopsetting',
          icon: 'pay-circle',
          title: i18n.t('7d3fbb6d.cc5507'),
          permissions: ['wxapp-template.wxappmanage.wxshopsetting']
        },
        component: () => import('@/view/wxapp/shopInfo')
      },
      {
        name: 'screenAdvertisement',
        path: 'mobile/screen-advertisement',
        meta: {
          aliasName: 'openscreenad',
          icon: 'pay-circle',
          title: i18n.t('7d3fbb6d.1c1143'),
          permissions: ['wxapp-template.wxappmanage.openscreenad']
        },
        component: () => import('@/view/base/screen/openScreenAD')
      },
      {
        name: 'webTemplateList',
        path: 'web/template',
        meta: {
          aliasName: 'templatelist',
          icon: 'pay-circle',
          title: i18n.t('7d3fbb6d.5a0a70'),
          permissions: ['wxapp-template.pcmall.templatelist']
        },
        component: () => import('@/views/decoration/web-templatelist/index')
      },
      // {
      //   name: 'webTemplateEdit',
      //   path: 'web/template/edit',
      //   meta: {
      //     aliasName: 'templateEdit',
      //     permissions: ['wxapp-template.pcmall.design']
      //   },
      //   component: () => import('@/views/decoration/web-template/index')
      // },
      {
        name: 'loginPage',
        path: 'web/config',
        meta: {
          aliasName: 'loginPageSetting',
          icon: 'pay-circle',
          title: '42c71eaf.1d2582',
          permissions: ['wxapp-template.pcmall.loginPageSetting']
        },
        component: () => import('@/views/decoration/web-config')
      },
      // {
      //   name: 'seoConfiguration',
      //   path: 'web/seo-configuration',
      //   meta: {
      //     aliasName: 'seo',
      //     icon: 'pay-circle',
      //     title: '商城全局配置',
      //     permissions: ['wxapp-template.pcmall.seo']
      //   },
      //   component: () => import('@/views/decoration/web-config')
      // },
      {
        name: 'page-seo',
        path: 'web/page-seo',
        meta: {
          aliasName: 'pageseo',
          icon: 'pay-circle',
          title: i18n.t('7d3fbb6d.06bc38'),
          permissions: ['wxapp-template.pcmall.pageseo']
        },
        component: () => import('@/view/pc/tdk/givenset')
      },
      {
        name: 'webMenu',
        path: 'web-menu',
        meta: {
          aliasName: 'web-menus',
          title: '738edee2.ff36f6',
          permissions: ['wxapp-template.pcmall.web-menus']
        },
        component: () => import('@/views/decoration/web-menu/index')
      },
      {
        name: 'webMenuCreate',
        path: 'web-menu/create',
        meta: {
          title: '7d3fbb6d.ba750e',
          permissions: ['wxapp-template.pcmall.web-menus']
        },
        component: () => import('@/views/decoration/web-menu/_id')
      },
      {
        name: 'webMenuItems',
        path: 'web-menu/:id',
        meta: {
          title: '7d3fbb6d.ca3472',
          // 须与列表页 webMenu 一致，否则 generateAccess 会过滤掉本路由，进入详情会空白/404
          permissions: ['wxapp-template.pcmall.web-menus']
        },
        component: () => import('@/views/decoration/web-menu/_id')
      },
      {
        name: 'decorationWebEdit',
        path: 'web/edit/:pageType',
        meta: {
          aliasName: 'decorationWebEdit',
          icon: 'pay-circle',
          title: i18n.t('7d3fbb6d.81b2cb'),
          permissions: ['wxapp-template.pcmall.design']
        },
        component: () => import('@/views/decoration/web-template/index')
      }
    ]
  },
  {
    component: EmptyLayout,
    path: '/decoration/web/template/edit',
    meta: {
      aliasName: 'templateEdit',
      permissions: ['wxapp-template.pcmall.design']
    },
    component: () => import('@/views/decoration/web-template/index')
  }
]

export default routes
