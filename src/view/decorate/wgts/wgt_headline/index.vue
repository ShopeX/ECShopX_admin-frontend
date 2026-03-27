<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss" scoped>
.wgt-headline {
  .wgt-content {
    line-height: 60px;
    font-size: 20px;
    color: #333;
    font-weight: 600;
    padding: 0 8px;
  }
  .left {
    text-align: left;
  }
  .center {
    text-align: center;
  }
}
</style>

<template>
  <div
    :class="{
      'wgt-headline': true,
      padded: value.padded
    }"
    :style="outerStyle"
  >
    <div
      class="wgt-bd"
      :class="{
        spaced: value.spaced
      }"
    >
      <!-- 挂件自定义部分 -->
      <div
        :class="[
          'wgt-content',
          {
            center: value.float === 'center',
            left: value.float === 'left'
          }
        ]"
      >
        <span> {{ value.title }} </span>
      </div>
      <!-- 挂件自定义部分 -->
    </div>
  </div>
</template>
<script>
import config from './config'
import { i18n } from '@/i18n'
import { getOuterStyle } from '../../comps/style-utils'
export default {
  name: 'Headline',
  wgtName: i18n.t('ade966df.33a39d'),
  wgtDesc: '',
  wgtIcon: 'wgt-headline',
  config: config,
  props: {
    value: [Object, Array]
  },
  computed: {
    outerStyle() {
      return getOuterStyle(this.value)
    }
  }
}
</script>
