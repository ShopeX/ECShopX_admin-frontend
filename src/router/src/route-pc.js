// 会员路由
const name = 'pc装修'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/pc',
  component: Layout,
  children: [
    {
      path: 'templatelist',
      name: `模版列表`,
      component: () => import('@/view/pc/pctemplate')
    },
    {
      path: 'Pctemplate',
      name: `模版编辑`,
      component: () => import('@/view/pc/homePage/default')
    },
    {
      path: 'design',
      name: `模版编辑`,
      meta: {
        hidemenu: true
      }
    },
    {
      path: 'tdkglobalset',
      name: `全局TDK配置`,
      component: () => import('@/view/pc/tdk/globalset')
    },
    {
      path: 'tdkgivenset',
      name: `指定页面TDK配置`,
      component: () => import('@/view/pc/tdk/givenset')
    }
  ]
}
