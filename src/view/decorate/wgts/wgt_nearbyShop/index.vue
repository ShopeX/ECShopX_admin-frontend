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
    <div class="wgt-bd">
      <!-- 自定义部分 -->
      <div class="">zan kong</div>
    </div>
  </div>
</template>

<script>
import config from './config'
export default {
  name: 'NearbyShop',
  wgtName: '附近商家',
  wgtDesc: '',
  wgtIcon: 'wgt-nearby-shop',
  config: config,
  props: {
    value: [Object, Array]
  },
  data() {
    return {
      colorPrimary: ''
    }
  },
  computed: {},
  created() {},
  mounted() {
    this.colorPrimary = this.$store.getters.color_theme.primary
  },
  methods: {}
}
</script>
