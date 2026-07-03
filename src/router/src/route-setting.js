/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Layout from '@/view/layout' // 主框架

export default {
  path: '/setting',
  component: Layout,
  children: [
    {
      path: 'staff/staffleader',
      name: 'b51bc270.878047',
      component: () => import('@/view/base/shopstaff/salesperson/leaderlist')
    },
    {
      path: 'staff/Merchantstaff',
      name: 'b51bc270.0f2f5b',
      component: () => import('@/view/base/account/storestaff')
    },
    {
      path: 'staff/storemanager',
      name: 'b51bc270.ebea9e',
      component: () => import('@/view/mall/marketing/merchantAccount')
    },
    {
      path: 'staff/Merchantstaffroles',
      name: 'b51bc270.910b4e',
      component: () => import('@/view/base/account/storeroles')
    },
    {
      path: 'delivery/logistics',
      name: 'b51bc270.eb6d92',
      component: () => import('@/views/settings/deliverySettings/logistics/index'),
      children: [
        {
          path: 'addziti/:id?',
          component: () => import('@/views/settings/deliverySettings/logistics/add-ziti'),
          beforeEnter: ({ params, meta }, from, next) => {
            meta.title = params.id ? 'b51bc270.f36bc9' : 'b51bc270.57eecc'
            next()
          }
        }
      ]
    },
    {
      path: 'delivery/shippingtemplates',
      name: 'b51bc270.416fd4',
      component: () => import('@/view/mall/trade/shipping/templates'),
      children: [
        {
          path: 'editor/:itemId?',
          component: () => import('@/view/mall/trade/shipping/add')
        }
      ]
    },
    {
      path: 'delivery/kdniao',
      name: 'b51bc270.d7bebc',
      component: () => import('@/view/base/setting/kdniao')
    },
    {
      path: 'delivery/sfbsp',
      name: 'b51bc270.8b8dc6',
      component: () => import('@/view/base/setting/sfbsp')
    },
    {
      path: 'delivery/selfdeliverystaff',
      name: 'b51bc270.3f12ff',
      component: () => import('@/views/settings/deliverySettings/delivery-management')
    },
    {
      path: 'delivery/deliverystaffstatistics',
      name: `deliverystaffstatistics`,
      meta: {
        title: 'b51bc270.7388cf'
      },
      component: () =>
        import(
          /* webpackChunkName: "companydata-memberstatistics" */ '@/view/mall/datacube/companydata/delivery'
        )
    },
    {
      path: 'delivery/dada',
      name: 'b51bc270.52ec0e',
      component: () => import('@/view/mall/distribution/account')
    },
    {
      path: 'staff/Platformstaff',
      name: 'b51bc270.341f65',
      component: () => import('@/view/base/account/normalstaff')
    },
    {
      path: 'staff/Platformstaffroles',
      name: 'b51bc270.30a44c',
      component: () => import('@/view/base/account/normalroles')
    },
    {
      path: 'staff/dealer_list',
      name: 'b51bc270.4571aa',
      component: () => import('@/view/mall/marketing/dealer'),
      children: [
        {
          path: 'detail/:id?',
          component: () => import('@/view/mall/marketing/dealer/detail')
        },
        {
          path: 'storelist/:id?',
          component: () => import('@/view/mall/marketing/dealer/storelist')
        },
        {
          path: 'relation/:id?',
          component: () => import('@/view/mall/marketing/dealer/relationstorelist')
        }
      ]
    },
    {
      path: 'offlineAccount',
      name: 'b51bc270.606c99',
      component: () => import('@/view/base/setting/offlineAccount')
    },
    {
      path: 'shopexerp',
      name: `shopexerp`,
      component: () => import('@/view/base/setting/shopexerp')
    },
    {
      path: 'dataAnalysis',
      name: 'b51bc270.783fc5',
      component: () => import('@/view/base/setting/dataAnalysis')
    },

    /** 系统配置 */
    {
      path: 'systemsetting/publicsetting',
      name: 'b51bc270.91a229',
      component: () => import('@/view/base/setting/publicsetting')
    },
    {
      path: 'systemsetting/invoinceConfiguration',
      name: 'b51bc270.1275c1',
      component: () => import('@/view/financial/invoice/baiSetting')
    },
    {
      path: 'GoodsShareSetting',
      name: 'b51bc270.029c35',
      component: () => import('@/view/base/setting/goodsShareSetting')
    },
    {
      path: 'systemsetting/certificate',
      name: 'b51bc270.e5549d',
      component: () => import('@/view/base/setting/certificate/index')
    },
    {
      path: 'ShangPai/usercenter',
      name: '商派用户中心',
      component: () => import('@/views/settings/systemConfig/ShangPai-usercenter')
    },
    {
      path: 'systemsetting/wdtSetting',
      name: 'b51bc270.a891b2',
      component: () => import('@/views/settings/systemConfig/wdtSetting')
    },
    {
      path: 'systemsetting/jstSetting',
      name: 'b51bc270.318bb2',
      component: () => import('@/views/settings/systemConfig/jstSetting')
    },
    {
      path: 'systemsetting/assetpayment',
      name: 'b51bc270.1c3835',
      component: () => import('@/view/base/setting/payment')
    },
    {
      path: 'systemsetting/datamessage',
      name: 'b51bc270.ffa488',
      component: () => import('@/view/base/shortmessage/index'),
      children: [
        {
          path: 'ali_sms',
          name: 'aliSms',
          component: () => import('@/views/settings/systemConfig/smsService/ali_sms'),
          children: [
            {
              path: '/',
              name: 'b51bc270.b6453a',
              meta: 'base_config',
              component: () => import('@/views/settings/systemConfig/smsService/base_config')
            },
            {
              path: 'send_sms',
              name: 'b51bc270.2d7288',
              meta: 'send_sms',
              component: () => import('@/views/settings/systemConfig/smsService/send_sms')
            },
            {
              path: 'sms_signatures',
              name: 'b51bc270.f32c04',
              component: () => import('@/views/settings/systemConfig/smsService/sms_signatures'),
              meta: 'sms_signatures',
              children: [
                {
                  path: 'edit',
                  component: () =>
                    import('@/views/settings/systemConfig/smsService/sms_signatures_edit'),
                  meta: 'sms_signatures'
                }
              ]
            },
            {
              path: 'sms_template',
              name: 'b51bc270.dbe8ba',
              component: () => import('@/views/settings/systemConfig/smsService/sms_template'),
              meta: 'sms_template',
              children: [
                {
                  path: 'edit',
                  component: () =>
                    import('@/views/settings/systemConfig/smsService/sms_template_edit'),
                  meta: 'sms_template'
                }
              ]
            },
            {
              path: 'sms_sendLog',
              name: 'b51bc270.dabdd1',
              component: () => import('@/views/settings/systemConfig/smsService/sms_sendLog'),
              meta: 'sms_sendLog'
            },
            {
              path: 'sms_MassLog',
              name: 'b51bc270.28cf8d',
              component: () => import('@/views/settings/systemConfig/smsService/sms_MassLog'),
              meta: 'sms_MassLog',
              children: [
                {
                  path: 'edit',
                  component: () =>
                    import('@/views/settings/systemConfig/smsService/sms_MassLog_edit'),
                  meta: 'sms_MassLog'
                }
              ]
            }
          ]
        },
        {
          path: 'shopex_sms',
          name: 'b51bc270.67fc96',
          component: () => import('@/views/settings/systemConfig/smsService/shopex_sms')
        }
      ]
    },
    {
      path: 'systemsetting/mapsetting',
      name: 'b51bc270.5e6abb',
      component: () => import('@/view/base/setting/mapsetting')
    },
    {
      path: 'systemsetting/Yilianyun',
      name: 'b51bc270.bf34e4',
      component: () => import('@/views/settings/systemConfig/yilianyun/index')
    },
    {
      path: 'systemsetting/ugctpos',
      name: 'b51bc270.b28ada',
      component: () => import('@/views/settings/systemConfig/ugcTPOS')
    },
    {
      path: 'systemsetting/wxaindex',
      name: 'b51bc270.10aa76',
      component: () => import('@/view/wxapp/wxappmanage/list')
    },
    {
      path: 'systemsetting/brand',
      name: 'b51bc270.cbf7c8',
      component: () => import('@/view/brand/wechat/open')
    },
    {
      path: 'systemsetting/editdashboard',
      name: 'b51bc270.6450d8',
      component: () => import('@/view/wxapp/statistics/dataanalysis/index')
    },
    {
      path: 'systemsetting/editsourcemanagement',
      name: 'b51bc270.21058f',
      component: () => import('@/view/wxapp/statistics/sourcemanagement/index'),
      children: [
        {
          path: 'detail/:monitorId?',
          component: () => import('@/view/wxapp/statistics/sourcemanagement/monito_detail')
        }
      ]
    },
    {
      path: 'systemsetting/noticemessage',
      name: 'b51bc270.d1d4c3',
      component: () => import('@/view/wxapp/messages')
    },
    {
      path: 'systemsetting/wxappchat',
      name: 'b51bc270.107a88',
      component: () => import('@/view/base/setting/im/wxappchat')
      // component: () => import('@/view/brand/wechat/wxapp')
    },
    {
      path: 'systemsetting/echat',
      name: 'b51bc270.e66efe',
      component: () => import('@/view/base/setting/im/echat')
    },
    {
      path: 'systemsetting/meiqia',
      name: 'b51bc270.7ef177',
      component: () => import('@/view/site/meiqia')
    },
    {
      path: 'systemsetting/brandcustomer',
      name: 'b51bc270.488ac4',
      component: () => import('@/view/brand/wechat/customservice')
    },
    {
      path: 'systemsetting/wdtSetting',
      name: 'b51bc270.152925',
      component: () => import('@/views/settings/systemConfig/wdtSetting')
    },
    {
      path: 'systemsetting/jstSetting',
      name: 'b51bc270.deb133',
      component: () => import('@/views/settings/systemConfig/jstSetting')
    },
    {
      path: 'systemsetting/certificate',
      name: 'b51bc270.e5549d',
      component: () => import('@/view/base/setting/certificate/index')
    },
    {
      path: 'ShangPai/usercenter',
      name: '商派用户中心',
      component: () => import('@/views/settings/systemConfig/ShangPai-usercenter')
    },
    {
      path: 'systemsetting/damoCrm',
      name: 'b51bc270.a21aa1',
      component: () => import('@/view/base/setting/damoCrm/index')
    },
    {
      path: 'systemsetting/domain_setting',
      name: 'b51bc270.93c728',
      component: () => import('@/view/base/setting/companys/domain')
    },
    {
      path: 'systemsetting/approve',
      name: 'b51bc270.1fb869',
      component: () => import('@/views/settings/systemConfig/encrypt/authAdmin.vue')
    },
    {
      path: 'systemsetting/apply',
      name: 'b51bc270.18dbfa',
      component: () => import('@/view/base/setting/authorityapproval'),
      children: [
        {
          path: 'approve/:id?',
          component: () => import('@/view/base/setting/authorityapproval/approve')
        }
      ]
    },
    {
      path: 'systemsetting/extminilink',
      name: 'b51bc270.83c5fa',
      component: () => import('@/view/base/wxa/extMiniLink'),
      children: [
        {
          path: 'editor',
          name: 'b51bc270.3ddd64',
          component: () => import('@/view/base/wxa/extMiniLinkDetail')
        }
      ]
    },
    {
      path: 'systeminfo/agreement',
      name: 'b51bc270.c94c15',
      component: () => import('@/view/base/setting/agreement')
    },
    /** 系统配置 */

    {
      path: 'openapi',
      name: 'b51bc270.4f8798',
      component: () => import('@/view/base/setting/opendev/index')
    },
    {
      path: 'Regionauth',
      name: 'b51bc270.c2a469',
      component: () => import('@/view/regionauth/list')
    },

    {
      path: 'GoodsShareSetting',
      name: 'b51bc270.029c35',
      component: () => import('@/view/base/setting/goodsShareSetting')
    },

    {
      path: 'systemsetting/basecurrency',
      name: 'b51bc270.f68fc6',
      component: () => import('@/view/base/currency/index')
    },
    {
      path: 'systeminfo/assetaccountactivation',
      name: 'b51bc270.647339',
      component: () => import('@/view/base/asset/accountactivation/index')
    },
    {
      path: 'systeminfo/operatorlogs',
      name: 'b51bc270.cda84b',
      component: () => import('@/views/settings/systemInfo/operation-log')
    },
    {
      path: 'omsqueuelog',
      name: 'b51bc270.930384',
      component: () => import('@/view/mall/trade/omsqueuelog')
    },
    {
      path: 'menumanage/shopmenus',
      name: 'b51bc270.93b9ef',
      component: () => import('@/view/menus/shopmenu')
    },
    {
      path: 'menumanage/merchantmenu',
      name: 'b51bc270.9d25eb',
      component: () => import('@/view/menus/merchantmenu')
    },
    {
      path: 'menumanage/suppliermenus',
      name: 'b51bc270.b59806',
      component: () => import('@/view/menus/supplier')
    },
    {
      path: 'menumanage/distributormenu',
      name: 'b51bc270.470a9d',
      component: () => import('@/view/menus/distributormenu')
    },
    {
      path: 'adapay_merchant',
      name: 'b51bc270.eee869',
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
      path: 'adapay_cash_setting',
      name: 'b51bc270.b33aa1',
      component: () => import('@/view/mall/withdraw/withdraw_setting.vue')
    }
  ]
}
