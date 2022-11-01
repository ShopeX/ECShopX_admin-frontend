import Home from '@/view/home'
import Layout from '@/view/layout'

/** 商品 **/
import goodsCategory from '@/view/mall/goods/category'
import serviceGoodsList from '@/view/mall/goods/service/index'
import serviceGoodsAdd from '@/view/mall/goods/service/items/add'
import physicalGoodsList from '@/view/mall/goods/physical/list'
import physicalGoodsAdd from '@/view/mall/goods/physical/add'
import physicalGoodsUpload from '@/view/mall/goods/physical/normalGoodsUpload'
import physicalGoodsBrand from '@/view/mall/goods/attributes/brand'

/** 订单 **/
// 交易单
import tradelist from '@/view/mall/trade/list'
// 服务订单列表
import orderlist from '@/view/mall/trade/order/list'
// 实体订单
import normalorderlist from '@/view/mall/trade/normalorders/list'
import verification from '@/view/mall/trade/salesmanWorkRecords'
// 订单详情
import orderdetail from '@/view/mall/trade/order/detail'
/** 运费模板 **/
import shippingtemplates from '@/view/mall/trade/shipping/templates'
import shippingtemplatesadd from '@/view/mall/trade/shipping/add'
/** 店铺 **/
import distributor from '@/view/mall/marketing/distributor'
import basicSetting from '@/view/mall/marketing/basicSetting'
import distributionOrders from '@/view/mall/marketing/distributionOrders'
import withdraw from '@/view/mall/marketing/withdraw'
import distributorGoods from '@/view/mall/marketing/surveillance'
import distributionLog from '@/view/mall/marketing/distributionLog'
import logByDistributor from '@/view/mall/marketing/logByDistributor'
import distributorItems from '@/view/mall/marketing/distributorItems'
import distributorRelItems from '@/view/mall/marketing/distributorRelItems'
import salesman from '@/view/mall/marketing/salesman'

/** 预约 **/
import reservationSetting from '@/view/mall/reservation/setting/index'
import resourceSettingIndex from '@/view/mall/reservation/resourcesetting/index'
import resourceSettingList from '@/view/mall/reservation/resourcesetting/list'
import resourceSettingAdd from '@/view/mall/reservation/resourcesetting/add'
import resourceSettingRecord from '@/view/mall/reservation/resourcesetting/reservation'

/** 储值 **/
import storedDeposit from '@/view/mall/storeddeposit/index'

/** 售后 **/
// 售后单列表
import aftersaleslist from '@/view/mall/aftersales/list'
// 售后单详情
import aftersalesdetail from '@/view/mall/aftersales/detail'

