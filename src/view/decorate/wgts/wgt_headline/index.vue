<style lang="scss" scoped>
.wgt-headline {
  .wgt-content {
    line-height: 60px;
    font-size: 20px;
    color: #333;
    font-weight: 600;
    padding: 0 8px;
  }
  .left {
    text-align: left;
  }
  .center {
    text-align: center;
  }
}
</style>

<template>
  <div
    :class="{
      'wgt-headline': true,
      padded: value.padded
    }"
  >
    <div
      class="wgt-bd"
      :class="{
        spaced: value.spaced
      }"
    >
      <!-- 挂件自定义部分 -->
      <div
        :class="[
          'wgt-content',
          {
            center: value.float === 'center',
            left: value.float === 'left'
          }
        ]"
      >
        <span> {{ value.title }} </span>
      </div>
      <!-- 挂件自定义部分 -->
    </div>
  </div>
</template>
<script>
import config from './config'
export default {
  name: 'Headline',
  wgtName: '文字标题',
  wgtDesc: '',
  wgtIcon: 'wgt-headline',
  config: config,
  props: {
    value: [Object, Array]
  }
}
</script>
