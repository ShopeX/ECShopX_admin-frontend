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
