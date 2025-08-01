<style lang="scss" src="./index.scss"></style>
<template>
  <div
    :class="{
      'wgt-img-navigation': true,
      padded: value.padded
    }"
  >
    <div v-if="value.title || value.subtitle" class="wgt-hd">
      <span class="title">{{ value.title }}</span>
      <span class="sub-title">{{ value.subtitle }}</span>
    </div>
    <div class="wgt-bd">
      <!-- 挂件自定义部分 -->
      <div
        v-for="(item, index) in value.data"
        :key="`nav-item__${index}`"
        class="nav-item"
        :style="getNavItemStyle"
      >
        <div class="nav-image">
          <SpImage :src="item.imgUrl" :circle="8" :style="getNavItemImageStyle" />
        </div>
        <div v-if="item.content" class="nav-item--content">{{ item.content }}</div>
      </div>
      <!-- 挂件自定义部分 -->
    </div>
  </div>
</template>
<script>
import config from './config'
export default {
  name: 'Navigation',
  wgtName: '图片导航',
  wgtDesc: '',
  wgtIcon: 'wgt-img-navigation',
  config,
  props: {
    value: []
  },
  computed: {
    getNavItemStyle() {
      const { length } = this.value.data
      return {
        width: `${100 / length}%`
      }
    },
    getNavItemImageStyle() {
      const { length } = this.value.data
      return {
        // width: '100%',
        height: `${(375 - (length + 1) * 8) / length}px`
      }
    }
  },
  mounted() {}
}
</script>
