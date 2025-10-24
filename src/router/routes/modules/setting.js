// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统 
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn 
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------

import { BasicLayout } from '@/layout/basic' // 主框架
import { VERSION_SHUYUN } from '@/utils'

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'setting',
      icon: 'setting-config',
      keepAlive: true,
      title: '设置'
    },
    name: 'setting',
    path: '/setting',
    children: [
      {
        name: `systemAccountPlatformAccount`,
        path: 'system-account/platform-account',
        meta: {
          aliasName: 'platformstaff',
          icon: 'icon-products',
          title: '平台账号',
          permissions: ['setting.staff.platformstaff']
        },
        component: () => import('@/view/base/account/normalstaff')
      },
      {
        name: `systemAccountSystemRole`,
        path: 'system-account/system-role',
        meta: {
          aliasName: 'platformstaffroles',
          icon: 'icon-products',
          title: '系统角色',
          permissions: ['setting.staff.platformstaffroles']
        },
        component: () => import('@/view/base/account/normalroles')
      },
      {
        name: `systemAccountStoreAccount`,
        path: 'system-account/store-account',
        meta: {
          aliasName: 'merchantstaff',
          icon: 'icon-products',
          title: '店铺账号',
          permissions: ['setting.staff.merchantstaff']
        },
        component: () => import('@/view/base/account/storestaff')
      },

      {
        name: `systemAccountMerchantAccount`,
        path: 'system-account/merchant-account',
        meta: {
          aliasName: 'storemanager_account',
          icon: 'icon-products',
          title: '商户账号',
          permissions: ['setting.staff.storemanager_account']
        },
        component: () => import('@/view/mall/marketing/merchantAccount')
      },

      {
        name: `menumanageShopmenus`,
        path: 'menumanage/shopmenus',
        meta: {
          aliasName: 'shopmenus',
          icon: 'icon-products',
          title: '商城菜单',
          permissions: ['setting.menumanage.shopmenus']
        },
        component: () => import('@/view/menus/shopmenu')
      },
      {
        name: `menumanageDistributormenu`,
        path: 'menumanage/distributormenu',
        meta: {
          aliasName: 'distributormenu',
          icon: 'icon-products',
          title: '店铺菜单',
          permissions: ['setting.menumanage.distributormenu']
        },
        component: () => import('@/view/menus/distributormenu')
      },
      {
        name: `menumanageMerchantmenu`,
        path: 'menumanage/merchantmenu',
        meta: {
          aliasName: 'merchantmenu',
          icon: 'icon-products',
          title: '商户菜单',
          permissions: ['setting.menumanage.merchantmenu']
        },
        component: () => import('@/view/menus/merchantmenu')
      },
      {
        name: `menumanageSuppliermenus`,
        path: 'menumanage/suppliermenus',
        meta: {
          aliasName: 'suppliermenus',
          icon: 'icon-products',
          title: '供应商菜单',
          permissions: ['setting.menumanage.suppliermenus']
        },
        component: () => import('@/view/menus/supplier')
      },

      {
        name: `systemConfigBaseSetup`,
        path: 'system-config/base-setup',
        meta: {
          aliasName: 'publicsetting',
          icon: 'icon-products',
          title: '通用设置',
          permissions: ['setting.systemsetting.publicsetting']
        },
        component: () => import('@/view/base/setting/publicsetting')
      },
      {
        name: `systemConfigPaymentConfiguration`,
        path: 'system-config/payment-configuration',
        meta: {
          aliasName: 'assetpayment',
          icon: 'icon-products',
          title: '支付配置',
          permissions: ['setting.systemsetting.assetpayment']
        },
        component: () => import('@/view/base/setting/payment')
      },
      {
        name: `systemConfigSmsService`,
        path: 'system-config/sms-service',
        meta: {
          aliasName: 'datamessage',
          icon: 'icon-products',
          title: '短信服务',
          permissions: ['setting.systemsetting.datamessage']
        },
        component: () => {
          if (VERSION_SHUYUN()) {
            return import('@/view/base/shortmessage/shopex_sms')
          } else {
            return import('@/view/base/shortmessage/index')
          }
        },
        children: [
          {
            path: 'ali_sms',
            name: 'aliSms',
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
        name: `systemConfigPrinting`,
        path: 'system-config/printing',
        meta: {
          aliasName: 'Yilianyun',
          icon: 'icon-products',
          title: '小票打印',
          permissions: ['setting.systemsetting.Yilianyun']
        },
        component: () => import('@/view/base/setting/yilianyun/index')
      },
      {
        name: `systemConfigUgcAuditConfiguration`,
        path: 'system-config/ugc-audit-configuration',
        meta: {
          aliasName: 'ugctpos',
          icon: 'icon-products',
          title: 'UGC审核配置',
          permissions: ['setting.systemsetting.ugctpos']
        },
        component: () => import('@/view/member/ugc/ugcTPOS')
      },
      {
        name: `systemConfigWxappManagement`,
        path: 'system-config/wxapp-management',
        meta: {
          aliasName: 'wxaindex',
          icon: 'icon-products',
          title: '小程序管理',
          permissions: ['setting.systemsetting.wxaindex']
        },
        component: () => import('@/view/wxapp/wxappmanage/list')
      },
      {
        name: `systemInfoWxappManagementDataAnalysis`,
        path: 'system-config/data-analysis',
        meta: {
          aliasName: 'editdashboard',
          icon: 'icon-products',
          title: '数据分析',
          permissions: ['setting.systemsetting.editdashboard']
        },
        component: () => import('@/view/wxapp/statistics/dataanalysis/index')
      },
      {
        name: `systemInfoWxappManagementDifferentCodes`,
        path: 'system-config/different-codes',
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
      },
      {
        name: `systemInfoWxappManagementMessageTemplate`,
        path: 'system-config/message-template',
        meta: {
          aliasName: 'noticemessage',
          icon: 'icon-products',
          title: '消息模板',
          permissions: ['setting.systemsetting.noticemessage']
        },
        component: () => import('@/view/wxapp/messages')
      },

      {
        name: `systemConfigOfficialAccountAuth`,
        path: 'system-config/official-account-auth',
        meta: {
          aliasName: '',
          icon: 'icon-products',
          title: '公众号授权',
          permissions: ['setting.systemsetting.brand']
        },
        component: () => import('@/view/brand/wechat/open')
      },
      {
        name: `systemConfigWxappCustomerService`,
        path: 'system-config/wxapp-customer-service',
        meta: {
          aliasName: 'wxappchat',
          icon: 'icon-products',
          title: '小程序客服',
          permissions: ['setting.systemsetting.wxappchat']
        },
        component: () => import('@/view/base/setting/im/wxappchat')
      },
      {
        name: `systemConfigOneChat`,
        path: 'system-config/one-chat',
        meta: {
          aliasName: 'EChat',
          icon: 'icon-products',
          title: '一洽客服',
          permissions: ['setting.systemsetting.EChat']
        },
        component: () => import('@/view/base/setting/im/echat')
      },
      {
        name: `systemConfigMeiChat`,
        path: 'system-config/mei-chat',
        meta: {
          aliasName: 'meiqia',
          icon: 'icon-products',
          title: '美洽客服',
          permissions: ['setting.systemsetting.meiqia']
        },
        component: () => import('@/view/site/meiqia')
      },
      {
        name: `systemConfigWangDianTong`,
        path: 'system-config/wangdiantong',
        meta: {
          aliasName: 'wdtSetting',
          icon: 'icon-products',
          title: '旺店通',
          permissions: ['setting.systemsetting.wdtSetting']
        },
        component: () => import('@/view/base/setting/saaserp/wdtSetting')
      },
      {
        name: `systemConfigJuShuiTan`,
        path: 'system-config/jushuitan',
        meta: {
          aliasName: 'jstSetting',
          icon: 'icon-products',
          title: '聚水潭',
          permissions: ['setting.systemsetting.jstSetting']
        },
        component: () => import('@/view/base/setting/saaserp/jstSetting')
      },
      {
        name: `systemConfigDomainSetting`,
        path: 'system-config/domain-setting',
        meta: {
          aliasName: 'domain_setting',
          icon: 'icon-products',
          title: '域名设置',
          permissions: ['setting.systemsetting.domain_setting']
        },
        component: () => import('@/view/base/setting/companys/domain')
      },
      {
        name: `systemConfigPrivacyApply`,
        path: 'system-config/provacy-apply',
        meta: {
          aliasName: 'approveDataPass',
          icon: 'icon-products',
          title: '脱敏数据申请',
          permissions: ['setting.systemsetting.approveDataPass']
        },
        component: () => import('@/view/base/encrypt/authAdmin.vue')
      },
      {
        name: `systemConfigPrivacyApproval`,
        path: 'system-config/provacy-approval',
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
      },
      {
        name: `systemConfigExternalWxapp`,
        path: 'system-config/external-wxapp',
        meta: {
          aliasName: 'extminilink',
          icon: 'icon-products',
          title: '外链小程序',
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
      },
      {
        name: `deliverySettingDelivery`,
        path: 'delivery-setting/delivery',
        meta: {
          aliasName: 'logistics',
          icon: 'icon-products',
          title: '配送设置',
          permissions: ['setting.delivery.logistics']
        },
        component: () => import('@/view/mall/trade/logistics/index'),
        children: [
          {
            path: 'editor/:id?',
            component: () => import('@/view/mall/trade/logistics/add-ziti'),
            meta: {
              title: '编辑自提点',
              hidden: true
            }
          }
        ]
      },
      {
        name: `deliverySettingFreightTemplate`,
        path: 'delivery-setting/freight-template',
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
      },
      {
        name: `deliverySettingLogisticsInquiry`,
        path: 'delivery-setting/logistics-inquiry',
        meta: {
          aliasName: 'kdniao',
          icon: 'icon-products',
          title: '物流查询配置',
          permissions: ['setting.delivery.kdniao']
        },
        component: () => import('@/view/base/setting/kdniao')
      },
      {
        name: `deliverySettingDistributionManagement`,
        path: 'delivery-setting/deliver-person-management',
        meta: {
          aliasName: 'setting_staffself_deliverystaff',
          icon: 'icon-products',
          title: '配送员管理',
          permissions: ['setting.delivery.setting_staffself_deliverystaff']
        },
        component: () => import('@/view/base/account/delivery')
      },
      {
        name: `deliverySettingDeliverPersonPerformance`,
        path: 'delivery-setting/deliver-person-performance',
        meta: {
          aliasName: 'companydata_deliverystaffstatistics',
          icon: 'icon-products',
          title: '配送员业绩',
          permissions: ['setting.delivery.companydata_deliverystaffstatistics']
        },
        component: () => import('@/view/mall/datacube/companydata/delivery')
      },
      {
        name: `deliverySettingDadaAccount`,
        path: 'delivery-setting/dada-account',
        meta: {
          aliasName: 'dada',
          icon: 'icon-products',
          title: '达达账户',
          permissions: ['setting.delivery.dada']
        },
        component: () => import('@/view/mall/distribution/account')
      },
      {
        name: 'systemInfoRenewalActivation',
        path: 'system-info/renewal-activation',
        component: () => import('@/view/base/asset/accountactivation/index'),
        meta: {
          aliasName: 'assetaccountactivation',
          icon: 'icon-products',
          title: '续费激活',
          permissions: ['setting.systeminfo.assetaccountactivation']
        }
      },
      {
        name: 'systemInfoSoftwareProtocol',
        path: 'system-info/software-protocol',
        component: () => import('@/view/base/setting/agreement'),
        meta: {
          aliasName: 'agreement',
          icon: 'icon-products',
          title: '软件协议',
          permissions: ['setting.systeminfo.agreement']
        }
      },
      {
        name: 'systemInfoOperatorLogs',
        path: 'system-info/operator-logs',
        component: () => import('@/view/base/setting/companys/logs'),
        meta: {
          aliasName: 'operatLorogs',
          icon: 'icon-products',
          title: '操作日志',
          permissions: ['setting.systeminfo.operator-logs']
        }
      },

      // TODO 以下是旧路由，后期可能需要删除

      {
        name: `configuration`,
        path: 'oms/configuration',
        meta: {
          aliasName: 'omssetting',
          icon: 'icon-products',
          title: 'oms配置',
          permissions: ['setting.omssetting']
        },
        component: () => import('@/view/base/account/normalroles') //后期修复
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
        component: () => import('@/view/base/setting/mapsetting')
      },
      {
        name: `ERP`,
        path: 'ShangPai/ERP',
        meta: {
          aliasName: 'certificate',
          icon: 'icon-products',
          title: '商派ERP',
          permissions: ['setting.systemsetting.certificate']
        },
        component: () => import('@/view/base/setting/certificate/index')
      },
      {
        name: `shopmenus`,
        path: 'menumanage/shopmenus',
        meta: {
          icon: 'icon-products',
          title: '商城菜单',
          permissions: ['setting.menumanage.shopmenus']
        },
        component: () => import('@/view/menus/shopmenu')
      },
      {
        name: `distributormenu`,
        path: 'menumanage/distributormenu',
        meta: {
          icon: 'icon-products',
          title: '店铺菜单',
          permissions: ['setting.menumanage.distributormenu']
        },
        component: () => import('@/view/menus/distributormenu')
      },
      {
        name: `suppliermenus`,
        path: 'menumanage/suppliermenus',
        meta: {
          icon: 'icon-products',
          title: '供应商菜单',
          permissions: ['setting.menumanage.suppliermenus']
        },
        component: () => import('@/view/menus/supplier')
      },
      {
        name: `merchantmenu`,
        path: 'menumanage/merchantmenu',
        meta: {
          icon: 'icon-products',
          title: '商户菜单',
          permissions: ['setting.menumanage.merchantmenu']
        },
        component: () => import('@/view/menus/merchantmenu')
      },
      {
        name: `systemconfigDamoCrm`,
        path: 'system-config/damo-crm',
        meta: {
          aliasName: 'damoCrm',
          icon: 'icon-products',
          title: '达摩CRM',
          permissions: ['setting.systemsetting.damoCrm']
        },
        component: () => import('@/view/base/setting/damoCrm/index')
      }
    ]
  }
]

export default routes
