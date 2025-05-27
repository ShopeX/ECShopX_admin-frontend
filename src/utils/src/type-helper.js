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
