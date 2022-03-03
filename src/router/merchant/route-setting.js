// 会员路由
const name = '设置'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/merchant/setting',
  component: Layout,
  children: [
    {
      path: 'Merchantstaff',
      name: `账号管理-店铺管理员`, 
      component: () => import('@/view/base/account/storestaff')
      // component: () => import('@/view/base/exportlog/index')

    },
    {
      path: 'account',
      name: `账号管理-商户账号管理`, 
      component: () => import('@/view/mall/marketing/merchantAccount')
    },

    {
      path: 'baseexport',
      name: `导出列表`, 
      component: () => import('@/view/base/exportlog/index')
    },

    {
      path: 'operatorlogs',
      name: `操作日志`, 
      component: () => import('@/view/base/setting/companys/logs')
    },


    {
      path:'datapassapprove',
      name:'权限申请',
      component:()=> import('@/view/base/encrypt/authAdmin.vue')
    },
    {
      path: 'datapassapply',
      name: `权限审批`, 
      component: () => import( '@/view/base/setting/authorityapproval' ),
      children: [
        {
          path: 'approve/:id?',
          component: () => import('@/view/base/setting/authorityapproval/approve')
        }
      ]
    },
  ]
}
