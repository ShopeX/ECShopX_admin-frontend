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
      <video-player
        class="vjs-custom-skin"
        :options="{
          aspectRatio: aspectRatio,
          sources: [
            {
              // mp4
              type: 'video/mp4',
              src: data[0].url
            }
          ],
          notSupportedMessage: '无可播放媒体资源',
          controlBar: false
        }"
      />
    </div>
  </div>
</template>

<script>
const aspectRatios = ['16:9', '9:16', '4:3', '3:4', '1:1']
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
