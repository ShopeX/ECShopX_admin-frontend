// 会员路由
const name = '积分商城'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/pointsmall',
  component: Layout,
  children: [
    {
      path: 'pointsmallgoods/pointsmallphysical',
      name: `商品管理`,
      component: () => import('@/view/mall/pointsmallgoods/physical/list'),
      children: [
        {
          path: 'editor/:itemId?',
          component: () => import('@/view/mall/pointsmallgoods/physical/add')
        },
        {
          path: 'physicalupload',
          name: `实体商品导入`,
          component: () => import('@/view/mall/pointsmallgoods/physical/normalGoodsUpload')
        },
        {
          path: 'physicalstoreupload',
          name: `商品库存导入`,
          component: () => import('@/view/mall/pointsmallgoods/physical/normalGoodsStoreUpload')
        },
      ]
    },
    {
      path: 'pointsmallgoods/pointsmallmaincategory',
      name: `商品管理分类`,
      component: () => import('@/view/mall/pointsmallgoods/maincategory')
    },
    {
      path: 'pointsmallgoods/pointsmallcategory',
      name: `商品分类`,
      component: () => import('@/view/mall/pointsmallgoods/category')
    },
    {
      path: 'pointsmallgoods/pointsmallattributes',
      name: `商品规格`,
      component: () => import('@/view/mall/pointsmallgoods/attributes/attributes')
    },
    {
      path: 'pointsmallgoods/pointsmallparams',
      name: `商品参数`,
      component: () => import('@/view/mall/pointsmallgoods/attributes/params')
    },
    {
      path: 'pointsmallgoods/pointsmallbrand',
      name: `商品品牌`,
      component: () => import('@/view/mall/pointsmallgoods/attributes/brand')
    },
    {
      path: 'pointsmallgoods/pointsmallrate',
      name: `商品评价`,
      component: () => import('@/view/mall/pointsmalltrade/rate/list')
    },
    {
      path: 'order/pointsmallenormalorders',
      name: `实物订单`,
      component: () => import('@/view/mall/pointsmalltrade/normalorders/list'),
      children: [
        {
          path: 'detail/:itemId?',
          component: () => import('@/view/mall/pointsmalltrade/order/detail')
        }
      ]
    },
    {
      path: 'setting/pointsmallsetting',
      name: `基础设置`,
      component: () => import('@/view/mall/pointsmallsetting/index')
    },
    {
      path: 'setting/templatesetting',
      name: `模版设置`,
      component: () => import('@/view/mall/templatesetting')
    }
  ]
}
