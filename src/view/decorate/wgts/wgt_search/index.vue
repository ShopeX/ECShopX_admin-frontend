
<template>
    <div
    :class="{
      'wgt-slider': true,
      'padded': value.padded
    }"
  >
    <div v-if="value.title || value.subtitle" class="wgt-hd">
      <span class="title">{{ value.title }}</span>
      <span class="sub-title">{{ value.subtitle }}</span>
    </div>
    <div
      class="wgt-bd"
      :class="{
        'spaced': value.spaced
      }"
      >
      <div class="wgt-search">
        <span class="bg"> 搜索想要的商品 </span>
      </div>
    </div>
  </div>
</template>
<script>
import config from './config'
export default {
  name: 'Search',
  wgtName: '搜索',
  wgtDesc: '',
  wgtIcon: 'wgt-search',
  config: config,
  props: {
    value: [Object, Array]
  },
}
</script>
<style lang="scss" scoped>
.wgt-slider {
  .wgt-search{
    height: 40px;
    line-height: 40px;
    text-align: center;
    .bg{
      width: 80%;
      display: inline-block;
      background: #ccc;
      border-radius: 20px;
    }
  }
}
</style>
