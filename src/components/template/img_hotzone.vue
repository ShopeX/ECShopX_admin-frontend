<template>
  <div class="component-wrap" :class="{ 'component-padded': base.padded, active: active }">
    <div class="current-active" />
    <div v-if="base.title" class="component-header">
      <div class="component-title">
        <div>{{ base.title }}</div>
        <div class="subtitle">
          {{ base.subtitle }}
        </div>
      </div>
      <!-- <div class="component-more">
        <div class="three-dot"></div>
      </div> -->
    </div>
    <div class="img-hotzone">
      <img :src="config.imgUrl" alt="">
      <div
        v-for="(item, index) in data"
        :key="index"
        class="zone"
        :style="{
          width: getZoneStyle(item.widthPer),
          height: getZoneStyle(item.heightPer),
          top: getZoneStyle(item.topPer),
          left: getZoneStyle(item.leftPer)
        }"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    res: {
      type: Object,
      default: {}
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      base: {},
      config: {},
      data: []
    }
  },
  watch: {
    res(value) {
      if (value) {
        this.setData(value)
      }
    }
  },
  mounted() {
    this.setData(this.res)
  },
  methods: {
    setData(val) {
      this.base = val.base
      this.config = val.config
      this.data = val.data
    },
    getZoneStyle(val) {
      return `${(val || 0) * 100}%`
    }
  }
}
</script>

<style scoped lang="scss">
.img-hotzone {
  position: relative;
  img {
    width: 100%;
    user-select: none;
    -webkit-user-drag: none;
    -webkit-touch-callout: none;
  }
  .zone {
    position: absolute;
    cursor: pointer;
  }
}
</style>
