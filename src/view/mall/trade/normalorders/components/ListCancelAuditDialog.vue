<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-dialog
    :title="$t('f7881862.763eea')"
    :visible.sync="visible"
    :before-close="handleCancelOrderCancel"
    width="57%"
  >
    <template>
      <el-row :gutter="100">
        <el-col :span="24">
          <span class="grid-content">{{ $t('f7881862.070dce') }}{{ cancelData.order_id }}</span>
        </el-col>
        <el-col :span="24">
          <span v-if="cancelData.cancel_from == 'buyer'">{{ $t('f7881862.497ac9') }}</span>
          <span v-else>{{ $t('f7881862.f01ac7') }}</span>
        </el-col>
        <el-col :span="24">
          <span
            >{{ $t('f7881862.796c1b')
            }}{{ cancelData.create_time | datetime('YYYY-MM-DD HH:mm:ss') }}</span
          >
        </el-col>
        <el-col :span="24">
          <span>{{ $t('f7881862.a2f94f') }}</span>
          <span v-if="cancelData.refund_status == 'READY'">{{ $t('f7881862.5cb424') }}</span>
          <span v-if="cancelData.refund_status == 'AUDIT_SUCCESS'">{{
            $t('f7881862.202a8b')
          }}</span>
          <span v-if="cancelData.refund_status == 'SUCCESS'">{{ $t('f7881862.d58cbd') }}</span>
          <span v-if="cancelData.refund_status == 'SHOP_CHECK_FAILS'">{{
            $t('f7881862.0e14e3')
          }}</span>
          <span v-if="cancelData.refund_status == 'CANCEL'">{{ $t('f7881862.0a7dff') }}</span>
          <span v-if="cancelData.refund_status == 'PROCESSING'">{{ $t('f7881862.cd3291') }}</span>
          <span v-if="cancelData.refund_status == 'FAILS'">{{ $t('f7881862.7c2544') }}</span>
          <span v-if="cancelData.refund_status == 'WAIT_CHECK'">{{ $t('f7881862.5cb424') }}</span>
          <span v-if="cancelData.refund_status == 'WAIT_REFUND'">{{ $t('f7881862.12e196') }}</span>
        </el-col>
        <el-col :span="24">
          <span>{{ $t('f7881862.7f1328') }}</span>
          <span v-if="cancelData.progress == '0'">{{ $t('f7881862.047109') }}</span>
          <span v-if="cancelData.progress == '1'">{{ $t('f7881862.2111cc') }}</span>
          <span v-if="cancelData.progress == '2'">{{ $t('f7881862.07e608') }}</span>
          <span v-if="cancelData.progress == '3'">{{ $t('f7881862.fad522') }}</span>
          <span v-if="cancelData.progress == '4'">{{ $t('f7881862.dbf36d') }}</span>
        </el-col>
        <el-col :span="24">
          <span
            >{{ $t('f7881862.b772c7') }}{{ cancelData.fee_symbol
            }}{{ cancelData.total_fee / 100 }}</span
          >
        </el-col>
        <el-col :span="24">
          <span v-if="cancelData.pay_type == 'wxpay'">{{ $t('f7881862.f5041a') }}</span>
        </el-col>
        <el-col :span="24">
          <span>{{ $t('f7881862.27910a') }}{{ cancelData.cancel_reason }}</span>
        </el-col>
      </el-row>
      <el-divider />
      <el-form ref="cancelForm" :model="cancelForm" class="" label-width="100px">
        <el-form-item :label="$t('f7881862.de455e')">
          <el-row>
            <el-col :span="20">
              <template>
                <el-radio v-model="cancelForm.check_cancel" label="0">
                  {{ $t('f7881862.1bf19c') }}
                </el-radio>
                <el-radio v-model="cancelForm.check_cancel" label="1">
                  {{ $t('f7881862.e61f2c') }}
                </el-radio>
              </template>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item v-if="cancelForm.check_cancel == '0'" :label="$t('f7881862.de77c5')">
          <el-row>
            <el-col :span="24">
              <el-input
                v-model="cancelForm.shop_reject_reason"
                type="textarea"
                :rows="3"
                :placeholder="$t('f7881862.fc955a')"
              />
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </template>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="handleCancelOrderCancel"> {{ $t('f7881862.625fb2') }} </el-button>
      <el-button type="primary" @click="submitCancelConfirmAction">
        {{ $t('f7881862.38cf16') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { cancelConfirm } from '@/api/trade'
export default {
  props: ['visible', 'cancelData', 'info'],
  data() {
    return {
      cancelForm: {
        order_id: '',
        check_cancel: '1',
        shop_reject_reason: ''
      }
    }
  },
  watch: {
    info: {
      handler(val) {
        if (val.order_id) {
          this.cancelForm.order_id = val.order_id
        }
      },
      deep: true
    }
  },
  methods: {
    handleCancelOrderCancel() {
      this.$emit('onChangeData', 'cancelVisible', false)
      this.$emit('refreshList')
      this.$emit('onChangeData', 'cancelForm', {
        order_id: '',
        shop_reject_reason: ''
      })
    },
    submitCancelConfirmAction() {
      // 提交取消订单审核结果
      cancelConfirm(this.cancelForm.order_id, this.cancelForm).then((response) => {
        var cancelOrderStatus = response.data.data.refund_status
        if (cancelOrderStatus == 'AUDIT_SUCCESS') {
          this.handleCancelOrderCancel()
          this.$message.success(this.$t('f7881862.388738'))
        } else if (cancelOrderStatus == 'SHOP_CHECK_FAILS') {
          this.handleCancelOrderCancel()
          this.$message.success(this.$t('f7881862.1cd415'))
        } else {
          this.$message.error(this.$t('f7881862.f74090'))
          return false
        }
      })
    }
  }
}
</script>

<style></style>
