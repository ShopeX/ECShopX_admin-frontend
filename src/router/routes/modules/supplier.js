import { BasicLayout } from '@/layout/basic'

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'supply',
      icon: 'cooperative-handshake',
      keepAlive: true,
      title: '供应'
    },
    name: 'supplier',
    path: '/supplier',
    children: [
      {
        name: 'productList',
        path: 'product-manage/product-list',
        meta: {
          aliasName: 'supplier_goods_list',
          icon: 'pay-circle',
          title: '商品管理',
          permissions: ['supply.supplygoods.supplier_goods_list']
        },
        component: () => import('@/view/mall/goods/physical/supplier_goods_list'),
        children: [
          {
            path: 'editor/:itemId?',
            // component: () => import('@/view/mall/goods/physical/add'),
            component: () => import('@/view/goods/index'),
            meta: {
              footerFixed: true
            }
          },
          {
            path: 'physicalstoreupload',
            name: `库存导入`,
            component: () => import('@/view/mall/goods/physical/normalGoodsStoreUpload')
          },
          {
            path: 'physicalprofitupload',
            name: `分润导入`,
            component: () => import('@/view/mall/goods/physical/normalGoodsProfitUpload')
          },
          {
            path: 'physicalupload',
            name: `商品导入`,
            component: () => import('@/view/mall/goods/physical/normalGoodsUpload')
          }
        ]
      },
      {
        name: 'productReview',
        path: 'product-manage/product-review',
        meta: {
          aliasName: 'goods_suppliergoods',
          icon: 'pay-circle',
          title: '商品审核',
          permissions: ['supply.supplygoods.goods_suppliergoods']
        },
        component: () => import('@/view/mall/goods/physical/supplier_goods_check'),
        children: [
          {
            path: 'editor/:itemId?',
            component: () => import('@/view/goods/index'),
            meta: {
              footerFixed: true
            }
          }
        ]
      },
      {
        name: 'supplierList',
        path: 'supplier-manage/supplier-list',
        meta: {
          aliasName: 'supplier_list',
          icon: 'pay-circle',
          title: '供应商列表',
          permissions: ['supply.supplymanage.supplier_list']
        },
        component: () => import('@/view/mall/supplier/supplier_list')
      },
      {
        name: 'supplierAccount',
        path: 'supplier-manage/supplier-account',
        meta: {
          aliasName: 'supplier',
          icon: 'pay-circle',
          title: '供应商账号',
          permissions: ['supply.supplymanage.supplier']
        },
        component: () => import('@/view/base/account/suppliers')
      }
    ]
  }
]

export default routes
