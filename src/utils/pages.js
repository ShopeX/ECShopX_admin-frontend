class Pages {
  constructor(options = {}) {
    this.options = {
      page: 0,
      pageSize: 10,
      hasNext: true,
      total: 0,
      fetch: () => {},
      ...options
    }
    return this
  }

  setTotal(total) {
    this.options.total = total
    if (Math.ceil(total / this.options.pageSize) <= this.options.page) {
      this.options.hasNext = false
    }
  }

  setPage(page) {
    this.options.page = page
    // this.options.fetch({ page: this.options.page, pageSize: this.options.pageSize })
  }

  setPageSize(pageSize) {
    this.options.pageSize = pageSize
  }

  reset() {
    this.options.page = 1
    this.options.total = 0
    this.options.hasNext = true
    this.options.fetch({ page: this.options.page, pageSize: this.options.pageSize }, ...arguments)
  }

  refresh() {
    this.options.fetch({ page: this.options.page, pageSize: this.options.pageSize })
  }

  nextPage() {
    const { hasNext, fetch, pageSize } = this.options
    this.options.page++
    if (hasNext) {
      fetch({ page: this.options.page, pageSize }, ...arguments)
    }
    return this
  }
}

export default Pages
