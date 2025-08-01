import { importAll } from '@/utils'
// import req, { createAxios } from '@/utils/fetch'
import { fetch } from './request'

const api = {}

const callbackWrap = (fn) => {
  const _fn = async (...arg) => {
    // console.log(arguments.length, ...arg)
    const res = await fn(...arg)
    return res.data.data
  }
  return _fn
}
importAll(require.context('./', true, /\.js$/), (key, r) => {
  // const keyPath = key.match(/\.\/(.+)\.js$/)?.[1]
  const keyPath = key.match(/\/([^\/]+)\.js$/)?.[1]
  if (!['index'].includes(keyPath)) {
    const fn = {}
    Object.keys(r(key)).forEach((n) => {
      fn[n] = callbackWrap(r(key)[n])
    })
    api[keyPath] = typeof api[keyPath] === 'undefined' ? fn : { ...api[keyPath], ...fn }
  }
})

function install(Vue) {
  Vue.prototype.$api = api
  Vue.prototype.$http = fetch
}

export default api
export { fetch, install }
