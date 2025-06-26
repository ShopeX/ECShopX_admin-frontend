// 商品路由
import { BasicLayout } from '@/layout/basic' // 主框架

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'entity',
      icon: 'commodity',
      keepAlive: true,
      title: '商品'
    },
    name: 'supplierEntitygoods',
    path: '/supplier/entity',
    children: [
      {
        name: 'productManageSelfProducts',
        path: 'product-manage/self-products',
        component: () => import('@/view/mall/goods/physical/list'),
        meta: {
          aliasName: 'goodsphysical',
          icon: 'icon-products',
          title: '商品管理',
          permissions: ['entity.goodsphysical']
        },
        children: [
          {
            path: 'editor/:itemId?',
            component: () => import('@/view/goods/index'),
            meta: {
              title: '编辑商品',
              hidden: true,
              footerFixed: true
            }
          },
          {
            path: 'physicalstoreupload',
            component: () => import('@/view/mall/goods/physical/normalGoodsStoreUpload'),
            meta: {
              title: '库存导入',
              hidden: true
            }
          },
          {
            path: 'physicalprofitupload',
            component: () => import('@/view/mall/goods/physical/normalGoodsProfitUpload'),
            meta: {
              title: '分润导入',
              hidden: true
            }
          },
          {
            path: 'physicalupload',
            component: () => import('@/view/mall/goods/physical/normalGoodsUpload'),
            meta: {
              title: '商品导入',
              hidden: true
            }
          }
        ]
      },
      {
        name: 'productImport',
        path: 'product-import',
        component: () => import('@/view/mall/goods/physical/normalGoodsUpload'),
        meta: {
          aliasName: 'physicalupload',
          icon: 'icon-products',
          title: '商品导入',
          permissions: ['entity.physicalupload']
        }
      },
      {
        name: `materialManagement`,
        path: 'material-management',
        component: () => import('@/view/brand/wechat/aterialmanagement'),
        meta: {
          aliasName: 'brandmaterial',
          icon: 'icon-products',
          title: '素材管理',
          permissions: ['entity.brandmaterial']
        },
        children: [
          {
            path: 'editor/:id?',
            component: () => import('@/view/brand/wechat/artical/new_artical')
          }
        ]
      }
    ]
  }
]

export default routes
