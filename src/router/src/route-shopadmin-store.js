// 商品路由
const name = '店铺'
import Layout from '@/view/layout' // 主框架 2024003

export default {
  path: '/shopadmin/store',
  component: Layout,
  children: [
    {
      path: 'marketingdistributor',
      name: `店铺信息`,
      component: () => import('@/view/mall/marketing/distributor'),
      children: [
        {
          path: 'editor/:itemId?',
          component: () => import('@/view/merchant/store')
        },
        {
          path: 'template/:distributor_id?',
          component: () => import('@/view/mall/marketing/distributor_template')
        },
        {
          path: 'details/:id?',
          component: () => import('@/view/mall/marketing/distributor_details')
        },
        {
          path: 'wxpaysetting',
          component: () => import('@/view/mall/marketing/distributor_wxpaysetting')
        },
        {
          path: 'alipaysetting',
          component: () => import('@/view/mall/marketing/distributor_alipaysetting')
        }
      ]
    },
    {
      path: 'storewhitelist',
      name: `店铺白名单`,
      component: () => import('@/view/mall/marketing/storewhitelist'),
      children: [
        {
          path: 'storewhitelistUpload',
          component: () => import('@/view/mall/marketing/storewhitelistUpload')
        }
      ]
    },
    {
      path: 'distributorCode',
      name: `店铺码`,
      component: () => import('@/view/mall/marketing/distributorCode')
    },
    {
      path: 'marketingsalesman',
      name: `业务员`,
      component: () => import('@/view/guide/salesman'),
      children: [
        {
          path: 'detail',
          component: () => import('@/view/popularize/brokerageLog')
        },
        {
          path: 'child',
          component: () => import('@/view/popularize/children')
        },
        {
          path: 'children',
          component: () => import('@/view/guide/children')
        }
      ]
    },
    {
      path: 'popularize/popularizegoods',
      name: `分销商品`,
      component: () => import('@/view/popularize/goodsStore')
    },
    {
      path: 'marketing/popularize/popularizelist',
      name: `推广员列表`,
      component: () => import('@/view/popularize/list'),
      children: [
        {
          path: 'detail',
          component: () => import('@/view/popularize/brokerageLog')
        },
        {
          path: 'child',
          component: () => import('@/view/popularize/children')
        }
      ]
    },
    {
      path: 'marketing/popularize/popularizedata',
      name: `业务员业绩`,
      component: () => import('@/view/popularize/data'),
      children: [
        {
          path: 'detail',
          component: () => import('@/view/popularize/brokerageLog')
        }
      ]
    },

    {
      path: 'popularizewithdraw',
      name: `业务员提现`,
      component: () => import('@/view/mall/marketing/salesmanwithdraw')
    },

    {
      path: 'tmpl/shopDecoration',
      name: `移动商城`,
      component: () => import('@/view/mall/marketing/shopDecoration'),
      children: [
        {
          path: 'detail/:itemId?',
          component: () => import('@/view/mall/aftersales/detail')
        }
      ]
    },
    {
      path: 'planting',
      name: `软文`,
      component: () => import('@/view/content/soft-article'),
      children: [
        {
          path: 'editor/:itemId?',
          component: () => import('@/view/content/soft-article-id')
        }
      ]
    }
  ]
}
