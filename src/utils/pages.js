class Pages {
  constructor(options = {}) {
    this.options = {
      page: 1,
      pageSize: 8,
      nextPage: true,
      ...options
    }
    return this
  }

  setTotal(total) {
    console.log(this)
    if (Math.ceil(total / this.options.pageSize) > this.options.page) {
      this.options.page++
    } else {
      this.options.nextPage = false
    }
  }
}

export default Pages
