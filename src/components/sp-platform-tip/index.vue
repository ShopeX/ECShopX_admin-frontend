<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<style lang="scss" scoped>
.sp-flatform-tip {
  background-color: #fffbe6;
  color: #777;
  font-size: 13px;
  height: 28px;
  line-height: 28px;
  padding: 0 6px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  .el-icon-info {
    margin-right: 2px;
    color: #faad14;
  }
}
</style>
<template>
  <div class="sp-flatform-tip">
    <i class="el-alert__icon el-icon-info" />
    {{ getTipText() }}
  </div>
</template>

<script>
const platformList = [
  { value: 'weapp', title: '微信小程序' },
  { value: 'h5', title: 'H5' },
  { value: 'app', title: 'APP' },
  { value: 'pc', title: 'PC网页版' },
  { value: 'alipay', title: '支付宝小程序' }
]

export default {
  name: 'SpPlatformTip',
  props: {
    weapp: {
      type: Boolean,
      default: true
    },
    h5: {
      type: Boolean,
      default: false
    },
    app: {
      type: Boolean,
      default: false
    },
    pc: {
      type: Boolean,
      default: false
    },
    alipay: {
      type: Boolean,
      default: false
    },
    textVal: {
      type: String,
      default:''
    }
  },
  methods: {
    getTipText() {
      if(this.textVal)return this.textVal
      const tips = []
      platformList.forEach(item => {
        if (this[item.value]) {
          tips.push(`${item.title}商城`)
        }
      })
      return `该功能支持${tips.join('，')}。`
    }
  }
}
</script>
