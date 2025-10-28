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
