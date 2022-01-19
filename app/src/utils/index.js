import log from './log'
import CommonUtil from "@/common/js/util";

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

export function isBoolean(val) {
  return isPrimitiveType( val, '[object Boolean]' )
}

export function isInSalesCenter () {
  if (
    window.self != window.top &&
    window.self.location.href.indexOf("iframeLogin") < 0
  ) {
    return true;
  } else {
    false;
  }
}

export function isInMerchant(){
  return /\/merchant/.test(window.location.pathname)
}

export function importAll (r, fn = (key, r) => r(key)) {
  r.keys().forEach((key) => fn(key, r))
}

export function rand (max) {
  return Math.floor(Math.random() * max)
}
//getRandwords 获取随机字符串
export function getRandwords (ls = 8) {
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

export function  dateFilter(time, pattern = "yyyy-MM-dd hh:mm:ss") {
  console.log("dateFilter",time)
  if (time !== -1) {
    return CommonUtil.formatDate.format(new Date(time * 1000), pattern);
  } else {
    let timestamp = Date.parse(new Date()) / 1000;
    return CommonUtil.formatDate.format(
      new Date(timestamp * 1000),
      pattern
    );
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
      cmd: "notExistAuth",
    },
    "*"
  );
}

export {
  log
}


export default {}
