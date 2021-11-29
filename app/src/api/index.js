import { importAll } from '@/utils'
import req, { createAxios } from '@/utils/fetch'

const api = {}

importAll(require.context('./', false, /\.js$/), (key, r) => {
  const keyPath = key.match(/\.\/(.+)\.js$/)[1]
  if (!['index'].includes(keyPath)) {
    api[keyPath] = r(key)
  }
})

function install(Vue) {
  Vue.prototype.$api = api
  Vue.prototype.$http = req
}

export default api
export { req, createAxios, install }
