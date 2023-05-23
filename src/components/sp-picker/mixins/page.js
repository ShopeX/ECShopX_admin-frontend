export default {
  data () {
    return {
      pageCur: 1,
      pageSize: 18,
      pageCount: 0,
      loading: false
    }
  },
  computed: {
    pageTotal () {
      if (this.pageCount <= 0) return 1

      const total = Math.ceil(this.pageCount / this.pageSize)
      return total
    }
  },
  methods: {
    async refresh (isReset) {
      if (isReset) {
        this.resetPage()
      }
      await this.goPage(this.pageCur)
    },
    resetPage () {
      this.pageCur = 1
      this.pageCount = -1
    },
    nextPage () {
      return this.goPage(1)
    },
    async goPage (page = 1) {
      if (page > this.pageTotal && this.pageCount !== -1) {
        this.pageCur = this.pageTotal
      } else if (page < 0) {
        this.pageCur = 0
      } else {
        this.pageCur = page
      }
      this.loading = true
      const { count } = await this.fetch({
        page_no: this.pageCur,
        page_size: this.pageSize
      })
      this.loading = false
      this.pageCount = count
    }
  }
}
