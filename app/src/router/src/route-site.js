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
      component: () => import( '@/view/member/selfservice/formsettinglist'),
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
      path: 'planting',
      name: `软文`, 
      component: () => import('@/view/base/planting/index'),
      children: [
        {
          path: 'editor/:itemId?',
          name:'软文-编辑',
          component: () => import('@/view/base/planting/editor')
        }
      ]
    },
    {
      path: 'shopscreen/shopscreen_category', 
      name: `大屏设置-自定义分类`,  
      component: () => import('@/view/shopscreen/category'), 
    },
    {
      path: 'shopscreen/bigScreenAd', 
      name: `大屏设置-待机广告`,  
      component: () => import('@/view/shopscreen/bigScreenAd'), 
    },
    {
      path: 'shopscreen/homeCarousel', 
      name: `大屏设置-首页轮播图`,  
      component: () => import('@/view/shopscreen/homeCarousel'), 
    },
    {
      path: 'shopscreen/searchKeyWords', 
      name: `大屏设置-关键词设置`,  
      component: () => import('@/view/shopscreen/searchKeyWords'), 
    },
    {
      path: 'articlecolumns',
      name: `软文栏目`, 
      component: () => import('@/view/base/article/columns')
    },
    {
      path: 'basearticle',
      name: `文章管理`, 
      component: () => import('@/view/base/article/index'),
      children: [
        {
          path: 'editor',
          name:'软文-编辑', 
          component: () => import('@/view/base/article/editor')
        }
      ]
    },
    {
      path: 'articlegeneralcolumns',
      name: `文章栏目`, 
      component: () => import(  '@/view/base/article/generalcolumns')
    },
    {
      path: 'sharesetting',
      name: `分享设置`, 
      component: () => import('@/view/base/setting/sharesetting')
    },
    {
      path: 'wxshopsetting',
      name: `商城基本信息`, 
      component: () => import('@/view/base/shop/shopsetting')
    },
    //{
    //  path: 'wechat/wxaindex',
    //  name: `服务号管理-授权管理`, 
    //  component: () => import( '@/view/base/wxa/index')
    //},
    {
      path: 'wechat/wxaindex',
      name: `服务号管理-小程序管理`, 
      component: () => import( '@/view/wxapp/wxappmanage/list'),
      children: [
        {
          path: 'policy',
          component: () => import('@/view/wxapp/authorize/policy')
        },
        {
          path: 'policy/editdashboard',
          component: () => import('@/view/wxapp/statistics/dataanalysis/index')
        },
        {
          path: 'policy/editsourcemanagement',
          component: () => import('@/view/wxapp/statistics/sourcemanagement/index')
        },
        {
          path: 'policy/editsourcemanagement/detail',
          component: () => import('@/view/wxapp/statistics/sourcemanagement/monito_detail')
        },
        {
          path: 'policy/noticemessage',
          component: () => import('@/view/wxapp/messages')
        }
      ]
    },
    {
      path: 'wechat/brand',
      name: `服务号管理-公众号授权`,
      component: () => import('@/view/brand/wechat/open')
    },
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
      path: 'cs/wxappchat',
      name: `客服-小程序客服`, 
      component: () => import('@/view/base/setting/im/wxappchat')
      // component: () => import('@/view/brand/wechat/wxapp')
    },
    {
      path: 'cs/brandcustomer',
      name: `客服-微信客服`, 
      component: () => import('@/view/brand/wechat/customservice')
    },
    {
      path: 'cs/echat',
      name: `客服-一洽客服`, 
      component: () => import('@/view/base/setting/im/echat')
    },
    {
      path: 'cs/meiqia',
      name: `客服-美洽客服`, 
      component: () => import('@/view/base/setting/im/list')
    }, 
    {
      path: 'site/extminilink',
      name: `外部小程序配置`, 
      component: () => import( '@/view/base/wxa/extMiniLink' ),
      children: [
        {
          path: 'editor',
          name:'外部小程序配置-页面路径',
          component: () => import('@/view/base/wxa/extMiniLinkDetail')
        }
      ]
    }
  ]
}
