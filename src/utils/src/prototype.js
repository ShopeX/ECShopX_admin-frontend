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

import {
  VERSION_STANDARD,
  VERSION_PLATFORM,
  VERSION_B2C,
  VERSION_IN_PURCHASE,
  VERSION_SHUYUN,
  IS_ADMIN,
  IS_DISTRIBUTOR,
  IS_SUPPLIER,
  IS_MERCHANT,
  getUrlPathByLoginType
} from '@/utils'
import { SYSTEM_CONFIG } from '@/consts'
import store from '@/store'
import { export_open } from './utils'
// import moment from 'moment'
// import district from '@/common/district.json'

function install(Vue) {
  Vue.prototype.matchInternalRoute = function (name) {
    let menus = this.$router.options.routes
    if (menus) {
      return findName(menus, name)
    }
    function findName(menus, name) {
      for (let item of menus) {
        let url = item.path
        let path = ''
        let urls = url.split('/')
        if (url.indexOf(':') !== -1) {
          path = urls[urls.length - 2]
        } else {
          path = urls[urls.length - 1]
        }
        if (path === name) {
          if (url.indexOf(':') === -1) {
            return item.path
          } else {
            return item.path.split(':')[0]
          }
        }
        if (item.children && item.children.length > 0) {
          let obj = findName(item.children, name)
          if (obj) {
            return obj
          }
        }
      }
    }
  }

  Vue.prototype.matchRoutePath = function (name) {
    return `${this.$route.path}/${name}`
  }

  Vue.prototype.getUrlPathByLoginType = getUrlPathByLoginType

  Vue.prototype.orderType = [
    {
      type: 'service',
      name: '服务类订单'
    },
    {
      type: 'bargain',
      name: '助力订单'
    }
    // {
    //   type: 'normal',
    //   name: '实体订单'
    // }
  ]
  Vue.prototype.system_is_saas = process.env.VUE_APP_IS_SAAS || 'false'
  Vue.prototype.VUE_APP_FREE = process.env.VUE_APP_FREE == 'true'
  Vue.prototype.VERSION_STANDARD = VERSION_STANDARD
  Vue.prototype.VERSION_PLATFORM = VERSION_PLATFORM
  Vue.prototype.VERSION_B2C = VERSION_B2C
  Vue.prototype.VERSION_IN_PURCHASE = VERSION_IN_PURCHASE
  Vue.prototype.VERSION_SHUYUN = VERSION_SHUYUN
  Vue.prototype.VUE_APP_CHUZHI = process.env.VUE_APP_CHUZHI == 'true'

  Vue.prototype.IS_ADMIN = IS_ADMIN
  Vue.prototype.IS_DISTRIBUTOR = IS_DISTRIBUTOR
  Vue.prototype.IS_SUPPLIER = IS_SUPPLIER
  Vue.prototype.IS_MERCHANT = IS_MERCHANT

  Vue.prototype.path_prefixes = process.env.VUE_APP_PREFIXES
  Vue.prototype.BASE_API =
    process.env.VUE_APP_BASE_API.indexOf('http') !== -1
      ? process.env.VUE_APP_BASE_API
      : window.location.origin + '/api'
  Vue.prototype.wximageurl = process.env.VUE_APP_WXIMG_URL
  Vue.prototype.BEIAN = process.env.BEIAN
  Vue.prototype.wxAuthCallbackUrl =
    process.env.VUE_APP_WXAUTHCALL_Url.indexOf('http') !== -1
      ? process.env.VUE_APP_WXAUTHCALL_Url
      : window.location.origin + '/'
  Vue.prototype.routeApp = ''
  Vue.prototype.chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
  }
  Vue.prototype.theme = {
    $dominant_hue: '#1480e3',
    $auxiliary_hue: '#1f273a',
    $submenu_bg: '#f4f4f4',
    $submenu_act_text: '#333',
    $submenu_text: '#666'
  }
  Vue.prototype.VUE_APP_LOCAL_DELIVERY_DIRVER = process.env.VUE_APP_LOCAL_DELIVERY_DIRVER

  Vue.prototype.companyBrand = '商派ECShopX'
  Vue.prototype.companyBrandImg = process.env.PRODUCT_MODEL === 'standard' ? 'onex' : 'ecshopx'
  Vue.prototype.$EventBus = new Vue()
  Vue.prototype.$export_open = export_open
  Vue.prototype.VERSION_SHUYUN = VERSION_SHUYUN
}

export { install }
