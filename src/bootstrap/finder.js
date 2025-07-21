import { initFinder } from '@shopex/finder'
import { requestClient } from '@/api/request'

function install(Vue) {
  initFinder(Vue, {
    fetchLibrary: requestClient.instance,
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
      },
      locale: {
        search: '搜索',
        reset: '重置',
        open: '展开',
        retract: '收起',
        operation: '操作',
        enter: '请输入',
        choose: '请选择',
        more: '更多',
        empty: '不能为空',
        return: '返回',
        save: '保存'
      }
    }
  })
}

export { install }
