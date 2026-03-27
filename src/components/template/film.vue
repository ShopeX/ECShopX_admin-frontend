<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

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
    <div v-if="data[0]">
      <video-player class="vjs-custom-skin" :options="videoOptions" />
    </div>
  </div>
</template>

<script>
const aspectRatios = ['16:9', '9:16', '4:3', '3:4', '1:1']
export default {
  computed: {
    videoOptions() {
      return {
        aspectRatio: this.aspectRatio,
        sources: [{ type: 'video/mp4', src: this.data[0].url }],
        notSupportedMessage: this.$t('310ffd4e.b0c005'),
        controlBar: false
      }
    }
  },
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
      data: [],
      aspectRatio: '16:9'
    }
  },
  watch: {
    res: {
      deep: true,
      handler(value) {
        if (value) {
          this.setData(value)
        }
      }
    }
  },
  mounted() {
    this.setData(this.res)
  },
  methods: {
    setData(val) {
      this.base = val.base
      const { proportion = 0 } = val.base
      this.data = val.data
      this.aspectRatio = aspectRatios[proportion]
    }
  }
}
</script>

<style scoped lang="scss">
.component-title {
  display: flex;
  justify-content: flex-start;
}
</style>
