<style lang="scss">
.wgt-hotzone {
  &.padded {
    padding: 10px 0;
  }
  .wgt-hd {
    padding: 10px;
    .title {
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }
    .sub-title {
      color: #666;
      margin-left: 4px;
    }
  }
  .wgt-bd {
    position: relative;
    &.spaced {
      padding: 0 10px;
      .slider-container {
        right: 10px;
        left: 10px;
      }
      .slider-pagination {
        right: 10px;
        left: 10px;
      }
    }
  }
}
</style>
<template>
  <div
    :class="{
      'wgt-hotzone': true,
      padded: value.padded
    }"
  >
    <div v-if="value.title || value.subtitle" class="wgt-hd">
      <span class="title">{{ value.title }}</span>
      <span class="sub-title">{{ value.subtitle }}</span>
    </div>
    <div
      class="wgt-bd"
      :class="{
        spaced: value.spaced
      }"
    >
      <SpImage :src="value.data.imgUrl" />
    </div>
  </div>
</template>

<script>
import config from './config'
export default {
  name: 'ImgHotzone',
  wgtName: '热区图',
  wgtDesc: '',
  wgtIcon: 'wgt-hotzone',
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
