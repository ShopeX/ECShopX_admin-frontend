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
      remarksType: ''
    }
  },
  methods: {
    clickShowRemark(row, type) {
      this.$refs.modalRef.showRemark(row, type)
      this.remarksType = type
    },
    handleRemarksDone() {
      if (this.remarksType === 'normalList') {
        this.$emit('refreshList')
      } else if (this.remarksType === 'normalList2') {
        this.getOrders(this.params)
      } else if (this.remarksType === 'afterList') {
        this.getAftersalesList(this.params)
      } else if (this.remarksType === 'orderDetail') {
        this.$emit('onRefresh')
      } else if (this.remarksType === 'afterDetail') {
        // this.aftersaleInfo()
      }
    }
  }
}
