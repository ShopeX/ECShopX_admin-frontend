<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-dialog
    :title="$t('9fa12ae2.b21b5e')"
    :visible.sync="visible"
    :before-close="handleCancelOrder"
    width="57%"
  >
    <template>
      <el-form ref="cancelForm" :model="cancelOrderForm" class="" label-width="100px">
        <el-form-item :label="$t('9fa12ae2.070dce')">
          <!-- <el-col :span="20">{{ cancelOrderData.orderInfo.order_id }}</el-col> -->
          <el-col :span="20">
            {{ info.order_id }}
          </el-col>
        </el-form-item>
        <el-form-item :label="$t('9fa12ae2.27910a')">
          <el-row>
            <el-col :span="20">
              <template>
                <el-select
                  v-model="cancel_order"
                  filterable
                  :placeholder="$t('9fa12ae2.bc4a11')"
                  @change="cancelReasonSelect"
                >
                  <el-option
                    v-for="item in order_cancel_reason"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
                <el-input
                  v-show="cancelOrderInput"
                  v-model="cancelOrderForm.other_reason"
                  type="textarea"
                  :rows="3"
                  resize="none"
                  style="width: 200px; margin-top: 10px"
                  :placeholder="$t('9fa12ae2.c6af7d')"
                />
              </template>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </template>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="handleCancelOrder"> {{ $t('9fa12ae2.625fb2') }} </el-button>
      <el-button type="primary" @click="submitCancelOrderConfirmAction">
        {{ $t('9fa12ae2.38cf16') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { cancelOrderConfirm } from '@/api/trade'
export default {
  props: ['visible', 'cancelOrderData', 'info'],
  data() {
    return {
      order_cancel_reason: [
        { name: this.$t('9fa12ae2.8f038a'), value: 1 },
        { name: this.$t('9fa12ae2.5e58ba'), value: 2 },
        { name: this.$t('9fa12ae2.151111'), value: 3 },
        { name: this.$t('9fa12ae2.baa450'), value: 4 },
        { name: this.$t('9fa12ae2.3013ee'), value: 5 },
        { name: this.$t('9fa12ae2.e7197e'), value: 6 },
        { name: this.$t('9fa12ae2.74c00b'), value: 7 },
        { name: this.$t('9fa12ae2.16264a'), value: 8 },
        { name: this.$t('9fa12ae2.13bea0'), value: 9 },
        { name: this.$t('9fa12ae2.0e6c86'), value: 10 },
        { name: this.$t('9fa12ae2.e21052'), value: 11 },
        { name: this.$t('9fa12ae2.94490e'), value: 12 }
      ],
      cancel_order: '',
      cancelOrderForm: {
        order_id: '',
        cancel_reason: 0,
        other_reason: ''
      },
      cancelOrderInput: false
    }
  },
  watch: {
    info: {
      handler(val) {
        console.log('cancelDialog', val)
        if (val.order_id) {
          this.cancelOrderForm.order_id = val.order_id
        }
      },
      deep: true
    }
  },
  methods: {
    handleCancelOrder() {
      this.cancel_order = ''
      this.$emit('onChangeData', 'cancelOrderVisible', false)
      this.$emit('refreshList')
      this.cancelOrderForm.order_id = ''
      this.cancelOrderForm.other_reason = ''
      this.cancelOrderInput = false
    },
    cancelReasonSelect(val) {
      if (val == 12) {
        this.cancelOrderInput = true
      } else {
        this.cancelOrderForm.other_reason = ''
        this.cancelOrderInput = false
      }
      this.cancelOrderForm.cancel_reason = val
    },
    submitCancelOrderConfirmAction() {
      if (this.cancelOrderForm.cancel_reason == 0) {
        this.$message.error(this.$t('9fa12ae2.1be7fb'))
        return false
      }

      if (this.cancelOrderForm.cancel_reason == 12 && this.cancelOrderForm.other_reason == '') {
        this.$message.error(this.$t('9fa12ae2.d31b9c'))
        return false
      }
      this.cancelOrderForm.order_id = this.info.order_id
      cancelOrderConfirm(this.cancelOrderForm.order_id, this.cancelOrderForm).then((response) => {
        var cancelOrderStatus = response.data.data.refund_status
        // debugger
        if (cancelOrderStatus == 'WAIT_CHECK') {
          this.handleCancelOrder()
          this.$message.success(this.$t('8906cb64.86a02e'))
        } else {
          this.$message.error(this.$t('8906cb64.dc8eed'))
          this.$emit('refreshList')
          return false
        }
      })
    }
  }
}
</script>

<style></style>
