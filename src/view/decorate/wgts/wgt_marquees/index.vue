<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss">
.wgt-marquees {
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

  .wgt-bd {
  }

  .medium {
    padding: 0 16px;
    line-height: 32px;
    font-size: 13px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
<template>
  <div
    :class="{
      'wgt-marquees': true,
      padded: value.padded
    }"
    :style="outerStyle"
  >
    <div
      class="wgt-bd"
      :style="{
        background: value.bgcolor
      }"
    >
      <!-- 挂件自定义部分 -->
      <template v-if="value.direction == 'vertical'">
        <el-carousel height="30px" direction="vertical" :autoplay="true" indicator-position="none">
          <el-carousel-item v-for="(item, index) in value.dataContent" :key="index">
            <div
              :style="{
                color: value.fontcolor
              }"
              class="medium"
            >
              {{ item.title }}
            </div>
          </el-carousel-item>
        </el-carousel>
      </template>

      <template v-else>
        <marquee style="margin: 4px 0; display: block" scrolldelay="200">
          <span
            v-for="(item, index) in value.dataText"
            :key="index"
            :style="{
              color: value.fontcolor
            }"
            >{{ item.title }}</span
          >
        </marquee>
      </template>

      <!-- 挂件自定义部分 -->
    </div>
  </div>
</template>

<script>
import config from './config'
import { i18n } from '@/i18n'
import { getOuterStyle } from '../../comps/style-utils'
export default {
  name: 'Marquees',
  wgtName: i18n.t('17b1b213.917617'),
  wgtDesc: '',
  wgtIcon: 'announcement',
  config: config,
  props: {
    value: [Object, Array]
  },
  data() {
    return {}
  },
  computed: {
    outerStyle() {
      return getOuterStyle(this.value)
    }
  },
  created() {},
  methods: {}
}
</script>
