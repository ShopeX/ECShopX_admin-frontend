<template>
  <div>
    <template v-if="!VERSION_IN_PURCHASE">
      <el-row
        class="ectapp-content"
        type="flex"
        justify="space-between"
      >
        <el-col
          :span="12"
          class="ectapp-col"
        >
          <el-row
            style="width: 100%"
            class="ectapp-box"
          >
            <img
              :src="require('@/assets/img/ectapp/alipay.jpg')"
              class="ectapp-avatar"
            >
            <div>
              <div class="ectapp-title">
                Adapay支付分账<span class="ectapp-icons">优</span>
              </div>
              <div class="ectapp-cont">
                商派ECShopX集成汇付分账，作为合规、安全、灵活的聚合支付解决方案，通过多级账户管理、聚合支付、高效结算等多维度助力电商实现平台化、数字化。
              </div>

              <el-button
                v-if="!status && !loading"
                plain
                @click.native="clickChange(true)"
              >
                立即订购
              </el-button>

              <span
                v-if="status && !loading"
                class="app-opened"
              >已开通</span>
            </div>
          </el-row>
        </el-col>
      </el-row>
      <div
        v-show="visible"
        class="ectapp-dialog"
      >
        <div
          class="close"
          @click="clickChange(false)"
        />
        <img
          :src="require('@/assets/img/ectapp/alipay_code.png')"
          class="ectapp-code"
        >
      </div>
    </template>
    <router-view />
  </div>
</template>

<script>
import store from '@/store'
import { getQRcode, removeCard, updateStore } from '@/api/cardticket'

export default {
  data () {
    return {
      loading: true,
      visible: false,
      status: false
    }
  },
  created () {
    this.fetch()
  },
  mounted () {},
  methods: {
    clickChange (visible) {
      this.visible = visible
    },
    async fetch () {
      this.loading = true
      const { status } = await this.$api.application.adapayIsOpen()
      this.loading = false
      this.status = status
    }
  }
}
</script>
<style scoped lang="scss">
.content-container {
  background: none !important;
  padding: 0px !important;
  min-height: 600px !important;
}
.ectapp-content {
  .ectapp-col {
    background: #fff;
    padding: 24px;
    box-shadow: 0px 0px 2px 0px #dfe7f3;
    border-radius: 2px;
  }
  .ectapp-box {
    display: flex;
  }
  .ectapp-avatar {
    width: 86px;
    height: 86px;
  }
  .ectapp-title {
    font-size: 16px;
    font-weight: bold;
  }
  .ectapp-icons {
    background: #e62412;
    border-radius: 7px 7px 7px 0px;
    color: #fff;
    font-size: 10px;
    font-weight: normal;
    padding: 1px 7px;
    margin-left: 10px;
  }
  .ectapp-cont {
    font-weight: 400;
    color: #979797;
    line-height: 21px;
    font-size: 14px;
    margin-top: 10px;
    margin-bottom: 40px;
    @include mult-ellipsis(2);
  }
}
.ectapp-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 574px;
  height: 526px;
  z-index: 2001;
  background: url('../../../assets/img/ectapp/extapp-bck.png') no-repeat center center;
  background-size: 574px 526px;
  .ectapp-code {
    width: 170px;
    height: 170px;
    position: fixed;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2002;
  }
}
.close {
  width: 38px;
  height: 38px;
  position: fixed;
  top: 8%;
  right: 9%;
  cursor: pointer;
}
.app-opened {
  color: #07c160;
}
</style>
