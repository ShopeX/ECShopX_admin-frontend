// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统 
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn 
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------

import { initFinder } from '@shopex/finder'
import { requestClient } from '@/api/request'

function install(Vue) {
  initFinder(Vue, {
    fetchLibrary: requestClient.instance,
    context: {
      qs: false,
      globalHooks: {
        beforeQuery: (p) => {
          const lang = window.localStorage.getItem('lang')
          const langMap = {
            zhcn: 'zh-CN',
            en: 'en-CN',
            zhtw: 'zh-TW'
          }

          let params = {
            ...p,
            pageSize: p.pageSize,
            page: p.pageNum,
            finderId: 100
          }
          if (lang) {
            params.country_code = langMap[lang]
          }
          // delete params.pageSize
          delete params.pageNum
          return params
        },
        afterQuery: (response) => {
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
