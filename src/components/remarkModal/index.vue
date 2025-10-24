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
  <el-dialog title="编辑备注信息" :visible.sync="show" :width="width">
    <div class="custom_textarea">
      <el-input
        v-model="value"
        type="textarea"
        placeholder="请输入对此订单需要备注的内容…"
        :rows="rowLength"
      />
      <div class="statics" :class="{ error: maxValueLength() }">
        {{ value.length }}/{{ maxLength }}
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel"> 取 消 </el-button>
      <el-button type="primary" @click="handleSubmit"> 确 定 </el-button>
    </div>
  </el-dialog>
</template>
<script>
import { remarks, afterRemarks } from '@/api/order'
export default {
  data() {
    return {
      show: false,
      currentType: '',
      current: null,
      value: '',
      rowLength: 6,
      width: '500px',
      maxLength: 150
    }
  },
  methods: {
    maxValueLength() {
      return this.value.length > this.maxLength
    },
    handleCancel() {
      this.show = false
    },
    getParams() {
      let params = {}
      if (
        this.currentType === 'normalList' ||
        this.currentType === 'normalList2' ||
        this.currentType === 'orderDetail'
      ) {
        params.orderId = this.current.order_id
        params.is_distribution = 1
        params.remark = this.value
      } else if (this.currentType === 'afterList' || this.currentType === 'afterDetail') {
        params.aftersales_bn = this.current.aftersales_bn
        params.remark = this.value
      }
      return params
    },
    handleValidate() {
      if (this.maxValueLength()) {
        this.$message.error('字数请不要超过150字')
        return
      }
      return true
    },
    handleSubmit() {
      const returnValue = this.handleValidate()

      if (!returnValue) return

      const params = this.getParams()

      if (
        this.currentType === 'normalList' ||
        this.currentType === 'normalList2' ||
        this.currentType === 'orderDetail'
      ) {
        remarks(params).then(res => {
          this.$emit('onDone', res)
          this.$message.success('订单备注修改成功!')
          this.show = false
        })
      } else if (this.currentType === 'afterList' || this.currentType === 'afterDetail') {
        afterRemarks(params).then(res => {
          this.$emit('onDone', this.value)
          this.$message.success('订单备注修改成功!')
          this.show = false
        })
      }
    },
    showRemark(current, type) {
      this.show = true
      this.current = current
      this.currentType = type
      if (type === 'normalList' || type === 'normalList2' || type === 'orderDetail') {
        this.value = this.current.distributor_remark
      } else if (type === 'afterList' || type === 'afterDetail') {
        this.value = this.current.distributor_remark
      }
    }
  }
}
</script>
<style scoped lang="scss">
.custom_textarea {
  position: relative;
  .statics {
    position: absolute;
    right: 4px;
    z-index: 100;
    bottom: 4px;
    color: gray;

    &.error {
      color: red;
    }
  }
}
</style>
