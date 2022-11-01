// 会员路由
const name = '导购'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/guide',
  component: Layout,
  children: [
    {
      path: 'DistributionConfig',
      name: `分润配置`,
      component: () => import('@/view/base/setting/distribution/index')
    },
    {
      path: 'Marketingsalesmanrole',
      name: `导购角色`,
      component: () => import('@/view/guide/salemanRoleConfig')
    },
    {
      path: 'shoppingGuideTask',
      name: `导购任务`,
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
      name: `导购消息模版`,
      component: () => import('@/view/guide/shopnoticetempl')
    },
    {
      path: 'SalemanLoginHistory',
      name: `导购签到记录`,
      component: () => import('@/view/guide/SalemanLoginHistory')
    },
    {
      path: 'marketingsalesman',
      name: `店铺导购员`,
      component: () => import('@/view/guide/salesman')
    },
    {
      path: 'coupongrantset',
      name: `优惠券发放设置`,
      component: () => import('@/view/member/cardticket/couponGrantSet')
    },
    {
      path: 'shopactivities',
      name: `导购知识库`,
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
      name: `导购员通知`,
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
      name: `业绩统计`,
      component: () => import('@/view/mall/profit/list')
    },
    {
      path: 'salemancustomercomplaints',
      name: `导购员投诉`,
      component: () => import('@/view/guide/salemanCustomerComplaints')
    },
    {
      path: 'guide/qywx/addressBook',
      name: `通讯录`,
      component: () => import('@/view/base/setting/addressBook/index')
    }
  ]
}
