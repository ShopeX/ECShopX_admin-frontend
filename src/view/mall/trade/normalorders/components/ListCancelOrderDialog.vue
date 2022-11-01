<template>
  <el-dialog
    title="取消订单"
    :visible.sync="visible"
    :before-close="handleCancelOrder"
    width="57%"
  >
    <template>
      <el-form
        ref="cancelForm"
        :model="cancelOrderForm"
        class=""
        label-width="100px"
      >
        <el-form-item label="订单号:">
          <!-- <el-col :span="20">{{ cancelOrderData.orderInfo.order_id }}</el-col> -->
          <el-col :span="20">
            {{ info.order_id }}
          </el-col>
        </el-form-item>
        <el-form-item label="取消原因:">
          <el-row>
            <el-col :span="20">
              <template>
                <el-select
                  v-model="cancel_order"
                  filterable
                  placeholder="请选择取消订单原因"
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
                  placeholder="请填写取消订单原因"
                />
              </template>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </template>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click.native="handleCancelOrder">
        取消
      </el-button>
      <el-button
        type="primary"
        @click="submitCancelOrderConfirmAction"
      >
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { cancelOrderConfirm } from '@/api/trade'
export default {
  props: ['visible', 'cancelOrderData', 'info'],
  data () {
    return {
      order_cancel_reason: [
        { name: '客户现在不想购买', value: 1 },
        { name: '客户商品价格较贵', value: 2 },
        { name: '客户价格波动', value: 3 },
        { name: '客户商品缺货', value: 4 },
        { name: '客户重复下单', value: 5 },
        { name: '客户订单商品选择有误', value: 6 },
        { name: '客户支付方式选择有误', value: 7 },
        { name: '客户收货信息填写有误', value: 8 },
        { name: '客户发票信息填写有误', value: 9 },
        { name: '客户无法支付订单', value: 10 },
        { name: '客户长时间未付款', value: 11 },
        { name: '客户其他原因', value: 12 }
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
      handler (val) {
        console.log('cancelDialog', val)
        if (val.order_id) {
          this.cancelOrderForm.order_id = val.order_id
        }
      },
      deep: true
    }
  },
  methods: {
    handleCancelOrder () {
      this.cancel_order = ''
      this.$emit('onChangeData', 'cancelOrderVisible', false)
      this.$emit('refreshList')
      this.cancelOrderForm.order_id = ''
      this.cancelOrderForm.other_reason = ''
      this.cancelOrderInput = false
    },
    cancelReasonSelect (val) {
      if (val == 12) {
        this.cancelOrderInput = true
      } else {
        this.cancelOrderForm.other_reason = ''
        this.cancelOrderInput = false
      }
      this.cancelOrderForm.cancel_reason = val
    },
    submitCancelOrderConfirmAction () {
      if (this.cancelOrderForm.cancel_reason == 0) {
        this.$message.error('请选择取消原因!')
        return false
      }

      if (this.cancelOrderForm.cancel_reason == 12 && this.cancelOrderForm.other_reason == '') {
        this.$message.error('请输入取消原因!')
        return false
      }
      this.cancelOrderForm.order_id = this.info.order_id
      cancelOrderConfirm(this.cancelOrderForm.order_id, this.cancelOrderForm).then((response) => {
        var cancelOrderStatus = response.data.data.refund_status
        // debugger
        if (cancelOrderStatus == 'WAIT_CHECK') {
          this.handleCancelOrder()
          this.$message.success('取消订单成功!')
        } else {
          this.$message.error('取消订单失败!')
          this.$emit('refreshList')
          return false
        }
      })
    }
  }
}
</script>

<style></style>
