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
  <div>
    <el-dialog
      title="自提订单核销"
      :visible.sync="visible"
      :before-close="handleWriteoffOrder"
      width="57%"
    >
      <template>
        <el-form ref="cancelForm" :model="writeoffOrderForm" class="" label-width="100px">
          <el-form-item label="订单号:">
            <el-col :span="20">
              {{ writeoffOrderData.order_id }}
            </el-col>
          </el-form-item>
          <el-form-item label="商品:">
            <el-col v-for="item in writeoffOrderData.items" :key="item.item_id">
              {{ item.item_name }} {{ item.item_spec_desc }} × {{ item.num }}
            </el-col>
          </el-form-item>
          <el-form-item v-if="writeoffOrderData.pickupcode_status" label="提货码:">
            <el-input
              v-model="writeoffOrderForm.pickupcode"
              :maxlength="6"
              type="text"
              placeholder="请输入提货码"
              style="width: 180px"
            />
          </el-form-item>
        </el-form>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="handleWriteoffOrder"> 取消 </el-button>
        <el-button type="primary" @click="submitWriteoffOrderConfirmAction"> 确定 </el-button>
      </div>
    </el-dialog>
    <!-- 自提订单核销完成 -->
    <el-dialog
      title="自提核销"
      :visible.sync="writeoffOrderSuccVisible"
      :before-close="handleWriteoffOrderSucc"
      width="57%"
    >
      <template>
        <span>{{ writeoffOrderSucc.msg }}</span>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="handleWriteoffOrderSucc"> 知道了 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { doWriteoff } from '@/api/trade'
export default {
  props: ['visible', 'writeoffOrderData', 'form'],
  data() {
    return {
      writeoffOrderForm: {
        order_id: '',
        pickupcode: ''
      },
      writeoffOrderSuccVisible: false,
      writeoffOrderSucc: {
        msg: ''
      }
    }
  },
  watch: {
    form: {
      handler(val) {
        if (val.pickupcode) {
          this.writeoffOrderForm.pickupcode = val.pickupcode
        }
        if (val.order_id) {
          this.writeoffOrderForm.order_id = val.order_id
        }
      },
      deep: true
    }
  },
  methods: {
    handleWriteoffOrder() {
      this.$emit('onChangeData', 'writeoffOrderVisible', false)
      this.writeoffOrderForm.order_id = ''
      this.writeoffOrderForm.pickupcode = ''
    },
    submitWriteoffOrderConfirmAction() {
      if (
        this.writeoffOrderData.pickupcode_status == 1 &&
        this.writeoffOrderForm.pickupcode == ''
      ) {
        this.$message.error('请输入提货码!')
        return false
      }
      doWriteoff(this.writeoffOrderForm.order_id, this.writeoffOrderForm).then(response => {
        var writeoffStatus = response.data.data.ziti_status
        var order_id = response.data.data.order_id
        if (writeoffStatus == 'DONE') {
          this.handleWriteoffOrder()
          this.writeoffOrderSuccVisible = true
          this.writeoffOrderSucc.msg = '订单' + order_id + '核销成功'
        } else {
          this.$message.success('自提订单核销失败!')
          return false
        }
      })
    },
    handleWriteoffOrderSucc() {
      this.writeoffOrderSuccVisible = false
      this.writeoffOrderSucc.msg = ''
      this.$emit('refreshList')
    }
  }
}
</script>

<style></style>
