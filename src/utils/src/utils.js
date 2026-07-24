/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import store from '@/store'
import Config from '@/config'

export function formatPrice(price, thousandth = true, prefix = '¥', suffix = '') {
  let formattedPrice = (price / 100).toFixed(2)
  if (thousandth && formattedPrice >= 1000) {
    formattedPrice = formattedPrice.toLocaleString()
  }
  return `${prefix}${formattedPrice}${suffix}`
}

export function getCurrencySymbol(row = {}, keys = ['cur_fee_symbol', 'curFeeSymbol', 'fee_symbol', 'feeSymbol']) {
  for (const key of keys) {
    if (row[key]) {
      return row[key]
    }
  }
  return '¥'
}

export function formatMoneyWithSymbol(amountInCents, symbol = '¥') {
  if (amountInCents === null || amountInCents === undefined || amountInCents === '') {
    return `${symbol}0.00`
  }
  const normalized = Number(amountInCents)
  if (Number.isNaN(normalized)) {
    return `${symbol}0.00`
  }
  return `${symbol}${(normalized / 100).toFixed(2)}`
}

export function formatNumber(price, thousandth = false) {
  let formattedPrice = price / 100
  if (thousandth && formattedPrice >= 1000) {
    formattedPrice = formattedPrice.toLocaleString()
  }
  return formattedPrice
}

export function isInSalesCenter() {
  if (window.self != window.top && window.self.location.href.indexOf('iframeLogin') < 0) {
    return true
  } else {
    false
  }
}

/** 与导出列表页路由一致，供 export_open / export_open_blank 共用 */
export function getExportListPathWithTab(tab) {
  const q = encodeURIComponent(tab || '')
  const login_type = store.getters.login_type
  if (login_type == 'distributor') {
    return `/shopadmin/setting/export/list?tab=${q}`
  }
  if (login_type == 'merchant') {
    return `/merchant/setting/baseexport?tab=${q}`
  }
  if (login_type == 'supplier') {
    return `/supplier/setting/export/list?tab=${q}`
  }
  return `/data/report/export-record?tab=${q}`
}

export function export_open(tab) {
  setTimeout(() => {
    const url = getExportListPathWithTab(tab)
    if (isInSalesCenter()) {
      this.$router.push(url)
    } else {
      window.open(url, '_blank')
    }
  }, 1000)
}

/** 始终在浏览器新标签页打开导出列表（不替换当前页），用于异步导出成功后的引导 */
export function export_open_blank(tab) {
  setTimeout(() => {
    const url = getExportListPathWithTab(tab)
    window.open(url, '_blank')
  }, 1000)
}

export function traverseTreeValues(tree, callback) {
  const paths = []
  tree.map((item) => {
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

export function unmountGlobalLoading() {
  // 查找全局 loading 元素
  const loadingElement = document.querySelector('#__app-loading__')
  if (loadingElement) {
    // 添加隐藏类，触发过渡动画
    loadingElement.classList.add('hidden')

    // 查找所有需要移除的注入 loading 元素
    const injectLoadingElements = document.querySelectorAll('[data-app-loading^="inject"]')

    // 当过渡动画结束时，移除 loading 元素和所有注入的 loading 元素
    loadingElement.addEventListener(
      'transitionend',
      () => {
        loadingElement.remove() // 移除 loading 元素
        injectLoadingElements.forEach((el) => el.remove()) // 移除所有注入的 loading 元素
      },
      { once: true }
    ) // 确保事件只触发一次
  }
}
