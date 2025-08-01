export default {
  data() {
    return {
      tableList: [],
      page: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      }
    }
  },
  methods: {
    onCurrentChange(pageIndex) {
      this.page.pageIndex = pageIndex
      this.fetchList(this.page)
    },
    onSizeChange(pageSize) {
      this.page.pageSize = pageSize
      this.fetchList(this.page)
    },
    onSearch() {
      this.page.pageIndex = 1
      this.fetchList(this.page)
    },
    onRefresh() {
      this.fetchList(this.page)
    }
  }
}
