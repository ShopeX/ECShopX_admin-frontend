// 供应路由
const name = '供应'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/supply',
  component: Layout,
  children: [
    {
      path: 'supplymanage/supplier_list',
      name: '供应商管理',
      component: () => import('@/view/mall/supplier/supplier_list')
    },
    // 供应商商品列表
    {
      path: 'supplygoods/supplier_goods_list',
      name: `供应商商品列表`,
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
    // 供应商商品审核
    {
      path: 'supplygoods/suppliergoods',
      name: `供应商商品审核`,
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
      path: 'supplymanage/supplier',
      name: `账号管理-供应商账号`,
      component: () => import('@/view/base/account/suppliers')
    }
  ]
}
