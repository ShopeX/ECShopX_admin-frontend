<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <div v-loading="loading" class="container">
      <SpPlatformTip v-if="!VERSION_SHUYUN()" />

      <div class="section-white switch-row">
        <div class="switch-label">{{ $t('91deb7ee.107a88') }}</div>
        <el-switch
          v-model="form.show_float"
          :active-value="1"
          :inactive-value="0"
          :active-text="$t('91deb7ee.cc42dd')"
          :inactive-text="$t('91deb7ee.b15d91')"
          active-color="#13ce66"
          inactive-color="#ccc"
          @change="onSwitchChange"
        />
        <span class="switch-tip">{{ $t('91deb7ee.a87a90') }}</span>
      </div>

      <div class="info">
        <div class="text">
          <img :src="normal" class="img">
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

          <img :src="wechat" class="img">
        </div>
      </div>
    </div>
  </SpPage>
</template>

<script>
import { getWorkWechatConfig, setWorkWechatConfig } from '@/api/wechat'

const normal = require(`@/assets/img/ecshopx/1-Normal.png`)
const wechat = require(`@/assets/img/ecshopx/kefu.png`)
export default {
  data() {
    return {
      normal,
      wechat,
      loading: false,
      configData: {},
      form: {
        show_float: 0
      }
    }
  },
  mounted() {
    this.getConfig()
  },
  methods: {
    getConfig() {
      this.loading = true
      getWorkWechatConfig()
        .then((res) => {
          console.log(res)
          const data = res.data?.data || {}
          this.configData = { ...data }
          if (typeof data.show_float !== 'undefined') {
            this.form.show_float = Number(data.show_float) ? 1 : 0
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    onSwitchChange(val) {
      const params = { ...this.configData, show_float: val }
      setWorkWechatConfig(params)
        .then(() => {
          this.configData = { ...params }
          this.$message({ type: 'success', message: this.$t('91deb7ee.3b1083') })
        })
        .catch(() => {
          this.$message({ type: 'error', message: this.$t('91deb7ee.6de920') })
          this.form.show_float = val === 1 ? 0 : 1
        })
    },
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
  .switch-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 16px;
    padding: 16px;
    background: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 2px;
    .switch-label {
      font-size: 14px;
      color: #3d4355;
      font-weight: 500;
    }
    .switch-tip {
      font-size: 12px;
      color: #909399;
    }
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
