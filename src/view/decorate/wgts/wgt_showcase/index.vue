<style lang="scss" src="./index.scss"></style>
<template>
  <div
    :class="{
      'wgt-showcase': true,
      'padded': value.padded
    }"
  >
    <div v-if="value.title || value.subtitle" class="wgt-hd">
      <span class="title">{{ value.title }}</span>
      <span class="sub-title">{{ value.subtitle }}</span>
    </div>
    <div class="wgt-bd">
      <!-- 挂件自定义部分 -->
      <div class="lf">
        <sp-image :src="value.data[0].imgUrl" :circle="8" />
      </div>
      <div class="rg">
        <div class="tp"><sp-image :src="value.data[1].imgUrl" :circle="8" /></div>
        <div class="bt"><sp-image :src="value.data[2].imgUrl" :circle="8" /></div>
      </div>
      <!-- 挂件自定义部分 -->
    </div>
  </div>
</template>

<script>
import config from './config'
export default {
  name: 'Showcase',
  wgtName: '橱窗',
  wgtDesc: '',
  wgtIcon: 'wgt-showcase',
  config: config,
  props: {
    value: [Object, Array]
  },
  data() {
    return {}
  },
  created() {},
  methods: {}
}
</script>
