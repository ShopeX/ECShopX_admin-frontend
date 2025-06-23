// 会员路由
const name = '设置'
import Layout from '@/view/layout' // 主框架

export default {
  path: '/setting',
  component: Layout,
  children: [
    {
      path: 'staff/staffleader',
      name: `账号管理-门店管理员`,
      component: () => import('@/view/base/shopstaff/salesperson/leaderlist')
    },
    {
      path: 'staff/Merchantstaff',
      name: `账号管理-店铺管理员`,
      component: () => import('@/view/base/account/storestaff')
    },
    {
      path: 'staff/storemanager',
      name: `账号管理-商户账号管理`,
      component: () => import('@/view/mall/marketing/merchantAccount')
    },
    {
      path: 'staff/Merchantstaffroles',
      name: `账号管理-店铺员工角色`,
      component: () => import('@/view/base/account/storeroles')
    },
    {
      path: 'delivery/logistics',
      name: `物流公司`,
      component: () => import('@/view/mall/trade/logistics/index'),
      children: [
        {
          path: 'addziti/:id?',
          component: () => import('@/view/mall/trade/logistics/add-ziti'),
          beforeEnter: ({ params, meta }, from, next) => {
            meta.title = params.id ? '编辑自提点' : '新增自提点'
            next()
          }
        }
      ]
    },
    {
      path: 'delivery/shippingtemplates',
      name: `运费模板`,
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
      name: `快递跟踪配置`,
      component: () => import('@/view/base/setting/kdniao')
    },
    {
      path: 'delivery/sfbsp',
      name: `顺丰物流跟踪设置`,
      component: () => import('@/view/base/setting/sfbsp')
    },
    {
      path: 'delivery/selfdeliverystaff',
      name: `账号管理-店铺配送员`,
      component: () => import('@/view/base/account/delivery')
    },
    {
      path: 'delivery/deliverystaffstatistics',
      name: `deliverystaffstatistics`,
      meta: {
        title: `${name}-配送员业绩`
      },
      component: () =>
        import(
          /* webpackChunkName: "companydata-memberstatistics" */ '@/view/mall/datacube/companydata/delivery'
        )
    },
    {
      path: 'delivery/dada',
      name: `达达账户`,
      component: () => import('@/view/mall/distribution/account')
    },
    {
      path: 'staff/Platformstaff',
      name: `账号管理-平台管理员`,
      component: () => import('@/view/base/account/normalstaff')
    },
    {
      path: 'staff/Platformstaffroles',
      name: `账号管理-平台角色`,
      component: () => import('@/view/base/account/normalroles')
    },
    {
      path: 'staff/dealer_list',
      name: `账号管理-经销商管理`,
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
      name: `线下收款账户`,
      component: () => import('@/view/base/setting/offlineAccount')
    },
    {
      path: 'shopexerp',
      name: `shopexerp`,
      component: () => import('@/view/base/setting/shopexerp')
    },
    {
      path: 'dataAnalysis',
      name: `数据分析配置`,
      component: () => import('@/view/base/setting/dataAnalysis')
    },

    /** 系统配置 */
    {
      path: 'systemsetting/publicsetting',
      name: `通用设置`,
      component: () => import('@/view/base/setting/publicsetting')
    },
    {
      path: 'GoodsShareSetting',
      name: `商品分享设置`,
      component: () => import('@/view/base/setting/goodsShareSetting')
    },
    {
      path: 'systemsetting/certificate',
      name: `商派ERP`,
      component: () => import('@/view/base/setting/certificate/index')
    },
    {
      path: 'systemsetting/wdtSetting',
      name: `旺店通ERP`,
      component: () => import('@/view/base/setting/saaserp/wdtSetting')
    },
    {
      path: 'systemsetting/jstSetting',
      name: '聚水潭ERP',
      component: () => import('@/view/base/setting/saaserp/jstSetting')
    },
    {
      path: 'systemsetting/assetpayment',
      name: `支付配置`,
      component: () => import('@/view/base/setting/payment')
    },
    {
      path: 'systemsetting/datamessage',
      name: `短信服务`,
      component: () => import('@/view/base/shortmessage/index'),
      children: [
        {
          path: 'ali_sms',
          name: '阿里短信',
          component: () => import('@/view/base/shortmessage/ali_sms'),
          children: [
            {
            path: '/',
              name: '基础配置',
              meta: 'base_config',
              component: () => import('@/view/base/shortmessage/cpn/base_config')
            },
            {
              path: 'send_sms',
              name: '发送短信',
              meta: 'send_sms',
              component: () => import('@/view/base/shortmessage/cpn/send_sms')
            },
            {
              path: 'sms_signatures',
              name: '短信签名',
              component: () => import('@/view/base/shortmessage/cpn/sms_signatures'),
              meta: 'sms_signatures',
              children: [
                {
                  path: 'edit',
                  component: () => import('@/view/base/shortmessage/cpn/sms_signatures_edit'),
                  meta: 'sms_signatures'
                }
              ]
            },
            {
              path: 'sms_template',
              name: '短信模板',
              component: () => import('@/view/base/shortmessage/cpn/sms_template'),
              meta: 'sms_template',
              children: [
                {
                  path: 'edit',
                  component: () => import('@/view/base/shortmessage/cpn/sms_template_edit'),
                  meta: 'sms_template'
                }
              ]
            },
            {
              path: 'sms_sendLog',
              name: '短信发送记录',
              component: () => import('@/view/base/shortmessage/cpn/sms_sendLog'),
              meta: 'sms_sendLog'
            },
            {
              path: 'sms_MassLog',
              name: '短信群发送记录',
              component: () => import('@/view/base/shortmessage/cpn/sms_MassLog'),
              meta: 'sms_MassLog',
              children: [
                {
                  path: 'edit',
                  component: () => import('@/view/base/shortmessage/cpn/sms_MassLog_edit'),
                  meta: 'sms_MassLog'
                }
              ]
            }
          ]
        },
        {
          path: 'shopex_sms',
          name: '商派短信',
          component: () => import('@/view/base/shortmessage/shopex_sms')
        }
      ]
    },
    {
      path: 'systemsetting/mapsetting',
      name: `地图服务`,
      component: () => import('@/view/base/setting/mapsetting')
    },
    {
      path: 'systemsetting/Yilianyun',
      name: `小票打印`,
      component: () => import('@/view/base/setting/yilianyun/index')
    },
    {
      path: 'systemsetting/ugctpos',
      name: `UGC审核配置`,
      component: () => import('@/view/member/ugc/ugcTPOS')
    },
    {
      path: 'systemsetting/wxaindex',
      name: `小程序管理`,
      component: () => import('@/view/wxapp/wxappmanage/list')
    },
    {
      path: 'systemsetting/brand',
      name: `公众号授权`,
      component: () => import('@/view/brand/wechat/open')
    },
    {
      path: 'systemsetting/editdashboard',
      name: `数据分析`,
      component: () => import('@/view/wxapp/statistics/dataanalysis/index')
    },
    {
      path: 'systemsetting/editsourcemanagement',
      name: `千人千码`,
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
      name: `消息通知`,
      component: () => import('@/view/wxapp/messages')
    },
    {
      path: 'systemsetting/wxappchat',
      name: `小程序客服`,
      component: () => import('@/view/base/setting/im/wxappchat')
      // component: () => import('@/view/brand/wechat/wxapp')
    },
    {
      path: 'systemsetting/echat',
      name: `一洽客服`,
      component: () => import('@/view/base/setting/im/echat')
    },
    {
      path: 'systemsetting/meiqia',
      name: `美洽客服`,
      component: () => import('@/view/site/meiqia')
    },
    {
      path: 'systemsetting/brandcustomer',
      name: `客服-微信客服`,
      component: () => import('@/view/brand/wechat/customservice')
    },
    {
      path: 'systemsetting/wdtSetting',
      name: `旺店通`,
      component: () => import('@/view/base/setting/saaserp/wdtSetting')
    },
    {
      path: 'systemsetting/jstSetting',
      name: '聚水潭',
      component: () => import('@/view/base/setting/saaserp/jstSetting')
    },
    {
      path: 'systemsetting/certificate',
      name: `商派ERP`,
      component: () => import('@/view/base/setting/certificate/index')
    },
    {
      path: 'systemsetting/domain_setting',
      name: `域名设置`,
      component: () => import('@/view/base/setting/companys/domain')
    },
    {
      path: 'systemsetting/approve',
      name: '脱敏数据申请',
      component: () => import('@/view/base/encrypt/authAdmin.vue')
    },
    {
      path: 'systemsetting/apply',
      name: `脱敏申请审批`,
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
      name: `外部小程序配置`,
      component: () => import('@/view/base/wxa/extMiniLink'),
      children: [
        {
          path: 'editor',
          name: '外部小程序配置-页面路径',
          component: () => import('@/view/base/wxa/extMiniLinkDetail')
        }
      ]
    },
    {
      path: 'systeminfo/agreement',
      name: '软件使用协议',
      component: () => import('@/view/base/setting/agreement')
    },
    /** 系统配置 */

    {
      path: 'openapi',
      name: `开发接口配置`,
      component: () => import('@/view/base/setting/opendev/index')
    },
    {
      path: 'Regionauth',
      name: `区域管理`,
      component: () => import('@/view/regionauth/list')
    },

    {
      path: 'GoodsShareSetting',
      name: `商品分享设置`,
      component: () => import('@/view/base/setting/goodsShareSetting')
    },

    {
      path: 'basecurrency',
      name: `货币管理`,
      component: () => import('@/view/base/currency/index')
    },
    {
      path: 'systeminfo/assetaccountactivation',
      name: `续费激活`,
      component: () => import('@/view/base/asset/accountactivation/index')
    },
    {
      path: 'systeminfo/operatorlogs',
      name: `操作日志`,
      component: () => import('@/view/base/setting/companys/logs')
    },
    {
      path: 'omsqueuelog',
      name: `oms接口日志`,
      component: () => import('@/view/mall/trade/omsqueuelog')
    },
    {
      path: 'menumanage/shopmenus',
      name: `商城菜单管理`,
      component: () => import('@/view/menus/shopmenu')
    },
    {
      path: 'menumanage/merchantmenu',
      name: `商户菜单管理`,
      component: () => import('@/view/menus/merchantmenu')
    },
    {
      path: 'menumanage/suppliermenus',
      name: `供应商菜单管理`,
      component: () => import('@/view/menus/supplier')
    },
    {
      path: 'menumanage/distributormenu',
      name: `店铺菜单管理`,
      component: () => import('@/view/menus/distributormenu')
    },
    {
      path: 'adapay_merchant',
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
      path: 'adapay_cash_setting',
      name: '提现设置',
      component: () => import('@/view/mall/withdraw/withdraw_setting.vue')
    }
  ]
}
