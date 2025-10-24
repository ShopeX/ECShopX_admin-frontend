<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<template>
  <el-dialog
    title="取消订单退款审核"
    :visible.sync="visible"
    :before-close="handleCancelOrderCancel"
    width="57%"
  >
    <template>
      <el-row :gutter="100">
        <el-col :span="24">
          <span class="grid-content">订单号:{{ cancelData.order_id }}</span>
        </el-col>
        <el-col :span="24">
          <span v-if="cancelData.cancel_from == 'buyer'">取消来源:消费者申请</span>
          <span v-else>取消来源:系统自动取消</span>
        </el-col>
        <el-col :span="24">
          <span>申请时间:{{ cancelData.create_time | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
        </el-col>
        <el-col :span="24">
          <span>退款状态:</span>
          <span v-if="cancelData.refund_status == 'READY'">待审核</span>
          <span v-if="cancelData.refund_status == 'AUDIT_SUCCESS'">审核成功待退款</span>
          <span v-if="cancelData.refund_status == 'SUCCESS'">退款成功</span>
          <span v-if="cancelData.refund_status == 'SHOP_CHECK_FAILS'">商家审核不通过</span>
          <span v-if="cancelData.refund_status == 'CANCEL'">撤销退款</span>
          <span v-if="cancelData.refund_status == 'PROCESSING'">已发起退款等待到账</span>
          <span v-if="cancelData.refund_status == 'FAILS'">退款失败</span>
          <span v-if="cancelData.refund_status == 'WAIT_CHECK'">待审核</span>
          <span v-if="cancelData.refund_status == 'WAIT_REFUND'">等待退款</span>
        </el-col>
        <el-col :span="24">
          <span>处理进度:</span>
          <span v-if="cancelData.progress == '0'">待处理</span>
          <span v-if="cancelData.progress == '1'">已取消</span>
          <span v-if="cancelData.progress == '2'">退款中</span>
          <span v-if="cancelData.progress == '3'">已完成</span>
          <span v-if="cancelData.progress == '4'">已驳回</span>
        </el-col>
        <el-col :span="24">
          <span>退款金额:{{ cancelData.fee_symbol }}{{ cancelData.total_fee / 100 }}</span>
        </el-col>
        <el-col :span="24">
          <span v-if="cancelData.pay_type == 'wxpay'">支付方式:微信支付</span>
        </el-col>
        <el-col :span="24">
          <span>取消原因:{{ cancelData.cancel_reason }}</span>
        </el-col>
      </el-row>
      <el-divider />
      <el-form ref="cancelForm" :model="cancelForm" class="" label-width="100px">
        <el-form-item label="处理结果:">
          <el-row>
            <el-col :span="20">
              <template>
                <el-radio v-model="cancelForm.check_cancel" label="0"> 不同意 </el-radio>
                <el-radio v-model="cancelForm.check_cancel" label="1"> 同意 </el-radio>
              </template>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item v-if="cancelForm.check_cancel == '0'" label="拒绝原因:">
          <el-row>
            <el-col :span="24">
              <el-input
                v-model="cancelForm.shop_reject_reason"
                type="textarea"
                :rows="3"
                placeholder="请输入拒绝原因"
              />
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </template>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="handleCancelOrderCancel"> 取消 </el-button>
      <el-button type="primary" @click="submitCancelConfirmAction"> 确定 </el-button>
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
      cancelConfirm(this.cancelForm.order_id, this.cancelForm).then(response => {
        var cancelOrderStatus = response.data.data.refund_status
        if (cancelOrderStatus == 'AUDIT_SUCCESS') {
          this.handleCancelOrderCancel()
          this.$message.success('审核成功!')
        } else if (cancelOrderStatus == 'SHOP_CHECK_FAILS') {
          this.handleCancelOrderCancel()
          this.$message.success('审核拒绝成功!')
        } else {
          this.$message.error('审核失败!')
          return false
        }
      })
    }
  }
}
</script>

<style></style>