export default {
  path: '/mall',
  name: '商城',
  component: Home,
  meta: '4',
  children: [
    {
      path: '/mall',
      name: '商品',
      component: Layout,
      iconCls: 'shopping_basket',
      children: [
        { path: '/mall', component: serviceGoodsList, meta: '4', name: '服务类商品' },
        {
          path: '/mall/goods/service/items/add',
          component: serviceGoodsAdd,
          meta: '4',
          name: '添加服务类商品',
          hidden: true
        },
        {
          path: '/mall/goods/service/items/add/:itemId',
          component: serviceGoodsAdd,
          meta: '4',
          name: '编辑服务类商品',
          hidden: true
        },
        //{ path: '/mall/goods/scategory', component: Main, meta: '4', name: '服务类商品分类' },
        {
          path: '/mall/goods/physical',
          component: physicalGoodsList,
          meta: '4',
          name: '实体类商品'
        },
        {
          path: '/mall/goods/physical/add',
          component: physicalGoodsAdd,
          meta: '4',
          name: '添加商品',
          hidden: true
        },
        {
          path: '/mall/goods/physical/add/:itemId',
          component: physicalGoodsAdd,
          meta: '4',
          name: '编辑商品',
          hidden: true
        },
        { path: '/mall/goods/category', component: goodsCategory, meta: '4', name: '商品分类' },
        {
          path: '/mall/goods/physical/upload',
          component: physicalGoodsUpload,
          meta: '4',
          name: '实体商品导入'
        },
        //{ path: '/mall/goods/ecategory', component: Main, meta: '4', name: '实体类商品分类' },
        //{ path: '/mall/goods/import', component: Main, meta: '4', name: '商品导入' }
        { path: '/mall/goods/brand', component: physicalGoodsBrand, meta: '4', name: '商品品牌' }
      ]
    },
    {
      path: '/mall/trade',
      name: '订单',
      component: Layout,
      iconCls: 'assignment',
      children: [
        {
          path: '/mall/trade/normalorders',
          component: normalorderlist,
          meta: '4',
          name: '实体订单'
        },
        { path: '/mall/trade/service', component: orderlist, meta: '4', name: '服务订单' },
        {
          path: '/mall/trade/verification',
          component: verification,
          meta: '4',
          name: '服务核销单'
        },
        { path: '/mall/trade/payment', component: tradelist, meta: '4', name: '交易单' },
        {
          path: '/mall/trade/service/payment',
          component: tradelist,
          meta: '4',
          name: '服务交易单'
        },
        {
          path: '/mall/trade/order/detail',
          component: orderdetail,
          meta: '4',
          name: '订单详情',
          hidden: true
        },
        {
          path: '/mall/trade/shipping/templates',
          component: shippingtemplates,
          meta: '4',
          name: '运费模板'
        },
        {
          path: '/mall/trade/shipping/templates/add',
          component: shippingtemplatesadd,
          meta: '4',
          name: '添加运费模板',
          hidden: true
        },
        {
          path: '/mall/trade/shipping/templates/add/:templatesId',
          component: shippingtemplatesadd,
          meta: '4',
          name: '编辑运费模板',
          hidden: true
        }
      ]
    },
    {
      path: '/mall/aftersales',
      name: '售后',
      component: Layout,
      iconCls: 'assignment',
      children: [
        { path: '/mall/aftersales/list', component: aftersaleslist, meta: '4', name: '售后单列表' },
        {
          path: '/mall/aftersales/detail',
          component: aftersalesdetail,
          meta: '4',
          name: '售后单详情',
          hidden: true
        }
      ]
    },
    {
      path: '/mall/marketing',
      name: '店铺',
      component: Layout,
      iconCls: 'layers',
      children: [
        //{ path: '/mall/marketing', component: Main, meta: '4', name: '店铺概况' },
        {
          path: '/mall/marketing/basic_setting',
          component: basicSetting,
          meta: '4',
          name: '基础配置'
        },
        {
          path: '/mall/marketing/distributor',
          component: distributor,
          meta: '4',
          name: '店铺管理'
        },
        {
          path: '/mall/marketing/distributor/items',
          component: distributorItems,
          meta: '4',
          name: '店铺商品管理',
          hidden: true
        },
        {
          path: '/mall/marketing/distributor/rel_items',
          component: distributorRelItems,
          meta: '4',
          name: '店铺关联商品'
        },
        {
          path: '/mall/marketing/distributor/log',
          component: logByDistributor,
          meta: '4',
          name: '商家店铺记录',
          hidden: true
        },
        //{ path: '/mall/marketing/surveillance', component: distributorGoods, meta: '4', name: '店铺二维码' },
        { path: '/mall/marketing/log', component: distributionLog, meta: '4', name: '店铺记录' },
        {
          path: '/mall/marketing/distribution_orders',
          component: normalorderlist,
          meta: '4',
          name: '店铺订单'
        },
        { path: '/mall/marketing/salesman', component: salesman, name: '导购员列表' }
        //{ path: '/mall/marketing/withdraw', component: withdraw, meta: '4', name: '提现申请' }
      ]
    },
    {
      path: '/mall/reservation',
      name: '预约',
      component: Layout,
      iconCls: 'date_range',
      children: [
        { path: '/mall/reservation', component: resourceSettingIndex, meta: '4', name: '预约管理' },
        {
          path: '/mall/reservation/resourcesetting/list',
          component: resourceSettingList,
          meta: '4',
          name: '资源位列表',
          hidden: true
        },
        {
          path: '/mall/reservation/resourcesetting/add',
          component: resourceSettingAdd,
          meta: '4',
          name: '资源位添加',
          hidden: true
        },
        {
          path: '/mall/reservation/setting',
          component: reservationSetting,
          meta: '4',
          name: '预约设置'
        },
        {
          path: '/mall/reservation/order',
          component: resourceSettingRecord,
          meta: '4',
          name: '预约单'
        }
      ]
    },
    {
      path: '/mall/recharge',
      name: '储值',
      component: Layout,
      iconCls: 'account_balance_wallet',
      children: [
        { path: '/mall/recharge', component: storedDeposit, meta: '4', name: '会员账户储值' }
        //{ path: '/mall/recharge/gift', component: Main, meta: '4', name: '礼品卡' }
      ]
    }
  ]
}
