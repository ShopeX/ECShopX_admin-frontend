// 会员路由
const name = '商家'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/sellers',
  component: Layout,
  children: [
    {
      path: 'storemanager/marketingdistributor',
      name: `店铺列表`,
      component: () => import('@/view/mall/marketing/distributor'),
      children: [
        {
          path: 'editor/:itemId?',
          component: () => import('@/view/mall/marketing/distributor_editor')
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
        }
      ]
    },
    {
      path: 'storemanager/list',
      name: `商家列表`,
      component: () => import('@/view/mall/marketing/merchantList/index.vue'),
      children: [
        {
          path: 'editor',
          component: () => import('@/view/mall/marketing/merchantList/editor.vue')
        }
      ]
    },
    {
      path: 'storemanager/distributortags',
      name: `商家标签`,
      component: () => import('@/view/mall/marketing/distributortags')
    },
    {
      path: 'storemanager/distributoraftersalesaddress',
      name: `售后地址`,
      component: () => import('@/view/mall/marketing/distributorAftersalesAddress')
    },
    {
      path: 'storemanager/application',
      name: `入驻审核`,
      component: () => import('@/view/mall/marketing/merchantVerify'),
      children: [
        {
          path: 'verify',
          component: () => import('@/view/mall/marketing/merchantVerify/verify')
        }
      ]
    },
    {
      path: 'storemanager/setting',
      name: '商家设置',
      component: () => import('@/view/mall/marketing/setting')
    }
  ]
}
