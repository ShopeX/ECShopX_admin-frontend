<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
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
  { value: 'weapp', titleKey: '19b2b717.439845' },
  { value: 'h5', titleKey: '19b2b717.830652' },
  { value: 'app', titleKey: '19b2b717.0bdbb2' },
  { value: 'pc', titleKey: '19b2b717.f0497f' },
  { value: 'alipay', titleKey: '19b2b717.42d922' }
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
      default: ''
    }
  },
  methods: {
    getTipText() {
      if (this.textVal) return this.textVal
      const tips = []
      platformList.forEach((item) => {
        if (this[item.value]) {
          tips.push(this.$t(item.titleKey) + this.$t('19b2b717.2c7b38'))
        }
      })
      return this.$t('19b2b717.042910') + tips.join('，') + this.$t('19b2b717.81197c')
    }
  }
}
</script>
