/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { BasicLayout } from '@/layout/basic' // 主框架
import { VERSION_SHUYUN } from '@/utils'
import { i18n } from '@/i18n'

const routes = [
  {
    component: BasicLayout,
    meta: {
      aliasName: 'setting',
      icon: 'setting-config',
      keepAlive: true,
      title: i18n.t('181fc9cc.e366cc')
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
          title: i18n.t('181fc9cc.26d82e'),
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
          title: i18n.t('181fc9cc.7e337d'),
          permissions: ['setting.staff.platformstaffroles']
        },
        component: () => import('@/views/settings/role-admin')
      },
      {
        name: `systemAccountStoreAccount`,
        path: 'system-account/store-account',
        meta: {
          aliasName: 'merchantstaff',
          icon: 'icon-products',
          title: i18n.t('181fc9cc.f629da'),
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
          title: i18n.t('181fc9cc.2fda42'),
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
          title: i18n.t('181fc9cc.712fef'),
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
          title: i18n.t('181fc9cc.5e1308'),
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
          title: i18n.t('181fc9cc.86be9a'),
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
          title: i18n.t('181fc9cc.f6b769'),
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
          title: i18n.t('181fc9cc.91a229'),
          permissions: ['setting.systemsetting.publicsetting']
        },
        component: () => import('@/views/settings/systemConfig/publicsetting')
      },
      {
        name: `systemConfigMailService`,
        path: 'system-config/mail-service',
        meta: {
          aliasName: 'mailServiceSetting',
          icon: 'icon-products',
          title: '181fc9cc.905eb5',
          // 与 publicsetting 并存：后台未单独下发 mail 权限时，拥有「通用设置」的用户仍可注册该路由
          permissions: [
            'setting.systemsetting.mailServiceSetting',
            'setting.systemsetting.publicsetting'
          ]
        },
        component: () => import('@/views/settings/systemConfig/mailServiceSetting.vue')
      },
      {
        name: `systemConfigInvoinceConfiguration`,
        path: 'system-config/invoince-configuration',
        meta: {
          aliasName: 'invoinceConfiguration',
          icon: 'icon-products',
          title: i18n.t('181fc9cc.1275c1'),
          permissions: ['setting.systemsetting.invoinceConfiguration']
        },
        component: () => import('@/views/settings/systemConfig/invoiceConfiguration/baiSetting')
      },
      {
        name: `systemConfigPaymentConfiguration`,
        path: 'system-config/payment-configuration',
        meta: {
          aliasName: 'assetpayment',
          icon: 'icon-products',
          title: i18n.t('181fc9cc.1c3835'),
          permissions: ['setting.systemsetting.assetpayment']
        },
        component: () => import('@/views/settings/systemConfig/payment')
      },
      {
        name: `systemConfigSmsService`,
        path: 'system-config/sms-service',
        meta: {
          aliasName: 'datamessage',
          icon: 'icon-products',
          title: i18n.t('181fc9cc.ffa488'),
          permissions: ['setting.systemsetting.datamessage']
        },
        component: () => {
          if (VERSION_SHUYUN()) {
            return import('@/views/settings/systemConfig/smsService/shopex_sms')
          } else {
            return import('@/views/settings/systemConfig/smsService/ali_sms')
          }
        },
        children: [
          {
            path: '/',
            name: '181fc9cc.b6453a',
            meta: 'base_config',
            component: () => import('@/views/settings/systemConfig/smsService/base_config')
          },
          {
            path: 'send_sms',
            name: '181fc9cc.2d7288',
            meta: 'send_sms',
            component: () => import('@/views/settings/systemConfig/smsService/send_sms')
          },
          {
            path: 'sms_signatures',
            name: '181fc9cc.f32c04',
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
            name: '181fc9cc.dbe8ba',
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
            name: '181fc9cc.dabdd1',
            component: () => import('@/views/settings/systemConfig/smsService/sms_sendLog'),
            meta: 'sms_sendLog'
          },
          {
            path: 'sms_MassLog',
            name: '181fc9cc.28cf8d',
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
          },
          {
            path: 'ali_sms',
            name: 'aliSms',
            redirect: '/setting/system-config/sms-service'
          },
          {
            path: 'shopex_sms',
            name: '181fc9cc.67fc96',
            component: () => import('@/views/settings/systemConfig/smsService/shopex_sms')
          }
        ]
      },
      {
        name: `systemConfigPrinting`,
        path: 'system-config/printing',
        meta: {
          aliasName: 'Yilianyun',
          icon: 'icon-products',
          title: i18n.t('181fc9cc.bf34e4'),
          permissions: ['setting.systemsetting.Yilianyun']
        },
        component: () => import('@/views/settings/systemConfig/yilianyun/index')
      },
      {
        name: `systemConfigUgcAuditConfiguration`,
        path: 'system-config/ugc-audit-configuration',
        meta: {
          aliasName: 'ugctpos',
          icon: 'icon-products',
          title: i18n.t('181fc9cc.b28ada'),
          permissions: ['setting.systemsetting.ugctpos']
        },
        component: () => import('@/views/settings/systemConfig/ugcTPOS')
      },
      {
        name: `systemConfigWxappManagement`,
        path: 'system-config/wxapp-management',
        meta: {
          aliasName: 'wxaindex',
          icon: 'icon-products',
          title: i18n.t('181fc9cc.10aa76'),
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
          title: i18n.t('181fc9cc.6450d8'),
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
          title: i18n.t('181fc9cc.21058f'),
          permissions: ['setting.systemsetting.editsourcemanagement']
        },
        component: () => import('@/view/wxapp/statistics/sourcemanagement/index'),
        children: [
          {
            path: 'detail/:monitorId?',
            component: () => import('@/view/wxapp/statistics/sourcemanagement/monito_detail'),
            meta: {
              title: i18n.t('181fc9cc.b76938'),
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
          title: i18n.t('181fc9cc.579cc5'),
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
          title: i18n.t('181fc9cc.cbf7c8'),
          permissions: ['setting.systemsetting.brand']
        },
        component: () => import('@/views/settings/systemConfig/official-account-auth')
      },
      {
        name: `systemConfigWxappCustomerService`,
        path: 'system-config/wxapp-customer-service',
        meta: {
          aliasName: 'wxappchat',
          icon: 'icon-products',
          title: i18n.t('181fc9cc.107a88'),
          permissions: ['setting.systemsetting.wxappchat']
        },
        component: () => import('@/views/settings/systemConfig/wxapp-customer-service')
      },
      {
        name: `systemConfigOneChat`,
        path: 'system-config/one-chat',
        meta: {
          aliasName: 'EChat',
          icon: 'icon-products',
          title: i18n.t('181fc9cc.e66efe'),
          permissions: ['setting.systemsetting.EChat']
        },
        component: () => import('@/views/settings/systemConfig/echat')
      },
      {
        name: `systemConfigMeiChat`,
        path: 'system-config/mei-chat',
        meta: {
          aliasName: 'meiqia',
          icon: 'icon-products',
          title: i18n.t('181fc9cc.7ef177'),
          permissions: ['setting.systemsetting.meiqia']
        },
        component: () => import('@/views/settings/systemConfig/meiqia')
      },
      {
        name: `systemConfigWangDianTong`,
        path: 'system-config/wangdiantong',
        meta: {
          aliasName: 'wdtSetting',
          icon: 'icon-products',
          title: i18n.t('181fc9cc.152925'),
          permissions: ['setting.systemsetting.wdtSetting']
        },
        component: () => import('@/views/settings/systemConfig/wdtSetting')
      },
      {
        name: `systemConfigJuShuiTan`,
        path: 'system-config/jushuitan',
        meta: {
          aliasName: 'jstSetting',
          icon: 'icon-products',
          title: i18n.t('181fc9cc.deb133'),
          permissions: ['setting.systemsetting.jstSetting']
        },
        component: () => import('@/views/settings/systemConfig/jstSetting')
      },
      {
        name: `systemConfigDomainSetting`,
        path: 'system-config/domain-setting',
        meta: {
          aliasName: 'domain_setting',
          icon: 'icon-products',
          title: i18n.t('181fc9cc.93c728'),
          permissions: ['setting.systemsetting.domain_setting']
        },
        component: () => import('@/views/settings/systemConfig/domain')
      },
      {
        name: `systemConfigPrivacyApply`,
        path: 'system-config/provacy-apply',
        meta: {
          aliasName: 'approveDataPass',
          icon: 'icon-products',
          title: i18n.t('181fc9cc.1fb869'),
          permissions: ['setting.systemsetting.approveDataPass']
        },
        component: () => import('@/views/settings/systemConfig/encrypt/authAdmin.vue')
      },
      {
        name: `systemConfigPrivacyApproval`,
        path: 'system-config/provacy-approval',
        meta: {
          aliasName: 'applyDataPass',
          icon: 'icon-products',
          title: i18n.t('181fc9cc.18dbfa'),
          permissions: ['setting.systemsetting.applyDataPass']
        },
        component: () => import('@/views/settings/systemConfig/authorityapproval'),
        children: [
          {
            path: 'approve/:id?',
            component: () => import('@/views/settings/systemConfig/authorityapproval/approve'),
            meta: {
              title: i18n.t('181fc9cc.d58eae'),
              hidden: true
            }
          }
        ]
      },
      {
        name: `systemConfigWebPrivacyStatement`,
        path: 'system-config/web-privacy-statement',
        meta: {
          aliasName: 'webPrivacyStatement',
          icon: 'icon-products',
          title: i18n.t('181fc9cc.dd2c2d'),
          permissions: ['setting.systemsetting.webPrivacyStatement']
        },
        component: () => import('@/views/settings/systemConfig/webPrivacyStatement')
      },
      {
        name: `systemConfigExternalWxapp`,
        path: 'system-config/external-wxapp',
        meta: {
          aliasName: 'extminilink',
          icon: 'icon-products',
          title: i18n.t('181fc9cc.04a911'),
          permissions: ['setting.systemsetting.extminilink']
        },
        component: () => import('@/views/settings/systemConfig/external-app'),
        children: [
          {
            path: 'editor',
            component: () => import('@/views/settings/systemConfig/extMiniLinkDetail'),
            meta: {
              title: i18n.t('181fc9cc.3ddd64'),
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
          title: i18n.t('181fc9cc.46da27'),
          permissions: ['setting.delivery.logistics']
        },
        component: () => import('@/views/settings/deliverySettings/logistics/index'),
        children: [
          {
            path: 'editor/:id?',
            component: () => import('@/views/settings/deliverySettings/logistics/add-ziti'),
            meta: {
              title: i18n.t('181fc9cc.f36bc9'),
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
          title: i18n.t('181fc9cc.416fd4'),
          permissions: ['setting.delivery.shippingtemplates']
        },
        component: () => import('@/view/mall/trade/shipping/templates'),
        children: [
          {
            path: 'editor/:itemId?',
            component: () => import('@/view/mall/trade/shipping/add'),
            meta: {
              title: i18n.t('181fc9cc.889dfe'),
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
          title: i18n.t('181fc9cc.ddc703'),
          permissions: ['setting.delivery.kdniao']
        },
        component: () => import('@/views/settings/deliverySettings/logistics-inquiry')
      },
      {
        name: `deliverySettingDistributionManagement`,
        path: 'delivery-setting/deliver-person-management',
        meta: {
          aliasName: 'setting_staffself_deliverystaff',
          icon: 'icon-products',
          title: i18n.t('181fc9cc.1a05d5'),
          permissions: ['setting.delivery.setting_staffself_deliverystaff']
        },
        component: () => import('@/views/settings/deliverySettings/delivery-management')
      },
      {
        name: `deliverySettingDeliverPersonPerformance`,
        path: 'delivery-setting/deliver-person-performance',
        meta: {
          aliasName: 'companydata_deliverystaffstatistics',
          icon: 'icon-products',
          title: i18n.t('181fc9cc.d6f79b'),
          permissions: ['setting.delivery.companydata_deliverystaffstatistics']
        },
        component: () => import('@/views/settings/deliverySettings/delivery-performance')
      },
      {
        name: `deliverySettingDadaAccount`,
        path: 'delivery-setting/dada-account',
        meta: {
          aliasName: 'dada',
          icon: 'icon-products',
          title: i18n.t('181fc9cc.52ec0e'),
          permissions: ['setting.delivery.dada']
        },
        component: () => import('@/views/settings/deliverySettings/dada-account')
      },
      {
        name: 'systemInfoOperatorLogs',
        path: 'system-info/operator-logs',
        component: () => import('@/views/settings/systemInfo/operation-log'),
        meta: {
          aliasName: 'operatLorogs',
          icon: 'icon-products',
          title: i18n.t('181fc9cc.cda84b'),
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
          title: i18n.t('181fc9cc.1d62c8'),
          permissions: ['setting.omssetting']
        },
        component: () => import('@/views/settings/role-admin') //后期修复
      },

      {
        name: `service`,
        path: 'map/service',
        meta: {
          aliasName: 'mapsetting',
          icon: 'icon-products',
          title: i18n.t('181fc9cc.5e6abb'),
          permissions: ['setting.systemsetting.mapsetting']
        },
        component: () => import('@/views/settings/systemConfig/map-setting')
      },
      {
        name: `ERP`,
        path: 'ShangPai/ERP',
        meta: {
          aliasName: 'certificate',
          icon: 'icon-products',
          title: i18n.t('181fc9cc.e5549d'),
          permissions: ['setting.systemsetting.certificate']
        },
        component: () => import('@/views/settings/systemConfig/ShangPai-erp')
      },
      {
        name: `usercenter`,
        path: 'ShangPai/usercenter',
        meta: {
          aliasName: 'usercenter',
          icon: 'icon-products',
          title: '商派用户中心',
          permissions: ['setting.systemsetting.usercenter']
        },
        component: () => import('@/views/settings/systemConfig/ShangPai-usercenter')
      },
      {
        name: `shopmenus`,
        path: 'menumanage/shopmenus',
        meta: {
          icon: 'icon-products',
          title: i18n.t('181fc9cc.712fef'),
          permissions: ['setting.menumanage.shopmenus']
        },
        component: () => import('@/view/menus/shopmenu')
      },
      {
        name: `distributormenu`,
        path: 'menumanage/distributormenu',
        meta: {
          icon: 'icon-products',
          title: i18n.t('181fc9cc.5e1308'),
          permissions: ['setting.menumanage.distributormenu']
        },
        component: () => import('@/view/menus/distributormenu')
      },
      {
        name: `suppliermenus`,
        path: 'menumanage/suppliermenus',
        meta: {
          icon: 'icon-products',
          title: i18n.t('181fc9cc.f6b769'),
          permissions: ['setting.menumanage.suppliermenus']
        },
        component: () => import('@/view/menus/supplier')
      },
      {
        name: `merchantmenu`,
        path: 'menumanage/merchantmenu',
        meta: {
          icon: 'icon-products',
          title: i18n.t('181fc9cc.86be9a'),
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
          title: i18n.t('181fc9cc.a21aa1'),
          permissions: ['setting.systemsetting.damoCrm']
        },
        component: () => import('@/views/settings/systemConfig/damoCrm/index')
      },
      {
        name: `systemconfigKjlSetting`,
        path: 'system-config/kjl-setting',
        meta: {
          aliasName: 'kjlsetting',
          icon: 'icon-products',
          title: i18n.t('181fc9cc.782f66'),
          permissions: ['setting.systemsetting.kjlsetting']
        },
        component: () => import('@/views/settings/kujiale-setting')
      },
      {
        name: `basecurrency`,
        path: 'system-config/basecurrency',
        meta: {
          aliasName: 'basecurrency',
          icon: 'icon-products',
          title: i18n.t('b51bc270.f68fc6'),
          permissions: ['setting.systemsetting.basecurrency']
        },
        component: () => import('@/view/base/currency/index')
      }
    ]
  }
]

export default routes
