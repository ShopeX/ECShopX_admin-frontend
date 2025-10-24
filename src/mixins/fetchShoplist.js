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

/* 下拉列表请求 */
import { getDistributorList } from '@/api/marketing'
import { getWxShopsList } from '@/api/shop'
export var shoplistMixin = {
  props: {
    wxshops: {
      type: Boolean,
      default: false
    },
    distributors: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      list: [],
      exist_shop: true,
      desc: ''
    }
  },
  methods: {
    async getList(refresh) {
      this.exist_shop = true
      this.desc = this.wxshops ? '请选择门店' : '请选择店铺'
      const data = this.wxshops ? await this.getWxShopsList() : await this.getDistributorList()
      const list = data.data.list
      this.list = refresh ? list : [...this.list, ...list]
      this.total = data.data.total_count
      if (this.total === 0) {
        this.exist_shop = false
      }
    },
    async getWxShopsList() {
      const { data } = await getWxShopsList(this.params)
      return data
    },
    async getDistributorList() {
      const { data } = await getDistributorList({ ...this.params })
      return data
    }
  }
}
