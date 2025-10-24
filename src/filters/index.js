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

import moment from 'moment'

const install = function (Vue) {
  Vue.filter('datetime', (time, pattern) => {
    if (time !== -1) {
      return moment(time * 1000).format(pattern)
    } else {
      return moment().format(pattern)
    }
  })

  //格式化时间
  Vue.filter('formatDataTime', function (time, pattern = 'yyyy-MM-dd hh:mm:ss') {
    if (time !== -1) {
      return moment(time * 1000).format(pattern)
    } else {
      return moment().format(pattern)
    }
  })

  //
  Vue.filter('subStr', function (str, n) {
    const r = /[^\x00-\xff]/g
    if (str.replace(r, 'mm').length <= n) {
      return str
    }
    const m = Math.floor(n / 2)
    for (let i = m; i < str.length; i++) {
      if (str.substr(0, i).replace(r, 'mm').length >= n) {
        return str.substr(0, i) + '...'
      }
    }
    return str
  })
  //匹配省市区
  Vue.filter('formatCityData', function (areaValue, district, defaultValue = true) {
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
  Vue.filter('keepTwoDecimalFull', function (num) {
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
  Vue.filter('formatNumMoney', function formatNum(number) {
    return number.toFixed(2).toLocaleString()
  })

  // 格式化时间
  Vue.filter('formatTimestamp', function formatTimestamp(timestamp) {
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
  Vue.filter('formatCardStr', function (str) {
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
}

export { install }
