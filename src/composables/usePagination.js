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

export default usePagination
