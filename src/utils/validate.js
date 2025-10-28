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

/* 是否是手机号 */
export function isMobile(str) {
  // const reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/
  const reg = /^(1\d{10})$/
  return reg.test(str.trim())
}

/* 是否是公司邮箱 */
// export function isWscnEmail (str) {
//   const reg = /^[a-z0-9](?:[-_.+]?[a-z0-9]+)*@shopex\.cn$/i
//   return reg.test(str.trim())
// }

/* 合法uri */
export function validateURL(textval) {
  const urlregex =
    /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}
// export function vaildateIdCard (val) {
//   val = Number(val)
//   const reg = /^(\d{18,18}|\d{15,15}|\d{17,17}X)$/
//   return reg.test(val)
// }
export function vaildateIdCard(value) {
  value = Number(value)
  const reg = /^(\d{18,18}|\d{15,15}|\d{17,17}X)$/
  return reg.test(value)
}
export function validEmail(email) {
  const reg =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}
/* 小写字母 */
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 验证key */
export function validateKey(str) {
  var reg = /^[a-z_\-:]+$/
  return reg.test(str)
}

/* 大写字母 */
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母 */
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/* 上传图片 */
export function validatUploadImage(file) {
  const MAX_IMG_SIZE = 10
  let isJPG = file.raw.type === 'image/jpeg'
  let isPNG = file.raw.type === 'image/png'
  let isGIF = file.raw.type === 'image/gif'
  let isLt2M = file.raw.size / 1024 / 1024 <= MAX_IMG_SIZE
  if (!isJPG && !isPNG && !isGIF) {
    return '上传图片只能是 JPG、PNG、GIF 格式!'
  }
  if (!isLt2M) {
    return `上传图片大小不能超过 ${MAX_IMG_SIZE}MB!`
  }
  return true
}

/* 上传视频 */
export function validatUploadVideo(file) {
  let isMP4 = file.raw.type === 'image/mp4'
  let isLt15M = file.raw.size / 1024 / 1024 <= 5
  if (!isMP4) {
    return '上传视频只能是 MP4 格式!'
  }
  if (!isLt15M) {
    return '上传视频大小不能超过 5MB!'
  }
  return true
}

export const requiredRules = (name, trigger = 'blur') => {
  if (trigger == 'change') {
    return { required: true, message: `请选择${name}`, trigger }
  } else {
    return { required: true, message: `请输入${name}`, trigger }
  }
}
export const MaxRules = (size) => {
  return { max: size, message: `长度最多在${size}个字符`, trigger: 'blur' }
}

export const MinRules = (size) => {
  return { min: size, message: `长度最少在${size}个字符`, trigger: 'blur' }
}

export const isNumber = (val) => {
  return /^-?\d+$/.test(val)
}

export const isFloat = (val) => {
  return /^(-?\d+)(\.\d+)?$/.test(val)
}
