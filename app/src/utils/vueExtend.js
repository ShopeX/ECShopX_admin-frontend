import Vue from 'vue'
import CommonUtil from '@/common/js/util'
// import moment from 'moment'
// import district from '@/common/district.json'

//格式化时间
Vue.filter('datetime', function(time, pattern) {
  if (time !== -1) {
    return CommonUtil.formatDate.format(new Date(time * 1000), pattern)
  } else {
    let timestamp = Date.parse(new Date()) / 1000
    return CommonUtil.formatDate.format(new Date(timestamp * 1000), pattern)
  }
})

//格式化时间
Vue.filter('formatDataTime', function(time, pattern = 'yyyy-MM-dd hh:mm:ss') {
  if (time !== -1) {
    return CommonUtil.formatDate.format(new Date(time * 1000), pattern)
  } else {
    let timestamp = Date.parse(new Date()) / 1000
    return CommonUtil.formatDate.format(new Date(timestamp * 1000), pattern)
  }
})

//
Vue.filter('subStr', function(str, n) {
  var r = /[^\x00-\xff]/g
  if (str.replace(r, 'mm').length <= n) {
    return str
  }
  var m = Math.floor(n / 2)
  for (var i = m; i < str.length; i++) {
    if (str.substr(0, i).replace(r, 'mm').length >= n) {
      return str.substr(0, i) + '...'
    }
  }
  return str
})
//匹配省市区
Vue.filter('formatCityData', function(areaValue, district, defaultValue = true) {
  if (areaValue == 0 || typeof areaValue === 'undefined') {
    if (!defaultValue) return ''
    return '全国（默认）'
  }
  var area_str = ''
  for (var province in district) {
    var city_str = ''
    if (areaValue.indexOf(district[province].value) > -1) {
      area_str += district[province].label + ','
      continue
    }
    for (var city in district[province].children) {
      if (areaValue.indexOf(district[province].children[city].value) > -1) {
        city_str += district[province].children[city].label + ','
        continue
      }
      var region_str = ''
      for (var region in district[province].children[city].children) {
        if (areaValue.indexOf(district[province].children[city].children[region].value) > -1) {
          region_str += district[province].children[city].children[region].label + ','
        }
      }
      if (region_str) {
        city_str +=
          district[province].children[city].label +
          '(' +
          region_str.substring(0, region_str.lastIndexOf(',')) +
          '),'
      }
    }
    if (city_str) {
      area_str +=
        district[province].label + '[' + city_str.substring(0, city_str.lastIndexOf(',')) + '],'
    }
  }
  return area_str.substring(0, area_str.lastIndexOf(','))
})
//格式化价格保留小数点后两位
Vue.filter('keepTwoDecimalFull', function(num) {
  var result = parseFloat(num)
  if (isNaN(result)) {
    console.log('传递参数错误，请检查！')
    return false
  }
  result = Math.round(num * 100) / 100
  var s_x = result.toString()
  var pos_decimal = s_x.indexOf('.')
  if (pos_decimal < 0) {
    pos_decimal = s_x.length
    s_x += '.'
  }
  while (s_x.length <= pos_decimal + 2) {
    s_x += '0'
  }
  return s_x
})

// 格式化金钱
Vue.filter('formatNumMoney',function formatNum(number) {
  return number.toFixed(2).toLocaleString()
})

// 格式化时间
Vue.filter('formatTimestamp',function formatTimestamp(timestamp) {
  if (timestamp) {
    var date = new Date(timestamp * 1000) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var YY = date.getFullYear() + '-'
    var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    var DD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
    var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
    var ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    return YY + MM + DD + ' ' + hh + mm + ss
  } else {
    return '-'
  }
})

//匹配券类别字符串
Vue.filter('formatCardStr', function(str) {
  switch (str) {
    case 'groupon':
      str = '团购券'
      break
    case 'discount':
      str = '折扣券'
      break
    case 'gift':
      str = '兑换券'
      break
    case 'new_gift':
      str = '兑换券'
      break
    case 'cash':
      str = '满减券'
      break
    case 'money':
      str = '现金券'
      break
    case 'general_coupon':
      str = '优惠券'
      break
    case 'member_card':
      str = '会员卡'
      break
    case 'scenic_ticket':
      str = '景点门票'
      break
    case 'movie_ticket':
      str = '电影票'
      break
    case 'boarding_pass':
      str = '飞机票'
      break
    case 'meeting_ticket':
      str = '会议门票'
      break
    case 'bus_ticket':
      str = '汽车票'
      break
  }
  return str
})

Vue.prototype.matchInternalRoute = function(name) {
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

Vue.prototype.matchHidePage = function(name) {
  // let componentName = this.$route.path.split( '/' )
  // debugger
  // componentName = componentName[componentName.length-1]
  // return `${this.$route.path}/${componentName}_${name}`

  return `${this.$route.path}/${name}`
}
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
// console.log("---process.env.IS_SAAS--",process.env)
Vue.prototype.system_is_saas = process.env.VUE_APP_IS_SAAS||'false'
Vue.prototype.system_mode = process.env.VUE_APP_PRODUCT_MODEL
Vue.prototype.path_prefixes = process.env.VUE_APP_PREFIXES
Vue.prototype.BASE_API = process.env.VUE_APP_BASE_API.indexOf('http') !== -1 ? process.env.VUE_APP_BASE_API : window.location.origin + '/api'
Vue.prototype.wximageurl = process.env.VUE_APP_WXIMG_URL
Vue.prototype.BEIAN = process.env.BEIAN
Vue.prototype.wxAuthCallbackUrl = process.env.VUE_APP_WXAUTHCALL_Url.indexOf('http') !== -1 ? process.env.VUE_APP_WXAUTHCALL_Url : window.location.origin + '/'
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

Vue.prototype.companyBrand = '商派ECShopX'
Vue.prototype.companyBrandImg = process.env.PRODUCT_MODEL === 'standard' ? 'onex' : 'ecshopx'
// 动态改变页面的title
document.title = Vue.prototype.companyBrand

