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

/**
 * 通用分页工厂函数
 * @param {Function} fetchFn - (params) => Promise<{list, total}>
 * @param {Object} defaultParams - 额外的查询参数
 */
function usePagination(
  fetchFn,
  {
    defaultParams = {},
    onBeforeFetch = () => {},
    onAfterFetch = () => {},
    onFetchFinally = () => {}
  }
) {
  const state = {
    loading: false,
    data: [],
    page: 1,
    pageSize: 10,
    total: 0,
    hasNext: true,
    params: Object.assign({}, defaultParams)
  }

  function fetchData(extra = {}) {
    state.loading = true
    onBeforeFetch(state)
    return fetchFn(
      Object.assign(
        {
          page: state.page,
          pageSize: state.pageSize
        },
        state.params,
        extra
      )
    )
      .then((res) => {
        state.data = res.list || []
        state.total = res.total || 0
        state.hasNext = state.page * state.pageSize < state.total
        onAfterFetch(state)
        return res
      })
      .finally(() => {
        state.loading = false
        onFetchFinally(state)
      })
  }

  function onPageChange(val) {
    state.page = val
    fetchData()
  }

  function onPageSizeChange(val) {
    state.pageSize = val
    state.page = 1
    fetchData()
  }

  function reset() {
    state.page = 1
    state.total = 0
    state.hasNext = true
    fetchData()
  }

  function nextPage() {
    if (state.hasNext) {
      state.page++
      fetchData()
    }
  }

  return {
    state,
    fetchData,
    onPageChange,
    onPageSizeChange,
    reset,
    nextPage
  }
}

export { usePagination }
