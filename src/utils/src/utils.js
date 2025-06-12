import store from '@/store'

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
      window.open(`/shopadmin/shopsetting/baseexport?tab=${tab}`)
    } else if (login_type == 'merchant') {
      window.open(`/merchant/setting/baseexport?tab=${tab}`)
    } else if (login_type == 'supplier') {
      window.open(`/supplier/setting/baseexport?tab=${tab}`)
    } else {
      window.open(`/companydata/report/baseexport?tab=${tab}`)
    }
  }, 1000)
}
