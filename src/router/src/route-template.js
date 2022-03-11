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
      component: () => import('@/view/wxapp/management')
    },
    {
      path: 'manage/editcategory',
      name: `自定义分类`,
      component: () => import('@/view/wxapp/category')
    },
    {
      path: 'manage/custompage',
      name: `自定义页面`,
      component: () => import('@/view/wxapp/custompage')
    },
    {
      path: 'manage/floorguide',
      name: `楼层引导`,
      component: () => import('@/view/wxapp/floor_guide')
    },
    {
      path: 'manage/colorstyle',
      name: `风格配色`,
      component: () => import('@/view/wxapp/color_style')
    },
    {
      path: 'manage/membercentersetting',
      name: `会员中心设置`,
      component: () => import('@/view/wxapp/member_center_setting')
    },

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
      path: 'manage/editdashboard',
      name: `数据分析`,
      component: () => import('@/view/wxapp/statistics/dataanalysis/index')
    },
    {
      path: 'manage/editsourcemanagement',
      name: `千人千码`,
      component: () => import('@/view/wxapp/statistics/sourcemanagement/index'),
      children: [
        {
          path: 'detail/:monitorId?',
          component: () => import('@/view/wxapp/statistics/sourcemanagement/monito_detail')
        }
      ]
    },

    {
      path: 'manage/noticemessage',
      name: `消息通知`,
      component: () => import('@/view/wxapp/messages')
    },

    {
      path: 'manage/cartremind',
      name: `购物车提醒`,
      component: () => import('@/view/wxapp/cartremind')
    },
    {
      path: 'manage/salespersonshelfindex',
      name: `导购货架首页`,
      component: () => import('@/view/wxapp/salespersonshelfindex')
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
    },
    {
      path: 'aliapp/membercentersetting',
      name: `会员中心设置`,
      component: () => import('@/view/wxapp/aliapp/member_center_setting')
    }
  ]
}
