<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <div class="zyk_adapay_account_detail">
      <el-descriptions :column="2" :title="$t('480fb2fc.a6d10d')">
        <el-descriptions-item :label="$t('480fb2fc.209f63')">
          <span v-if="list.trade_state == 'SUCCESS'">{{ $t('480fb2fc.21d63b') }}</span>
          <span v-else-if="list.trade_state == 'PARTIAL_REFUND'">{{ $t('480fb2fc.cfcaaa') }}</span>
          <span v-else-if="list.trade_state == 'FULL_REFUND'">{{ $t('480fb2fc.3b5a4d') }}</span>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('480fb2fc.73cd01')">
          <span v-if="list.adapay_div_status == 'NOTDIV'">{{ $t('480fb2fc.3d8a78') }}</span>
          <span v-else-if="list.adapay_div_status == 'DIVED'">{{ $t('480fb2fc.6b086e') }}</span>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('480fb2fc.e6f169')">
          {{ list.mer_name }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('480fb2fc.0d4934')">
          {{ list.distributor_name }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('480fb2fc.1e8dc2')">
          {{ list.order_id }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('480fb2fc.fa68e9')">
          {{ list.trade_id }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('480fb2fc.b1862e')">
          {{ (list.total_fee / 100) | formatNumMoney }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('480fb2fc.eca37c')">
          {{ list.time_start | formatTimestamp }}
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions :column="2" :title="$t('480fb2fc.02b157')">
        <el-descriptions-item :label="$t('480fb2fc.8d3c05')">
          {{ list.transaction_id }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('480fb2fc.05c5dc')">
          {{ list.time_start | formatTimestamp }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('480fb2fc.f33297')">
          {{ (list.pay_fee / 100) | formatNumMoney }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('480fb2fc.0c9d2b')">
          <span v-if="list.pay_channel == 'wx_lite'">{{ $t('480fb2fc.18796a') }}</span>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('480fb2fc.184c61')">
          {{ list.username }}
        </el-descriptions-item>
      </el-descriptions>
      <div v-if="list.div_fee_info.total_div_fee" class="group">
        <div class="title">{{ $t('480fb2fc.adb36c') }}</div>
        <div class="list">
          <div class="tab">
            <div class="key">{{ $t('480fb2fc.2c4698') }}</div>
            <div class="value">
              {{ (list.div_fee_info.total_div_fee / 100) | formatNumMoney }}
            </div>
          </div>
          <div class="tab">
            <div class="key">{{ $t('480fb2fc.7161bb') }}</div>
            <div class="value">
              {{ list.div_fee_info.create_time | formatTimestamp }}
            </div>
          </div>
        </div>
        <div v-for="(item, index) in list.div_fee_info.list.list" :key="index" class="list">
          <div class="tab">
            <div class="key">{{ $t('480fb2fc.5a5593') }}</div>
            <div class="value">
              {{ item.username }}
            </div>
          </div>
          <div class="tab">
            <template v-if="index == 0">
              <div class="key">
                <el-tooltip
                  v-if="$store.getters.login_type != 'distributor'"
                  placement="top-end"
                  effect="light"
                >
                  <i class="el-icon-warning-outline" />
                  <div v-if="$store.getters.login_type == 'dealer'" slot="content">
                    {{ $t('480fb2fc.00581d') }}
                  </div>
                  <div v-else slot="content">
                    {{ $t('480fb2fc.c78b5d') }}
                  </div>
                </el-tooltip>
                {{ $t('480fb2fc.f9e205') }}
              </div>
            </template>
            <template v-if="index == 1">
              <div class="key">
                <el-tooltip
                  v-if="$store.getters.login_type != 'distributor'"
                  :content="$t('480fb2fc.a5eff7')"
                  placement="top-end"
                  effect="light"
                >
                  <i class="el-icon-warning-outline" />
                </el-tooltip>
                {{ $t('480fb2fc.f9e205') }}
              </div>
            </template>
            <template v-if="index == 2">
              <div class="key">
                <el-tooltip
                  v-if="$store.getters.login_type != 'distributor'"
                  :content="$t('480fb2fc.02638d')"
                  placement="top-end"
                  effect="light"
                >
                  <i class="el-icon-warning-outline" />
                </el-tooltip>
                {{ $t('480fb2fc.f9e205') }}
              </div>
            </template>

            <div class="value">
              {{ (item.div_fee / 100) | formatNumMoney }}
            </div>
          </div>
        </div>
      </div>
      <el-descriptions
        v-if="list.adapay_fee && $store.getters.login_type == 'admin'"
        :column="2"
        :title="$t('480fb2fc.6415ee')"
      >
        <el-descriptions-item :label="$t('480fb2fc.6e640f')">
          <span v-if="list.adapay_fee_mode == 'O'">{{ $t('480fb2fc.6c1506') }}</span>
          <span v-else-if="list.adapay_fee_mode == 'I'">{{ $t('480fb2fc.75d29a') }}</span>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('480fb2fc.03c168')">
          {{ (list.adapay_fee / 100) | formatNumMoney }}
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions
        v-if="list.refund_list.length > 0"
        :column="2"
        :title="$t('480fb2fc.f179f2')"
      >
        <template v-for="item in list.refund_list">
          <el-descriptions-item :key="item.order_id" :label="$t('480fb2fc.4bf165')">
            {{ item.order_id }}
          </el-descriptions-item>
          <el-descriptions-item :key="item.refund_bn" :label="$t('480fb2fc.67d71e')">
            {{ item.refund_bn }}
          </el-descriptions-item>
          <el-descriptions-item :key="item.refunded_fee" :label="$t('480fb2fc.a0cd4c')">
            {{ (item.refunded_fee / 100) | formatNumMoney }}
          </el-descriptions-item>
          <el-descriptions-item :key="item.create_time" :label="$t('480fb2fc.5ba072')">
            {{ item.create_time | formatTimestamp }}
          </el-descriptions-item>
        </template>
      </el-descriptions>
    </div>
  </SpPage>
</template>

<script>
export default {
  data() {
    return {
      list: {}
    }
  },
  mounted() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      const { order_id } = this.$route.params
      const res = await this.$api.adapay.subAccountDetail(order_id)
      this.list = res
    }
  }
}
</script>

<style lang="scss" scoped>
.zyk_adapay_account_detail {
  padding-bottom: 100px;
}
.group {
  padding: 20px 0;

  .title {
    font-size: 16px;
    font-weight: 700;
    color: #000;
    background: #f5f5f5;
    padding: 5px;
  }
  .list {
    max-width: 1200px;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    .tab {
      flex: 1;
      display: flex;
      // justify-content: space-between;
    }
    &:nth-child(2) {
      padding: 20px 20px;
    }
    &:nth-child(3) {
      padding: 0px 20px;
    }
    &:nth-child(4) {
      padding: 20px 20px;
    }
    &:nth-child(5) {
      padding: 0px 20px;
    }
  }
}
</style>

<style lang="scss">
.zyk_adapay_account_detail {
  .el-descriptions {
    margin: 20px 0;
  }
}
</style>

<style lang="scss">
.zyk_adapay_account_detail {
  .el-descriptions__header {
    background: #f5f5f5;
    padding-left: 0px;
    padding: 5px;
  }
  .el-descriptions__body {
    color: #606266;
    background-color: #fff;
    padding: 20px;
    max-width: 1200px;
  }
}
</style>
