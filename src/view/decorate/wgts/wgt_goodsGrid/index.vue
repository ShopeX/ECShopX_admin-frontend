<style lang="scss" src="./index.scss"></style>
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
      <!-- {{JSON.stringify(value.data)}} -->
      <div>商品栅格</div>
    </div>
  </div>
</template>

<script>
import config from './config'
export default {
  name: 'GoodsGrid',
  wgtName: '商品栅格',
  wgtDesc: '',
  wgtIcon: 'wgt-goodsgrid',
  config: config,
  props: {
    value: [Object, Array]
  },
  data() {
    return {
      currentIndex: 1
    }
  },
  computed: {
    sliderHeight() {
      return ''
    }
  },
  created() {},
  methods: {}
}
</script>

