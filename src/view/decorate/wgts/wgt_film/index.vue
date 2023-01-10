<style lang="scss"></style>
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
    <div
      class="wgt-bd"
      :class="{
        'spaced': value.spaced
      }"
    >
      <video-player
        :options="{
          aspectRatio: aspectRatio,
          sources: [
            {
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
import config, { proportions } from './config'
export default {
  name: 'Film',
  wgtName: '视频',
  wgtIcon: 'wgt-film',
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
