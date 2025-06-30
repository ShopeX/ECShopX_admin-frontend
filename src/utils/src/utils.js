import store from '@/store'
import Config from '@/config'

export function formatPrice(price, thousandth = true, prefix = '¥', suffix = '') {
  let formattedPrice = (price / 100).toFixed(2)
  if (thousandth && formattedPrice >= 1000) {
    formattedPrice = formattedPrice.toLocaleString()
  }
  return `${prefix}${formattedPrice}${suffix}`
}

export function formatNumber(price, thousandth = false) {
  let formattedPrice = price / 100
  if (thousandth && formattedPrice >= 1000) {
    formattedPrice = formattedPrice.toLocaleString()
  }
  return formattedPrice
}

export function export_open(tab) {
  setTimeout(() => {
    const login_type = store.getters.login_type
    if (login_type == 'distributor') {
      window.open(`/shopadmin/setting/export/list?tab=${tab}`)
    } else if (login_type == 'merchant') {
      window.open(`/merchant/setting/baseexport?tab=${tab}`)
    } else if (login_type == 'supplier') {
      window.open(`/supplier/setting/baseexport?tab=${tab}`)
    } else {
      window.open(`/data/report/export-record?tab=${tab}`)
    }
  }, 1000)
}

export function traverseTreeValues(tree, callback) {
  const paths = []
  tree.map(item => {
    let tempPath = item.path
    if (item.children) {
      tempPath += (tempPath.endsWith('/') ? '' : '/') + traverseTreeValues(item.children, callback)
    }
    paths.push(tempPath)
  })
  return paths
}

// 判断当前在哪个端，返回shopadmin、supplier、merchant
export function getBasePath() {
  return window.location.href.match(/\/(shopadmin|supplier|merchant)(\/.*)?$/)?.[1]
}

// 获取系统标题
export function getSystemTitle() {
  const basePath = getBasePath()
  if (basePath == 'shopadmin') {
    return Config.systemTitleShopadmin
  } else if (basePath == 'merchant') {
    return Config.systemTitleMerchant
  } else if (basePath == 'supplier') {
    return Config.systemTitleSupplier
  } else {
    return Config.systemTitle
  }
}

export function parsehslTohsla(hsl, alpha = 0.5) {
  const [h, s, l] = hsl.match(/\(([^)]+)\)/)?.[1].split(' ')
  return `hsla(${h}, ${s}, ${l}, ${alpha})`
}

export function downloadFile(url, name) {
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
