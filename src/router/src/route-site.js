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
const name = '站点'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/site',
  component: Layout,
  children: [
    {
      path: 'forms/selformelementsetting',
      name: `表单元素配置`,
      component: () => import('@/view/member/selfservice/formsettinglist'),
      children: [
        {
          path: 'editor/:itemId?',
          name: `表单元素配置-编辑`,
          component: () => import('@/view/member/selfservice/formsettingadd')
        }
      ]
    },
    {
      path: 'forms/selformtempsetting',
      name: `表单模板配置`,
      component: () => import('@/view/member/selfservice/formtemplatelist'),
      children: [
        {
          path: 'editor/:itemId?',
          name: `表单模板配置-编辑`,
          component: () => import('@/view/member/selfservice/formtemplateadd')
        }
      ]
    },
    {
      path: 'article/planting',
      name: `软文`,
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
      path: 'shopscreen/shopscreen_category',
      name: `大屏设置-自定义分类`,
      component: () => import('@/view/shopscreen/category')
    },
    {
      path: 'shopscreen/bigScreenAd',
      name: `大屏设置-待机广告`,
      component: () => import('@/view/shopscreen/bigScreenAd')
    },
    {
      path: 'shopscreen/homeCarousel',
      name: `大屏设置-首页轮播图`,
      component: () => import('@/view/shopscreen/homeCarousel')
    },
    {
      path: 'shopscreen/searchKeyWords',
      name: `大屏设置-关键词设置`,
      component: () => import('@/view/shopscreen/searchKeyWords')
    },
    {
      path: 'article/articlecolumns',
      name: `软文栏目`,
      component: () => import('@/view/base/article/columns')
    },
    {
      path: 'text/basearticle',
      name: `文章管理`,
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
      path: 'text/articlegeneralcolumns',
      name: `文章栏目`,
      component: () => import('@/view/base/article/generalcolumns')
    },
    {
      path: 'ugc/ugcindex',
      name: `笔记管理`,
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
      name: `角标管理`,
      component: () => import('@/view/member/ugc/ugcFlags')
    },
    {
      path: 'ugc/ugctags',
      name: `TAG管理`,
      component: () => import('@/view/member/ugc/ugcTags')
    },
    {
      path: 'ugc/ugctopic',
      name: `笔记话题设置`,
      component: () => import('@/view/member/ugc/ugcTopic')
    },
    {
      path: 'ugc/ugcreview',
      name: `评论管理`,
      component: () => import('@/view/member/ugc/ugcReview')
    },
    {
      path: 'ugc/ugcpoint',
      name: `积分管理`,
      component: () => import('@/view/member/ugc/ugcPoint')
    },
    {
      path: 'share/sharesetting',
      name: `分享设置`,
      component: () => import('@/view/base/setting/sharesetting')
    },
    {
      path: 'evaluate/rate',
      name: `商品评价`,
      component: () => import('@/view/goods/rate')
    },
    {
      path: 'material/brandmaterial',
      name: `素材管理`,
      component: () => import('@/view/brand/wechat/aterialmanagement'),
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
      name: `服务号管理-自定义菜单`,
      component: () => import('@/view/brand/wechat/custommenu')
    },
    {
      path: 'wechat/brandfans',
      name: `服务号管理-粉丝管理`,
      component: () => import('@/view/brand/wechat/fans')
    },
    {
      path: 'wechat/brandreply',
      name: `服务号管理-消息回复`,
      component: () => import('@/view/brand/wechat/reply')
    },
    {
      path: 'aliminiapp',
      name: `支付宝小程序设置`,
      component: () => import('@/view/wxapp/aliminiapp/setting')
    }
  ]
}
