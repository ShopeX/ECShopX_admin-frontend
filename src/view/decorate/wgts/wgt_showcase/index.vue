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
    <div
      class="wgt-bd"
      :class="{
        'spaced': value.spaced
      }"
    >
      Showcase
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
