// 店铺路由
import { BasicLayout } from '@/layout/basic' // 主框架

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'store',
      icon: 'application',
      keepAlive: true,
      title: '店铺'
    },
    name: 'store',
    path: '/store',
    children: [
      {
        name: 'storeManageSelfStore',
        path: 'store-manage/self-store',
        component: () => import('@/view/mall/marketing/distributor'),
        meta: {
          aliasName: 'marketingdistributor',
          icon: 'icon-shop',
          title: '自营店铺',
          permissions: ['store.storemanager.marketingdistributor']
        },
        children: [
          {
            path: 'editor/:itemId?',
            component: () => import('@/view/merchant/store'),
            meta: {
              title: '编辑店铺',
              hidden: true
            }
          },
          {
            path: 'template',
            component: () => import('@/view/mall/marketing/distributor_template'),
            meta: {
              title: '店铺模板',
              hidden: true
            }
          },
          {
            path: 'details/:id?',
            component: () => import('@/view/mall/marketing/distributor_details'),
            meta: {
              title: '店铺详情',
              hidden: true
            }
          },
          {
            path: 'wxpaysetting',
            component: () => import('@/view/mall/marketing/distributor_wxpaysetting'),
            meta: {
              title: '微信支付设置',
              hidden: true
            }
          },
          {
            path: 'alipaysetting',
            component: () => import('@/view/mall/marketing/distributor_alipaysetting'),
            meta: {
              title: '支付宝设置',
              hidden: true
            }
          },
          {
            path: 'storeupload',
            component: () => import('@/view/mall/marketing/shopUpload'),
            meta: {
              title: '店铺上传',
              hidden: true
            }
          }
        ]
      },
      {
        name: 'storeManageStoreWhitelist',
        path: 'store-manage/store-whitelist',
        component: () => import('@/view/mall/marketing/storewhitelist'),
        meta: {
          aliasName: 'storewhitelist',
          icon: 'icon-whitelist',
          title: '店铺白名单',
          permissions: ['store.storemanager.storewhitelist']
        },
        children: [
          {
            path: 'storewhitelistUpload',
            component: () => import('@/view/mall/marketing/storewhitelistUpload'),
            meta: {
              title: '白名单上传',
              hidden: true
            }
          }
        ]
      },
      {
        name: 'storeManageStoreRules',
        path: 'store-manage/store-rules',
        meta: {
          aliasName: 'storerules',
          icon: 'icon-address',
          title: '进店规则',
          permissions: ['store.storemanager.storerules']
        },
        component: () => import('@/views/store/store-rules')
      },
      {
        name: 'storeManageRefundAddress',
        path: 'store-manage/refund-address',
        meta: {
          aliasName: 'distributoraftersalesaddress',
          icon: 'icon-address',
          title: '退货地址',
          permissions: ['store.storemanager.distributoraftersalesaddress']
        },
        component: () => import('@/view/mall/marketing/distributorAftersalesAddress')
      }
    ]
  }
]

export default routes
