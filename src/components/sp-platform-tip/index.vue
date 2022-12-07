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
    }
  },
  methods: {
    getTipText() {
      const tips = []
      platformList.forEach((item) => {
        if (this[item.value]) {
          tips.push(`${item.title}商城`)
        }
      })
      return `该功能支持${tips.join('，')}。`
    }
  }
}
</script>
