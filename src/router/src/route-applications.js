// 商品路由
const name = '应用'
import Layout from '@/view/layout' // 主框架
import SubLayout from '@/view/sublayout' //

export default {
  path: '/applications',
  component: Layout,
  children: [
    {
      path: 'adapay/adapay_trades',
      name: '分账明细',
      component: () => import('@/view/mall/sub_account/sub_account'),
      children: [
        {
          path: 'detail/:order_id',
          component: () => import('@/view/mall/sub_account/detail')
        }
      ]
    },
    {
      path: 'adapay/adapay_cash',
      name: '提现',
      component: () => import('@/view/mall/withdraw/withdraw')
    },
    {
      path: 'adapay/adapay_cash_setting',
      name: '提现设置',
      component: () => import('@/view/mall/withdraw/withdraw_setting.vue')
    },
    {
      path: 'adapay/adapay_merchant_info',
      name: `开户信息`,
      component: () => import('@/view/mall/accountopeninfo')
    },
    {
      path: 'adapay/adapay_member_audit',
      name: `开户审批`,
      component: () => import('@/view/mall/marketing/openingapproval'),
      children: [
        {
          path: 'approve/:id?',
          component: () => import('@/view/mall/marketing/openingapproval/approve')
        }
      ]
    },
    {
      path: 'adapay/adapay_merchant',
      name: '商户设置',
      component: () => import('@/view/base/setting/dealer'),
      children: [
        {
          path: '/',
          component: () => import('@/view/base/setting/dealer/account_info')
        },
        {
          path: 'picture',
          component: () => import('@/view/base/setting/dealer/upload_picture')
        },
        {
          path: 'pay_setting',
          component: () => import('@/view/base/setting/dealer/pay_setting')
        },
        {
          path: 'netin',
          component: () => import('@/view/base/setting/dealer/netin')
        }
      ]
    },
    {
      path: 'jfmall/jfgoods',
      name: `商品管理`,
      component: () => import('@/view/applications/pointmall/list'),
      children: [
        {
          path: 'editor/:itemId?',
          component: () => import('@/view/applications/pointmall/add')
        },
        {
          path: 'physicalupload',
          name: `实体商品导入`,
          component: () => import('@/view/applications/pointmall/goodsImport')
        },
        {
          path: 'physicalstoreupload',
          name: `商品库存导入`,
          component: () => import('@/view/applications/pointmall/storeImport')
        }
      ]
    },
    {
      path: 'jfmall/jforders',
      name: `实物订单`,
      component: () => import('@/view/applications/pointmall/orderList'),
      children: [
        {
          path: 'detail/:itemId?',
          component: () => import('@/view/applications/pointmall/orderDetail')
        }
      ]
    },
    {
      path: 'jfmall/jfsetting',
      name: `基础设置`,
      component: () => import('@/view/applications/pointmall/setting')
    },
    {
      path: 'appsgroup/extapp',
      name: `扩展应用`,
      component: () => import('@/view/applications/plugin'),
      children: [
        {
          path: 'detail/:id?',
          component: () => import('@/view/applications/plugin/appDetail.vue')
        }
      ]
    },
    {
      path: 'bspay/user_audit',
      name: `用户进件审批`,
      component: () => import('@/view/mall/marketing/huifuBspay'),
      children: [
        {
          path: 'approve/:id?',
          component: () => import('@/view/mall/marketing/huifuBspay/approve')
        }
      ]
    },
    {
      path: 'bspay/trades',
      name: '分账明细',
      component: () => import('@/view/mall/bspay_sub_account/sub_account'),
      children: [
        {
          path: 'detail/:order_id',
          component: () => import('@/view/mall/bspay_sub_account/detail')
        }
      ]
    },
    {
      path: 'ec/purchaseactivity',
      name: `员工内购`,
      component: SubLayout,
      children: [
        {
          path: '/',
          component: () => import('@/view/marketing/employee/list')
        },
        {
          path: 'create/:id?',
          component: () => import('@/view/marketing/employee/purchase')
        },
        {
          path: 'result/:id',
          component: () => import('@/view/marketing/employee/result')
        },
        {
          path: 'goods/:id',
          component: () => import('@/view/marketing/employee/addGoods')
        },
        {
          path: 'dependents/:id',
          component: () => import('@/view/marketing/employee/dependents')
        }
      ]
      // component: () => import('@/view/member/promotions/purchase/index'),
      // children: [
      //   {
      //     path: 'editor',
      //     component: () => import('@/view/member/promotions/purchase/editor')
      //   },
      //   {
      //     path: 'detail',
      //     component: () => import('@/view/member/promotions/purchase/detail')
      //   },
      //   {
      //     path: 'dependents',
      //     component: () => import('@/view/member/promotions/purchase/dependents')
      //   }
      // ]
    },
    {
      path: 'ec/employee',
      name: '员工管理',
      component: () => import('@/view/member/purchase/employee'),
      children: [
        {
          path: 'import',
          name: `白名单导入`,
          component: () => import('@/view/member/purchase/employeeImport')
        }
      ]
    },
    {
      path: 'ec/company',
      name: '企业管理',
      component: () => import('@/view/member/purchase/company')
    },
    {
      path: 'ec/purchaseorder',
      name: `内购订单`,
      component: () => import('@/view/order/entitytrade/purchase'),
      children: [
        {
          path: 'detail/:itemId?',
          component: () => import('@/view/mall/trade/order/detail'),
          meta: {
            footerFixed: true
          }
        },
        {
          path: 'process/:itemId?',
          component: () => import('@/view/mall/trade/order/process')
        },
        {
          path: 'after-sale/:id?',
          component: () => import('@/view/mall/trade/order/afterSale')
        },
        {
          path: 'logistics/:itemId?',
          component: () => import('@/view/mall/trade/order/logistics')
        }
      ]
    },
    {
      path: 'guide/workwechat',
      name: `企业微信设置`,
      component: () => import('@/view/base/setting/workwechat/workwechat')
    },
    {
      path: 'guide/salespersonshelfindex',
      name: `导购货架首页`,
      component: () => import('@/view/wxapp/salespersonshelfindex')
    },
    {
      path: 'community/tradecommunityorders',
      name: `社区团购订单`,
      component: () => import('@/view/mall/trade/normalorders/communityList'),
      children: [
        {
          path: 'detail/:itemId?',
          component: () => import('@/view/mall/trade/order/detail')
        },
        {
          path: 'process/:itemId?',
          component: () => import('@/view/mall/trade/order/process')
        }
      ]
    },
    {
      path: 'community/communitysetting',
      name: `基础配置`,
      component: () => import('@/view/member/promotions/community/setting')
    },
    {
      path: 'community/marketingcommunity',
      name: `社区管理`,
      component: () => import('@/view/member/promotions/community/index'),
      children: [
        {
          path: 'editor/:community_id?',
          component: () => import('@/view/member/promotions/community/add')
        },
        {
          path: 'detail',
          meta: {
            title: `${name}-社区活动-社区管理-详情`
          },
          component: () => import('@/view/member/promotions/community/points')
        }
      ]
    },
    {
      path: 'community/marketingcommunityactivity',
      name: `活动管理`,
      component: () => import('@/view/member/promotions/community/activity/index'),
      children: [
        {
          path: 'editor/:activity_id?',
          component: () => import('@/view/member/promotions/community/activity/add')
        }
      ]
    },
    {
      path: 'community/marketingdeliveryorder',
      name: `配送单`,
      component: () => import('@/view/member/promotions/community/deliveryorder'),
      children: [
        {
          path: 'detail/:delivery_id?',
          component: () => import('@/view/member/promotions/community/deliverydetail')
        }
      ]
    },
    {
      path: 'community/communitywithdraw',
      name: `积分提现`,
      component: () => import('@/view/member/promotions/community/withdraw')
    },
    {
      path: 'community/communityactivityorder',
      name: `社区订单`,
      component: () => import('@/view/member/promotions/community/activity/orderList'),
      children: [
        {
          path: 'detail',
          component: () => import('@/view/mall/trade/order/detail')
        }
      ]
    },
    {
      path: 'community/chief',
      name: `团长管理`,
      component: () => import('@/view/mall/community/chief'),
      children: [
        {
          path: 'detail/:apply_id',
          component: () => import('@/view/mall/community/chiefDetail')
        },
        {
          path: 'info/:apply_id/:distributor_id',
          component: () => import('@/view/mall/community/chiefInfo')
        },
        {
          path: 'approve',
          component: () => import('@/view/mall/community/chiefApprove')
        }
      ]
    },
    {
      path: 'community/activity',
      name: `活动管理`,
      component: () => import('@/view/mall/community/activityList')
    },
    {
      path: 'community/communitygoods',
      name: `活动商品`,
      component: () => import('@/view/mall/community/communitygoods')
    },
    {
      path: 'community/order',
      name: `订单管理`,
      component: () => import('@/view/mall/trade/normalorders/communityList'),
      children: [
        {
          path: 'detail/:itemId?',
          component: () => import('@/view/mall/trade/order/detail')
        },
        {
          path: 'process/:itemId?',
          component: () => import('@/view/mall/trade/order/process')
        }
      ]
    },
    {
      path: 'community/setting',
      name: `活动配置`,
      component: () => import('@/view/mall/community/setting')
    },
    {
      path: 'community/subdistrict',
      name: '街道社区配置',
      component: () => import('@/view/mall/subdistrict/list')
    },
    {
      path: 'community/achievement',
      name: `团长业绩`,
      component: () => import('@/view/mall/community/achievement')
    },
    {
      path: 'community/withdraw',
      name: `提现申请`,
      component: () => import('@/view/mall/community/withdraw')
    },
    {
      path: 'community/adapay_cash',
      name: '提现',
      component: () => import('@/view/mall/withdraw/withdraw')
    },
    {
      path: 'community/subdistrict',
      name: '街道社区配置',
      component: () => import('@/view/mall/subdistrict/list')
    },
    {
      path: 'community/chiefupload',
      name: `团长导入`,
      component: () => import('@/view/member/members/upload_chief')
    }
  ]
}
