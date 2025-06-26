import { BasicLayout } from '@/layout/basic' // 主框架

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'setting',
      icon: 'setting-config',
      keepAlive: true,
      title: '设置'
    },
    name: 'supplierSetting',
    path: '/supplier/setting',
    children: [
      {
        name: `exportList`,
        path: 'export/list',
        meta: {
          aliasName: 'baseexport',
          icon: 'icon-products',
          title: '导出列表',
          permissions: ['setting.baseexport']
        },
        component: () => import('@/view/base/exportlog/index')
      },
      {
        name: `systemConfigPrivacyApply`,
        path: 'system-config/provacy-apply',
        meta: {
          aliasName: 'datapass',
          icon: 'icon-products',
          title: '脱敏数据申请',
          permissions: ['setting.datapass']
        },
        component: () => import('@/view/base/encrypt/authAdmin.vue')
      },
      {
        name: `systemConfigSupplierRegister`,
        path: 'system-config/supplier-register',
        meta: {
          aliasName: 'supplier_register',
          icon: 'icon-products',
          title: '供应商入驻',
          permissions: ['setting.supplier_register']
        },
        component: () => import('@/view/auth/certify')
      }
    ]
  }
]

export default routes
