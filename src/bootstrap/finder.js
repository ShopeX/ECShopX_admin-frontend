import { initFinder } from '@shopex/finder'
import fetch from '@/utils/fetch'

function install(Vue) {
  initFinder(Vue, {
    fetchLibrary: fetch,
    context: {
      qs: false,
      globalHooks: {
        beforeQuery: p => {
          let params = {
            ...p,
            pageSize: p.pageSize,
            page: p.pageNum,
            finderId: 100
          }
          // delete params.pageSize
          delete params.pageNum
          return params
        },
        afterQuery: response => {
          const { status_code, message } = response.data.data
          if (status_code == 500) {
            return Vue.prototype.$message.error(message)
          } else {
            return {
              ...response.data.data,
              count: parseInt(response.data.data.total_count)
            }
          }
        }
      }
    }
  })
}

export { install }
