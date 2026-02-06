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
      <video-player
        :options="{
          aspectRatio: aspectRatio,
          sources: [
            {
              type: 'video/mp4',
              src: sourceUrl
            }
          ],
          notSupportedMessage: '添加视频源',
          suppressNotSupportedError: true,
          controlBar: false
        }"
      />
    </div>
  </div>
</template>

<script>
import config, { proportions } from './config'
import { getOuterStyle } from '../../comps/style-utils'
export default {
  name: 'Film',
  wgtName: '视频',
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
    }
  },
  created() {},
  methods: {}
}
</script>
