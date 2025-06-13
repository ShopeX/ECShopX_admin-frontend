import { BasicLayout } from '@/layout/basic' // 主框架

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'setting',
      icon: 'shopping-bag',
      keepAlive: true,
      title: '设置'
    },
    name: 'setting',
    path: '/setting',
    children: [
      {
        name: `account`,
        path: 'platform/account',
        meta: {
          aliasName: 'platformstaff',
          icon: 'icon-products',
          title: '平台账号',
          permissions: ['setting.staff.platformstaff']
        },
        component: () => import('@/view/base/account/normalstaff'),
      },
      {
        name: `storeAcount`,
        path: 'store/account',
        meta: {
          aliasName: 'merchantstaff',
          icon: 'icon-products',
          title: '店铺账号',
          permissions: ['setting.staff.merchantstaff']
        },
        component: () => import('@/view/base/account/storestaff'),
      },
      {
        name: `role`,
        path: 'system/role',
        meta: {
          aliasName: 'platformstaffroles',
          icon: 'icon-products',
          title: '系统角色',
          permissions: ['setting.staff.platformstaffroles']
        },
        component: () => import('@/view/base/account/normalroles'),
      },
      {
        name: `configuration`,
        path: 'oms/configuration',
        meta: {
          aliasName: 'omssetting',
          icon: 'icon-products',
          title: 'oms配置',
          permissions: ['setting.omssetting']
        },
        component: () => import('@/view/base/account/normalroles'),  //后期修复
      },
      {
        name: `setup`,
        path: 'general/setup',
        meta: {
          aliasName: 'publicsetting',
          icon: 'icon-products',
          title: '通用设置',
          permissions: ['setting.systemsetting.publicsetting']
        },
        component: () => import('@/view/base/setting/publicsetting'), 
      },
      {
        name: `configuration`,
        path: 'payment/configuration',
        meta: {
          aliasName: 'assetpayment',
          icon: 'icon-products',
          title: '支付配置',
          permissions: ['setting.systemsetting.assetpayment']
        },
        component: () => import('@/view/base/setting/payment'), 
      },
      {
        name: `service`,
        path: 'short-message/service',
        meta: {
          aliasName: 'datamessage',
          icon: 'icon-products',
          title: '短信服务',
          permissions: ['setting.systemsetting.datamessage']
        },
        component: () => import('@/view/base/shortmessage/index'), 
      },
      {
        name: `service`,
        path: 'map/service',
        meta: {
          aliasName: 'mapsetting',
          icon: 'icon-products',
          title: '地图服务',
          permissions: ['setting.systemsetting.mapsetting']
        },
        component: () => import('@/view/base/setting/mapsetting'), 
      },
      {
        name: `service`,
        path: 'printing/receipts',
        meta: {
          aliasName: 'Yilianyun',
          icon: 'icon-products',
          title: '小票打印',
          permissions: ['setting.systemsetting.Yilianyun']
        },
        component: () => import('@/view/base/setting/yilianyun/index'), 
      },
      {
        name: `auditConfiguration`,
        path: 'UGC/audit-configuration',
        meta: {
          aliasName: 'ugctpos',
          icon: 'icon-products',
          title: 'UGC审核配置',
          permissions: ['setting.systemsetting.ugctpos']
        },
        component: () => import('@/view/member/ugc/ugcTPOS'), 
      },
      {
        name: `management`,
        path: 'program-management',
        meta: {
          aliasName: 'wxaindex',
          icon: 'icon-products',
          title: '小程序管理',
          permissions: ['setting.systemsetting.wxaindex']
        },
        component: () => import('@/view/wxapp/wxappmanage/list'), 
      },{
        name: `analysis`,
        path: 'data-analysis',
        meta: {
          aliasName: 'editdashboard',
          icon: 'icon-products',
          title: '数据分析',
          permissions: ['setting.systemsetting.editdashboard']
        },
        component: () => import('@/view/wxapp/statistics/dataanalysis/index'), 
      },{
        name: `codes`,
        path: 'different-codes',
        meta: {
          aliasName: 'editsourcemanagement',
          icon: 'icon-products',
          title: '千人千码',
          permissions: ['setting.systemsetting.editsourcemanagement']
        },
        component: () => import('@/view/wxapp/statistics/sourcemanagement/index'), 
        children: [
            {
              path: 'detail/:monitorId?',
              component: () => import('@/view/wxapp/statistics/sourcemanagement/monito_detail'),
              meta: {
                title: '新增千人千码',
                hidden: true
              }
            }
          ]
      },{
        name: `template`,
        path: 'message-template',
        meta: {
          aliasName: 'noticemessage',
          icon: 'icon-products',
          title: '消息模板',
          permissions: ['setting.systemsetting.noticemessage']
        },
        component: () => import('@/view/wxapp/messages'), 
      },{
        name: `authorization`,
        path: 'official-account/authorization',
        meta: {
          aliasName: '',
          icon: 'icon-products',
          title: '公众号授权',
          permissions: ['setting.systemsetting.brand']
        },
        component: () => import('@/view/brand/wechat/open'), 
      },{
        name: `customerService`,
        path: 'program/customer-service',
        meta: {
          aliasName: 'wxappchat',
          icon: 'icon-products',
          title: '小程序客服',
          permissions: ['setting.systemsetting.wxappchat']
        },
        component: () => import('@/view/base/setting/im/wxappchat'), 
      },{
        name: `customerService`,
        path: 'one-contact/customer-service',
        meta: {
          aliasName: 'EChat',
          icon: 'icon-products',
          title: '一洽客服',
          permissions: ['setting.systemsetting.EChat']
        },
        component: () => import('@/view/base/setting/im/echat'), 
      },{
        name: `customerService`,
        path: 'Meiqia/customer-service',
        meta: {
          aliasName: 'meiqia',
          icon: 'icon-products',
          title: '美洽客服',
          permissions: ['setting.systemsetting.meiqia']
        },
        component: () => import('@/view/site/meiqia'), 
      },{
        name: `WangDianTong`,
        path: 'WangDianTong',
        meta: {
          aliasName: 'wdtSetting',
          icon: 'icon-products',
          title: '旺店通',
          permissions: ['setting.systemsetting.wdtSetting']
        },
        component: () => import('@/view/base/setting/saaserp/wdtSetting'), 
      },{
        name: `JuShuiTan`,
        path: 'JuShuiTan',
        meta: {
          aliasName: 'jstSetting',
          icon: 'icon-products',
          title: '聚水潭',
          permissions: ['setting.systemsetting.jstSetting']
        },
        component: () => import('@/view/base/setting/saaserp/jstSetting'), 
      },{
        name: `ERP`,
        path: 'ShangPai/ERP',
        meta: {
          aliasName: 'certificate',
          icon: 'icon-products',
          title: '商派ERP',
          permissions: ['setting.systemsetting.certificate']
        },
        component: () => import('@/view/base/setting/certificate/index'), 
      },{
        name: `settings`,
        path: 'domain-name/settings',
        meta: {
          aliasName: 'domain_setting',
          icon: 'icon-products',
          title: '域名设置',
          permissions: ['setting.systemsetting.domain_setting']
        },
        component: () => import('@/view/base/setting/companys/domain'), 
      },{
        name: `application`,
        path: 'desensitization/application',
        meta: {
          aliasName: 'approveDataPass',
          icon: 'icon-products',
          title: '脱敏数据申请',
          permissions: ['setting.systemsetting.approveDataPass']
        },
        component: () => import('@/view/base/encrypt/authAdmin.vue'),
      },{
        name: `applicationApproval`,
        path: 'desensitization/application-approval',
        meta: {
          aliasName: 'applyDataPass',
          icon: 'icon-products',
          title: '脱敏申请审批',
          permissions: ['setting.systemsetting.applyDataPass']
        },
        component: () => import('@/view/base/setting/authorityapproval'), 
        children: [
            {
              path: 'approve/:id?',
              component: () => import('@/view/base/setting/authorityapproval/approve'),
              meta: {
                title: '脱敏申请审批详情',
                hidden: true
              }
            }
          ]
      },{
        name: `configuration`,
        path: 'external-program/configuration',
        meta: {
          aliasName: 'extminilink',
          icon: 'icon-products',
          title: '外部小程序配置',
          permissions: ['setting.systemsetting.extminilink']
        },
        component: () => import('@/view/base/wxa/extMiniLink'),
        children: [
            {
              path: 'editor',
              component: () => import('@/view/base/wxa/extMiniLinkDetail'),
              meta: {
                title: '外部小程序配置-页面路径',
                hidden: true
              }
            }
          ]
      },{
        name: `settings`,
        path: 'delivery/settings',
        meta: {
          aliasName: 'logistics',
          icon: 'icon-products',
          title: '配送设置',
          permissions: ['setting.delivery.logistics']
        },
        component: () => import('@/view/mall/trade/logistics/index'),
        children: [
            {
              path: 'editor/:itemId?',
              component: () => import('@/view/mall/trade/logistics/add-ziti'),
              meta: {
                title: '编辑自提点',
                hidden: true
              }
            }
          ]
      },{
        name: `template`,
        path: 'freight/template',
        meta: {
          aliasName: 'shippingtemplates',
          icon: 'icon-products',
          title: '运费模板',
          permissions: ['setting.delivery.shippingtemplates']
        },
        component: () => import('@/view/mall/trade/shipping/templates'),
        children: [
            {
              path: 'editor/:itemId?',
              component: () => import('@/view/mall/trade/shipping/add'),
              meta: {
                title: '运费模板编辑',
                hidden: true
              }
            }
          ]
      },{
        name: `inquiry`,
        path: 'logistics/inquiry',
        meta: {
          aliasName: 'kdniao',
          icon: 'icon-products',
          title: '物流查询配置',
          permissions: ['setting.delivery.kdniao']
        },
        component: () => import('@/view/base/setting/kdniao')
      },{
        name: `management`,
        path: 'distribution/management',
        meta: {
          aliasName: 'setting_staffself_deliverystaff',
          icon: 'icon-products',
          title: '配送员管理',
          permissions: ['setting.delivery.setting_staffself_deliverystaff']
        },
        component: () => import('@/'),
      },{
        name: ``,
        path: '',
        meta: {
          aliasName: '',
          icon: 'icon-products',
          title: '',
          permissions: ['']
        },
        component: () => import('@/'),
      },{
        name: ``,
        path: '',
        meta: {
          aliasName: '',
          icon: 'icon-products',
          title: '',
          permissions: ['']
        },
        component: () => import('@/'),
      },

    ]
  }
]

export default routes

