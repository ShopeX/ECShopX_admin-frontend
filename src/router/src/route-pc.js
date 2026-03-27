/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
const name = 'ccbdc949.3cf479'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/pc',
  component: Layout,
  children: [
    {
      path: 'templatelist',
      name: 'ccbdc949.e9ee1d',
      component: () => import('@/view/pc/pctemplate')
    },
    {
      path: 'Pctemplate',
      name: 'ccbdc949.729536',
      component: () => import('@/view/pc/homePage/default')
    },
    {
      path: 'design',
      name: 'ccbdc949.729536',
      meta: {
        hidemenu: true
      }
    },
    {
      path: 'tdkglobalset',
      name: 'ccbdc949.1ad071',
      component: () => import('@/view/pc/tdk/globalset')
    },
    {
      path: 'tdkgivenset',
      name: 'ccbdc949.347daf',
      component: () => import('@/view/pc/tdk/givenset')
    }
  ]
}
