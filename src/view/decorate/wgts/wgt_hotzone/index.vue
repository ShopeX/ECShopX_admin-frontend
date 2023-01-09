<style lang="scss"></style>
<template>
  <div
    :class="{
      'wgt-slider': true,
      'padded': value.padded
    }"
  >
    <div class="wgt-hd">
      <span class="title">{{ value.title }}</span>
      <span class="sub-title">{{ value.subtitle }}</span>
    </div>
    <div
      class="wgt-bd"
      :class="{
        'spaced': value.spaced
      }"
    >
      <el-image v-if="value.data.imgUrl" :src="value.data.imgUrl" :width="'100%'" />
    </div>
  </div>
</template>

<script>
import config from './config'
export default {
  name: 'HotZone',
  wgtName: '热区图',
  wgtIcon: 'wgt-slider',
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
    sliderHeight() {}
  },
  created() {},
  methods: {}
}
</script>
