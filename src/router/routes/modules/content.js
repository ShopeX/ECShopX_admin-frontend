/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { BasicLayout } from '@/layout/basic'

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'site',
      icon: 'oceanengine',
      keepAlive: true,
      title: 'c488b2d6.2d711b'
    },
    name: 'content',
    path: '/content',
    children: [
      {
        name: 'softArticleList',
        path: 'soft-article/article-list',
        meta: {
          aliasName: 'planting',
          icon: 'pay-circle',
          title: 'c488b2d6.73bfff',
          permissions: ['site.article.planting']
        },
        component: () => import('@/view/content/soft-article'),
        children: [
          {
            path: 'editor/:itemId?',
            name: 'c488b2d6.328f76',
            component: () => import('@/view/content/soft-article-id')
          }
        ]
      },
      {
        name: 'articleChannel',
        path: 'soft-article/article-channel',
        meta: {
          aliasName: 'articlecolumns',
          icon: 'pay-circle',
          title: 'c488b2d6.39345b',
          permissions: ['site.article.articlecolumns']
        },
        component: () => import('@/view/base/article/columns')
      },
      {
        name: 'materialManagement',
        path: 'material/material-management',
        meta: {
          aliasName: 'brandmaterial',
          icon: 'pay-circle',
          title: 'c488b2d6.b49e2f',
          permissions: ['site.material.brandmaterial']
        },
        component: () => import('@/views/content/aterialmanagement'),
        children: [
          {
            path: 'editor/:id?',
            component: () => import('@/view/brand/wechat/artical/new_artical')
          }
        ]
      },
      {
        name: 'articleList',
        path: 'article/article-list',
        meta: {
          aliasName: 'basearticle',
          icon: 'pay-circle',
          title: 'c488b2d6.b8337d',
          permissions: ['site.text.basearticle']
        },
        component: () => import('@/view/base/article/index'),
        children: [
          {
            path: 'editor',
            name: 'c488b2d6.328f76',
            component: () => import('@/view/base/article/editor')
          }
        ]
      },
      {
        name: 'articleCategory',
        path: 'article/article-category',
        meta: {
          aliasName: 'Articlegeneralcolumns',
          icon: 'pay-circle',
          title: 'c488b2d6.c1ed55',
          permissions: ['site.text.Articlegeneralcolumns']
        },
        component: () => import('@/view/base/article/generalcolumns')
      },
      {
        name: 'noteManagement',
        path: 'ugc/note-management',
        meta: {
          aliasName: 'ugcindex',
          icon: 'pay-circle',
          title: 'c488b2d6.1c9adf',
          permissions: ['site.ugc.ugcindex']
        },
        component: () => import('@/view/member/ugc/ugcIndex'),
        children: [
          {
            path: 'editor',
            component: () => import('@/view/member/ugc/ugcNotesEditor')
          }
        ]
      },
      {
        name: 'cornerManagement',
        path: 'ugc/corner-management',
        meta: {
          aliasName: 'ugcflags',
          icon: 'pay-circle',
          title: 'c488b2d6.6864e1',
          permissions: ['site.ugc.ugcflags']
        },
        component: () => import('@/view/member/ugc/ugcFlags')
      },
      {
        name: 'noteTopic',
        path: 'ugc/note-topic',
        meta: {
          aliasName: 'ugctopic',
          icon: 'pay-circle',
          title: 'c488b2d6.b6d3b4',
          permissions: ['site.ugc.ugctopic']
        },
        component: () => import('@/view/member/ugc/ugcTopic')
      },
      {
        name: 'noteComments',
        path: 'ugc/note-comments',
        meta: {
          aliasName: 'ugcreview',
          icon: 'pay-circle',
          title: 'c488b2d6.570831',
          permissions: ['site.ugc.ugcreview']
        },
        component: () => import('@/view/member/ugc/ugcReview')
      },
      {
        name: 'commentSettings',
        path: 'ugc/comment-settings',
        meta: {
          aliasName: 'ugcpoint',
          icon: 'pay-circle',
          title: 'c488b2d6.ff3d97',
          permissions: ['site.ugc.ugcpoint']
        },
        component: () => import('@/view/member/ugc/ugcPoint')
      },
      {
        name: 'sharingSettings',
        path: 'share/sharing-settings',
        meta: {
          aliasName: 'sharesetting',
          icon: 'pay-circle',
          title: 'c488b2d6.b3cec2',
          permissions: ['site.share.sharesetting']
        },
        component: () => import('@/view/base/setting/sharesetting')
      },
      {
        name: 'goodsEvaluateList',
        path: 'goods-evaluate/list',
        meta: {
          aliasName: 'rate',
          icon: 'pay-circle',
          title: 'c488b2d6.d58254',
          permissions: ['site.evaluate.rate']
        },
        component: () => import('@/view/goods/rate')
      }
    ]
  }
]

export default routes
