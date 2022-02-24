import { importAll } from '@/utils'
import req, { createAxios } from '@/utils/fetch'

const api = {}

const callbackWrap = (fn) => {
  const _fn = async (args) => {
    const res = await fn(args)
    return res.data.data
  }
  return _fn
}
importAll(require.context('./', false, /\.js$/), (key, r) => {
  const keyPath = key.match(/\.\/(.+)\.js$/)[1]
  if (!['index'].includes(keyPath)) {
    const fn = {}
    Object.keys(r(key)).forEach((n) => {
      fn[n] = callbackWrap(r(key)[n])
    })
    api[keyPath] = fn
  }
})

function install(Vue) {
  Vue.prototype.$api = api
  Vue.prototype.$http = req
}

export default api
export { req, createAxios, install }
