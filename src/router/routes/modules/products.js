import { BasicLayout } from '@/layout/basic' // 主框架

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'entity',
      icon: 'icon-products',
      keepAlive: true,
      title: '商品'
    },
    name: 'products',
    path: '/products',
    children: [
      {
        name: 'self-products',
        path: 'self-products',
        component: () => import('@/view/mall/goods/physical/list'),
        meta: {
          aliasName: 'goodsphysical',
          icon: 'icon-products',
          title: '自营商品',
          permissions: ['entity.goods.goodsphysical']
        },
        children: [
          {
            name: 'self-products_create',
            path: 'editor/:itemId?',
            component: () => import('@/view/goods/index'),
            meta: {
              title: '新增商品',
              hidden: true
            }
          },
          {
            name: 'self-products_stock-import',
            path: 'stock-import',
            component: () => import('@/view/mall/goods/physical/normalGoodsStoreUpload'),
            meta: {
              title: '库存导入',
              hidden: true
            }
          },
          {
            name: 'self-products_profit-sharing-import',
            path: 'profit-sharing-import',
            component: () => import('@/view/mall/goods/physical/normalGoodsProfitUpload'),
            meta: {
              title: '分润导入',
              hidden: true
            }
          },
          {
            name: 'self-products_product-import',
            path: 'product-import',
            component: () => import('@/view/mall/goods/physical/normalGoodsUpload'),
            meta: {
              title: '商品导入',
              hidden: true
            }
          }
        ]
      },
      {
        name: 'store-products',
        path: 'store-products',
        component: () => import('@/view/mall/storeshop/store-shop.standard'),
        meta: {
          aliasName: 'storeshopitemanagement',
          icon: 'icon-products',
          title: '店铺商品',
          permissions: ['entity.goods.storeshopitemanagement']
        }
      },
      {
        name: 'merchant-products',
        path: 'merchant-products',
        component: () => import('@/view/mall/goods/audit/list'),
        meta: {
          icon: 'icon-products',
          title: '商户商品'
        }
      },
      {
        name: 'merchant-products_edit',
        path: 'merchant-products/edtior:itemId?',
        component: () => import('@/view/mall/goods/audit/add'),
        meta: {
          icon: 'icon-products',
          title: '商品编辑',
          hidden: true
        }
      },
      {
        name: 'category',
        path: 'category',
        meta: {
          icon: 'icon-products',
          title: '商品分类'
        },
        children: [
          {
            name: 'sale-category',
            path: 'sale-category',
            component: () => import('@/view/goods/saleCategory'),
            meta: {
              title: '销售分类',
              permissions: ['entity.goodsgroup.goodsmaincategory']
            }
          },
          {
            path: 'management-category',
            name: 'management-category',
            component: () => import('@/view/goods/mainCategory'),
            meta: {
              title: '管理分类',
              permissions: ['entity.goodsgroup.goodscategory']
            }
          },
          {
            path: 'product-tag',
            name: 'product-tag',
            component: () => import('@/view/mall/goods/tags'),
            meta: {
              title: '商品标签',
              permissions: ['entity.goodsgroup.itemtags']
            }
          }
        ]
      },
      {
        name: 'base-config',
        path: 'base-config',
        meta: {
          icon: 'icon-products',
          title: '基础配置'
        },
        children: [
          {
            name: 'product-sku',
            path: 'product-sku',
            component: () => import('@/view/mall/goods/attributes/attributes'),
            meta: {
              title: '商品规格',
              permissions: ['entity.goodsbase.goodsattributes']
            }
          },
          {
            path: 'minimum-order-quantity',
            name: 'minimum-order-quantity',
            component: () => import('@/view/mall/goods/attributes/goodsattributes'),
            meta: {
              title: '起订量',
              permissions: ['entity.goodsbase.goodsstartnum']
            }
          },
          {
            path: 'product-brand',
            name: 'product-brand',
            component: () => import('@/view/mall/goods/attributes/brand'),
            meta: {
              title: '商品品牌',
              permissions: ['entity.goodsbase.goodsbrand']
            }
          },
          {
            path: 'product-params',
            name: 'product-params',
            component: () => import('@/view/mall/goods/attributes/params'),
            meta: {
              title: '商品参数',
              permissions: ['entity.goodsbase.goodsparams']
            }
          }
        ]
      }
    ]
  }
]

export default routes
