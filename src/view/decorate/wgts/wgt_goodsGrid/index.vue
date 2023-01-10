<style lang="scss"></style>
<template>
  <div>goodsGrid</div>
</template>

<script>
import config from './config'
export default {
  name: 'GoodsGrid',
  wgtName: '商品栅格',
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
    sliderHeight() {}
  },
  created() {},
  methods: {}
}
</script>
