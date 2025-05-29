// 提取searchSchema中默认值
export function generatorParams(options, data) {
  const _params = {}
  options.forEach((_schema) => {
    if (_schema.key) {
      if (data) {
        _params[_schema.key] = data[_schema.key]
      } else {
        _params[_schema.key] = _schema.defaultValue
      }
    }
  })
  return _params
}

// 绑定表单schema的this指向
export function bindThisForFormSchema(formSchema, target) {
  formSchema?.forEach((item) => {
    if (item?.component) {
      item.component = item.component.bind(target)
    }
    if (item?.validator) {
      item.validator = item.validator.bind(target)
    }
    if (item?.isShow) {
      item.isShow = item.isShow.bind(target)
    }
  })
  return formSchema
}
