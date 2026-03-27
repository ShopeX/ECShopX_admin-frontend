<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss">
.wgt-film {
  &.padded {
    padding: 10px 0;
  }
  .wgt-hd {
    padding: 10px;
    .title {
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }
    .sub-title {
      color: #666;
      margin-left: 4px;
    }
  }
  .video-player {
    .vjs-big-play-button {
      display: none;
    }
    .vjs-error-display {
      &::before {
        display: none;
      }
    }
    .vjs-modal-dialog-content {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
<template>
  <div
    :class="{
      'wgt-film': true,
      padded: value.padded
    }"
    :style="outerStyle"
  >
    <div class="wgt-bd">
      <!-- 挂件自定义部分 -->
      <video-player :options="videoOptions" />
    </div>
  </div>
</template>

<script>
import { i18n } from '@/i18n'
import config, { proportions } from './config'
import { getOuterStyle } from '../../comps/style-utils'
export default {
  name: 'Film',
  wgtName: i18n.t('cd407b12.7fcf42'),
  wgtDesc: '',
  wgtIcon: 'video-two',
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
    outerStyle() {
      return getOuterStyle(this.value)
    },
    aspectRatio() {
      const { proportion } = this.value
      return proportions.find((item) => item.label == proportion).name
    },
    sourceUrl() {
      const { data } = this.value
      return data?.url || ''
    },
    videoOptions() {
      return {
        aspectRatio: this.aspectRatio,
        sources: [{ type: 'video/mp4', src: this.sourceUrl }],
        notSupportedMessage: i18n.t('cd407b12.63ca71'),
        suppressNotSupportedError: true,
        controlBar: false
      }
    }
  },
  created() {},
  methods: {}
}
</script>
