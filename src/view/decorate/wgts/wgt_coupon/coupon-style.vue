<style lang="scss">
.coupon-style {
  @include clearfix();
  .style-item {
    float: left;
    margin: 0 20px 10px 0;
    text-align: center;
  }
  .el-radio__label {
    font-size: 13px;
  }
  .style-icon {
    width: 64px;
    height: 64px;
    display: block;
  }
}
</style>
<template>
  <div class="coupon-style">
    <div v-for="(item, index) in styles" :key="`style-item__${index}`" class="style-item">
      <img class="style-icon" :src="item.icon">
      <el-radio v-model="localValue" :label="item.value">{{ item.label }}</el-radio>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CouponStyle',
  props: {
    value: {
      type: String
    }
  },
  data() {
    return {
      styles: [
        {
          icon: require('./img/style_1.png'),
          label: '样式一',
          value: '1'
        },
        {
          icon: require('./img/style_2.png'),
          label: '样式二',
          value: '2'
        },
        {
          icon: require('./img/style_3.png'),
          label: '样式三',
          value: '3'
        },
        {
          icon: require('./img/style_4.png'),
          label: '样式四',
          value: '4'
        }
      ],
      localValue: this.value
    }
  },
  watch: {
    localValue: function (nVal, oVal) {
      this.$emit('input', nVal)
    }
  },
  // created() {
  //   this.localValue = this.value
  // },
  methods: {}
}
</script>
