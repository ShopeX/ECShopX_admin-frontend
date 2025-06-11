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
