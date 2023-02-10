<style lang="scss" src="./index.scss"></style>
<template>
  <div
    :class="{
      'wgt-store': true,
      'padded': value.padded
    }"
  >
    <div v-if="value.title || value.subtitle" class="wgt-hd">
      <span class="title">{{ value.title }}</span>
      <span class="sub-title">{{ value.subtitle }}</span>
    </div>
    <div class="wgt-bd">
      <div class="wgt-block">
        <div class="store-info">
          <SpImage :width="40" :height="40" :circle="8" />
          <div class="name">店铺名称</div>
        </div>
        <div class="activity-goods">
          <div class="activity-img"><SpImage /></div>
          <div class="goods-list">
            <div
              v-for="(item, index) in [1, 2, 3, 4, 5, 6, 7]"
              :key="`goods-item__${index}`"
              class="goods-item"
            >
              <SpImage :width="96" :height="96" />
              <div>123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import config from './config'
export default {
  name: 'Store',
  wgtName: '推荐店铺',
  wgtDesc: '',
  wgtIcon: 'wgt-store',
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
