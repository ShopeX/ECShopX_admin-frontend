/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
const name = '60fc6702.e366cc'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/supplier/setting',
  component: Layout,
  children: [
    {
      path: 'baseexport',
      name: '60fc6702.d12fb1',
      component: () => import('@/view/base/exportlog/index')
    },
    {
      path: 'datapass',
      name: '60fc6702.74236b',
      component: () => import('@/views/settings/systemConfig/encrypt/authAdmin.vue')
    }
  ]
}
