import log from './log'
import CommonUtil from '@/common/js/util'
import _pickBy from 'lodash/pickBy'
import _get from 'lodash/get'
import store from '@/store'
import { isEmpty } from 'lodash'

const isPrimitiveType = (val, type) => Object.prototype.toString.call(val) === type

export function isFunction(val) {
  return isPrimitiveType(val, '[object Function]')
}

export function isNumber(val) {
  return isPrimitiveType(val, '[object Number]')
}

export function isObject(val) {
  return isPrimitiveType(val, '[object Object]')
}

export function isArray(val) {
  return Array.isArray(val)
}

export function isBoolean(val) {
  return isPrimitiveType(val, '[object Boolean]')
}

export function isString(val) {
  return isPrimitiveType(val, '[object String]')
}

// 云店
export const VERSION_STANDARD = store.getters.versionMode == 'standard'
// ecshopx
export const VERSION_PLATFORM = store.getters.versionMode == 'platform'
// 官方商城
export const VERSION_B2C = store.getters.versionMode == 'b2c'
// 内购
export const VERSION_IN_PURCHASE = store.getters.versionMode == 'in_purchase'

// 平台端
export const IS_ADMIN = (() => {
  const login_type = store.getters.login_type
  return login_type == 'admin' || login_type == 'staff'
})()

// 店铺端
export const IS_DISTRIBUTOR = (() => {
  const login_type = store.getters.login_type
  return login_type == 'distributor'
})()

// 商户端
export const IS_MERCHANT = (() => {
  const login_type = store.getters.login_type
  return login_type == 'merchant'
})()

// 平台端、店铺端、经销商端路由跳转封装
export const getUrlPathByLoginType = (path) => {
  if (IS_ADMIN) {
    return path
  } else if (IS_DISTRIBUTOR) {
    return `/shopadmin${path}`
  }
}

export function isInSalesCenter() {
  if (window.self != window.top && window.self.location.href.indexOf('iframeLogin') < 0) {
    return true
  } else {
    false
  }
}

export function isInMerchant() {
  return /\/merchant/.test(window.location.pathname)
}

export function importAll(r, fn = (key, r) => r(key)) {
  r.keys().forEach((key) => fn(key, r))
}

export function rand(max) {
  return Math.floor(Math.random() * max)
}
//getRandwords 获取随机字符串
export function getRandwords(ls = 8) {
  var chars = ''
  var passwords = []
  var passwordUnique = true
  var quantity = 1
  chars += '0123456789'
  chars += 'abcdefghijklmnopqrstuvwxyz'
  chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  while (passwords.length < quantity) {
    var _chars = chars.split('')
    var password = ''
    for (var i = 0, l = ls; i < l; i++) {
      if (_chars.length < 1) break

      var idx = rand(_chars.length)
      password += _chars[idx]
      if (passwordUnique) _chars.splice(idx, 1)
    }
    if (passwords.indexOf(password) === -1) passwords.push(password)
  }
  return passwords.join('\n')
}

export function dateFilter(time, pattern = 'yyyy-MM-dd hh:mm:ss') {
  console.log('dateFilter', time)
  if (time !== -1) {
    return CommonUtil.formatDate.format(new Date(time * 1000), pattern)
  } else {
    let timestamp = Date.parse(new Date()) / 1000
    return CommonUtil.formatDate.format(new Date(timestamp * 1000), pattern)
  }
}

// 时间戳转日期格式
export function timestampToTime(timestamp) {
  var date = new Date(timestamp * 1000) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var YY = date.getFullYear() + '-'
  var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  var DD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
  var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
  var ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  return YY + MM + DD + ' ' + hh + mm + ss
}

export function goLink() {
  window.parent.postMessage(
    {
      cmd: 'notExistAuth'
    },
    '*'
  )
}

export function getPropByPath(obj, path, strict) {
  let tempObj = obj
  path = path.replace(/\[(\w+)\]/g, '.$1')
  path = path.replace(/^\./, '')

  let keyArr = path.split('.')
  let i = 0
  for (let len = keyArr.length; i < len - 1; ++i) {
    if (!tempObj && !strict) break
    let key = keyArr[i]
    if (key in tempObj) {
      tempObj = tempObj[key]
    } else {
      if (strict) {
        throw new Error('please transfer a valid prop path to form item!')
      }
      break
    }
  }
  return {
    o: tempObj,
    k: keyArr[i],
    v: tempObj ? tempObj[keyArr[i]] : null
  }
}

function export_open(tab) {
  setTimeout(() => {
    const login_type = store.getters.login_type
    if (login_type == 'distributor') {
      window.open(`/shopadmin/shopsetting/baseexport?tab=${tab}`)
    } else {
      window.open(`/setting/baseexport?tab=${tab}`)
    }
  }, 1000)
}

export function unescape(html) {
  /* eslint-disable */
  return html
    .replace(html ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8230;/g, '…')
  /* eslint-enable */
}

/**
 * 将驼峰转为短连接
 */
export function camelToShortline(camelStr) {
  return camelStr
    .replace(/[A-Z]/g, function (s) {
      return ' ' + s.toLowerCase()
    })
    .trim()
    .replaceAll(' ', '-')
}

export function getRegionNameById(region, district) {
  let result = []
  function getRegionName(_district, index) {
    const res = _district.find((item) => item.value == region[index])
    if (res) {
      result.push(res.label)
      if (res.children) {
        getRegionName(res.children, ++index)
      }
    }
  }
  if (Array.isArray(region) && region.length > 0) {
    getRegionName(district, 0)
  }
  return result
}

export function getRegionIdByName(region, district) {
  let result = []
  function getRegionValue(_district, index) {
    const res = _district.find((item) => item.label == region[index])
    if (res) {
      result.push(res.value)
      if (res.children) {
        getRegionValue(res.children, ++index)
      }
    }
  }
  if (region.length > 0) {
    getRegionValue(district, 0)
  }
  return result
}

export function pickBy(arr = [], keyMaps = {}) {
  const picker = (item) => {
    const ret = {}
    Object.keys(keyMaps).forEach((key) => {
      const val = keyMaps[key]
      if (isString(val)) {
        ret[key] = _get(item, val)
      } else if (isFunction(val)) {
        ret[key] = val(item)
      } else if (isObject(val)) {
        ret[key] = _get(item, val.key) || val.default
      } else {
        ret[key] = val
      }
    })

    return ret
  }

  if (isArray(arr)) {
    return arr.map(picker)
  } else {
    return picker(arr)
  }
}

export function hex2rgb(hex) {
  if (![4, 7].includes(hex.length)) {
    throw new Error('格式错误')
  }
  let result = hex.slice(1)
  // 如果是颜色叠值, 统一转换成6位颜色值
  if (result.length === 3) {
    result = result
      .split('')
      .map((a) => `${a}${a}`)
      .join('')
  }
  const rgb = []
  // 计算hex值
  for (let i = 0, len = result.length; i < len; i += 2) {
    rgb[i / 2] = getHexVal(result[i]) * 16 + getHexVal(result[i + 1])
  }
  function getHexVal(letter) {
    let num = -1
    switch (letter.toUpperCase()) {
      case 'A':
        num = 10
        break
      case 'B':
        num = 11
        break
      case 'C':
        num = 12
        break
      case 'D':
        num = 13
        break
      case 'E':
        num = 14
        break
      case 'F':
        num = 15
        break
    }

    if (num < 0) {
      num = Number(letter)
    }

    return num
  }
  return rgb
}

export { log, export_open, isEmpty }

export default {}
