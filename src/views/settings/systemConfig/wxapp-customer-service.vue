<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <div class="container">
      <SpPlatformTip v-if="!VERSION_SHUYUN()" />

      <div class="info">
        <div class="text">
          <img :src="normal" class="img" />
          <div>
            {{ $t('91deb7ee.42e3da') }}
          </div>
        </div>
        <div class="button">
          <el-button type="primary" @click="handleConfig">{{ $t('91deb7ee.a532be') }}</el-button>
        </div>
      </div>

      <div class="card">
        <div class="card-title">
          <i class="el-icon-question" />
          <span class="text">{{ $t('91deb7ee.097490') }}</span>
        </div>

        <div class="card-info">
          {{ $t('91deb7ee.436174') }}“<span class="weight">{{ $t('91deb7ee.997c7a') }}</span
          >“<span class="weight">{{ $t('91deb7ee.d519b8') }}</span
          >{{ $t('91deb7ee.cfbd22') }}

          <img :src="wechat" class="img" />
        </div>
      </div>
    </div>
  </SpPage>
</template>

<script>
const normal = require(`@/assets/img/ecshopx/1-Normal.png`)
const wechat = require(`@/assets/img/ecshopx/kefu.png`)
export default {
  data() {
    return {
      normal,
      wechat
    }
  },
  methods: {
    handleConfig() {
      location.href = 'https://mp.weixin.qq.com/wxamp/wakf'
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  .title {
    font-size: 16px;
    color: #3d4355;
  }
  .info {
    height: 60px;
    background: #f2fbff;
    border-radius: 4px;
    border: 1px solid #ccecff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px 0 20px;
    margin-top: 16px;

    .text {
      display: flex;
      align-items: center;
      .img {
        width: 40px;
        height: 40px;
      }
    }

    .button {
      width: 80px;
      flex-basis: 80px;
      text-align: right;
    }
  }
  .card {
    margin-top: 38px;
    background: #ffffff;
    border-radius: 2px;
    border: 1px solid #e8e8e8;
    padding: 16px;

    &-title {
      .text {
        font-size: 14px;
        color: #3d4355;
      }
    }
    &-info {
      margin-top: 8px;
      .weight {
        font-weight: 600;
      }
      .img {
        margin-top: 16px;
        height: 310px;
        display: block;
      }
    }
  }
}
</style>
