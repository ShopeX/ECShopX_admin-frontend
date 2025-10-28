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

import { BasicLayout } from '@/layout/basic'

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'site',
      icon: 'oceanengine',
      keepAlive: true,
      title: '内容'
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
          title: '软文列表',
          permissions: ['site.article.planting']
        },
        component: () => import('@/view/content/soft-article'),
        children: [
          {
            path: 'editor/:itemId?',
            name: '软文-编辑',
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
          title: '软文频道',
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
          title: '素材管理',
          permissions: ['site.material.brandmaterial']
        },
        component: () => import('@/view/brand/wechat/aterialmanagement'),
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
          title: '文章列表',
          permissions: ['site.text.basearticle']
        },
        component: () => import('@/view/base/article/index'),
        children: [
          {
            path: 'editor',
            name: '软文-编辑',
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
          title: '文章分类',
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
          title: '笔记管理',
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
          title: '角标管理',
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
          title: '笔记话题',
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
          title: '笔记评论',
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
          title: '评论设置',
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
          title: '分享设置',
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
          title: '商品评价',
          permissions: ['site.evaluate.rate']
        },
        component: () => import('@/view/goods/rate')
      }
    ]
  }
]

export default routes
