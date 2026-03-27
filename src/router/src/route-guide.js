/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
const name = 'e8045d5d.c60b43'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/guide',
  component: Layout,
  children: [
    {
      path: 'DistributionConfig',
      name: 'e8045d5d.d2d71c',
      component: () => import('@/view/base/setting/distribution/index')
    },
    {
      path: 'Marketingsalesmanrole',
      name: 'e8045d5d.2fe8d8',
      component: () => import('@/view/guide/salemanRoleConfig')
    },
    {
      path: 'shoppingGuideTask',
      name: 'e8045d5d.25048a',
      component: () => import('@/view/guide/shoppingGuideTask'),
      children: [
        {
          path: 'editor/:task_id?',
          component: () => import('@/view/guide/shoppingGuideTask_editor')
        },
        {
          path: 'statistics',
          component: () => import('@/view/guide/shoppingGuideTaskStatistics')
        }
      ]
    },
    {
      path: 'shopnoticetempl',
      name: 'e8045d5d.f4f602',
      component: () => import('@/view/guide/shopnoticetempl')
    },
    {
      path: 'SalemanLoginHistory',
      name: 'e8045d5d.51d6c2',
      component: () => import('@/view/guide/SalemanLoginHistory')
    },
    {
      path: 'marketingsalesman',
      name: 'e8045d5d.209e3b',
      component: () => import('@/view/guide/salesman')
    },
    {
      path: 'coupongrantset',
      name: 'e8045d5d.0585e2',
      component: () => import('@/view/member/cardticket/couponGrantSet')
    },
    {
      path: 'shopactivities',
      name: 'e8045d5d.ea8541',
      component: () => import('@/view/guide/shopactivities'),
      children: [
        {
          path: 'editor',
          component: () => import('@/view/guide/shopActivities_editor')
        }
      ]
    },
    {
      path: 'shoppingguidenotification',
      name: 'e8045d5d.de94d9',
      component: () => import('@/view/guide/shoppingguidenotification'),
      children: [
        {
          path: 'editor',
          component: () => import('@/view/guide/shoppingguidenotification_editor')
        }
      ]
    },
    {
      path: 'profitlist',
      name: 'e8045d5d.398e76',
      component: () => import('@/view/mall/profit/list')
    },
    {
      path: 'salemancustomercomplaints',
      name: 'e8045d5d.dc1e9e',
      component: () => import('@/view/guide/salemanCustomerComplaints')
    },
    {
      path: 'guide/qywx/addressBook',
      name: 'e8045d5d.183abe',
      component: () => import('@/view/base/setting/addressBook/index')
    }
  ]
}
