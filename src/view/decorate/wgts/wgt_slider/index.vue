<style lang="scss" src="./index.scss"></style>
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
      <!-- {{JSON.stringify(value.data)}} -->
      <SpImage
        class="placeholder-item"
        :src="value.data.length > 1 ? value.data[0].url : null"
        :width="'100%'"
      />
      <el-carousel
        class="slider-container"
        arrow="never"
        indicator-position="none"
        :interval="value.interval"
        @change="
          (e) => {
            this.currentIndex = e
          }
        "
      >
        <el-carousel-item
          v-for="(item, index) in value.data.length > 0 ? value.data : [1]"
          :key="index"
          class="slider-item"
          :class="{
            'rounded': value.rounded
          }"
        >
          <SpImage
            :class="{
              'rounded': value.rounded
            }"
            :width="'100%'"
            :src="item.url"
          />
        </el-carousel-item>
      </el-carousel>
      <div :class="['slider-pagination', value.dotLocation, value.shape, value.dotColor, {}]">
        <template v-if="value.dot">
          <div class="dot-item">
            {{ `${currentIndex}/${value.data.length > 0 ? value.data.length : 1}` }}
          </div>
        </template>
        <template v-else>
          <div
            v-for="(item, index) in value.data.length > 0 ? value.data : [1]"
            :key="`pagination-item__${index}`"
            class="pagination-item"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import config from './config'
export default {
  name: 'WgtSlider',
  wgtName: '轮播',
  wgtIcon: 'wgt-slider',
  config: config,
  props: {
    value: [Object, Array]
  },
  data() {
    return {
      currentIndex: 0
    }
  },
  computed: {
    sliderHeight() {}
  },
  created() {},
  methods: {}
}
</script>
