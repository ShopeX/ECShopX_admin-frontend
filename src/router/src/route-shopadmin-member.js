/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Layout from '@/view/layout' // 主框架

export default {
  path: '/shopadmin/member',
  component: Layout,
  children: [
    {
      path: 'member',
      name: '268794ad.5386bb',
      component: () => import('@/views/members/member_list'),
      children: [
        {
          path: 'detail/:user_id?',
          component: () => import('@/view/member/members/detail')
        },
        {
          path: 'chiefupload',
          component: () => import('@/view/member/members/upload_chief')
        }
      ]
    },
    {
      path: 'Managetag',
      name: '268794ad.3cc026',
      component: () => import('@/view/member/members/tags')
    },
    {
      path: 'purchase/employee',
      name: '268794ad.b33603',
      component: () => import('@/view/member/purchase/employee'),
      children: [
        {
          path: 'import',
          name: '268794ad.eba44e',
          component: () => import('@/view/member/purchase/employeeImport')
        }
      ]
    },

    {
      path: 'purchase/company',
      name: '268794ad.07c516',
      component: () => import('@/view/member/purchase/company')
    }
  ]
}
