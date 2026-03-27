/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
const name = '2fbaef93.236ed6'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/site',
  component: Layout,
  children: [
    {
      path: 'forms/selformelementsetting',
      name: '2fbaef93.e32fd0',
      component: () => import('@/view/member/selfservice/formsettinglist'),
      children: [
        {
          path: 'editor/:itemId?',
          name: '2fbaef93.c7d5c2',
          component: () => import('@/view/member/selfservice/formsettingadd')
        }
      ]
    },
    {
      path: 'forms/selformtempsetting',
      name: '2fbaef93.a1cd27',
      component: () => import('@/view/member/selfservice/formtemplatelist'),
      children: [
        {
          path: 'editor/:itemId?',
          name: '2fbaef93.2b9acd',
          component: () => import('@/view/member/selfservice/formtemplateadd')
        }
      ]
    },
    {
      path: 'article/planting',
      name: '2fbaef93.e8f87a',
      component: () => import('@/view/content/soft-article'),
      children: [
        {
          path: 'editor/:itemId?',
          name: '2fbaef93.328f76',
          component: () => import('@/view/content/soft-article-id')
        }
      ]
    },
    {
      path: 'shopscreen/shopscreen_category',
      name: '2fbaef93.93d0e7',
      component: () => import('@/view/shopscreen/category')
    },
    {
      path: 'shopscreen/bigScreenAd',
      name: '2fbaef93.7af20f',
      component: () => import('@/view/shopscreen/bigScreenAd')
    },
    {
      path: 'shopscreen/homeCarousel',
      name: '2fbaef93.7e928d',
      component: () => import('@/view/shopscreen/homeCarousel')
    },
    {
      path: 'shopscreen/searchKeyWords',
      name: '2fbaef93.3b71e9',
      component: () => import('@/view/shopscreen/searchKeyWords')
    },
    {
      path: 'article/articlecolumns',
      name: '2fbaef93.cae32f',
      component: () => import('@/view/base/article/columns')
    },
    {
      path: 'text/basearticle',
      name: '2fbaef93.f43570',
      component: () => import('@/view/base/article/index'),
      children: [
        {
          path: 'editor',
          name: '2fbaef93.328f76',
          component: () => import('@/view/base/article/editor')
        }
      ]
    },
    {
      path: 'text/articlegeneralcolumns',
      name: '2fbaef93.309b9a',
      component: () => import('@/view/base/article/generalcolumns')
    },
    {
      path: 'ugc/ugcindex',
      name: '2fbaef93.1c9adf',
      component: () => import('@/view/member/ugc/ugcIndex'),
      children: [
        {
          path: 'editor',
          component: () => import('@/view/member/ugc/ugcNotesEditor')
        }
      ]
    },
    {
      path: 'ugc/ugcflags',
      name: '2fbaef93.6864e1',
      component: () => import('@/view/member/ugc/ugcFlags')
    },
    {
      path: 'ugc/ugctags',
      name: '2fbaef93.0b9559',
      component: () => import('@/view/member/ugc/ugcTags')
    },
    {
      path: 'ugc/ugctopic',
      name: '2fbaef93.60d8eb',
      component: () => import('@/view/member/ugc/ugcTopic')
    },
    {
      path: 'ugc/ugcreview',
      name: '2fbaef93.11c261',
      component: () => import('@/view/member/ugc/ugcReview')
    },
    {
      path: 'ugc/ugcpoint',
      name: '2fbaef93.46e7aa',
      component: () => import('@/view/member/ugc/ugcPoint')
    },
    {
      path: 'share/sharesetting',
      name: '2fbaef93.b3cec2',
      component: () => import('@/view/base/setting/sharesetting')
    },
    {
      path: 'evaluate/rate',
      name: '2fbaef93.d58254',
      component: () => import('@/view/goods/rate')
    },
    {
      path: 'material/brandmaterial',
      name: '2fbaef93.b49e2f',
      component: () => import('@/views/content/aterialmanagement'),
      children: [
        {
          path: 'editor/:id?',
          component: () => import('@/view/brand/wechat/artical/new_artical')
        }
      ]
    },
    // {
    //   path: 'wxshopsetting',
    //   name: `商城基本信息`,
    //   component: () => import('@/view/base/shop/shopsetting')
    // },
    {
      path: 'wechat/brandmenu',
      name: '2fbaef93.81cde1',
      component: () => import('@/view/brand/wechat/custommenu')
    },
    {
      path: 'wechat/brandfans',
      name: '2fbaef93.442d3c',
      component: () => import('@/view/brand/wechat/fans')
    },
    {
      path: 'wechat/brandreply',
      name: '2fbaef93.4c0bb8',
      component: () => import('@/view/brand/wechat/reply')
    },
    {
      path: 'aliminiapp',
      name: '2fbaef93.9fd626',
      component: () => import('@/view/wxapp/aliminiapp/setting')
    }
  ]
}
