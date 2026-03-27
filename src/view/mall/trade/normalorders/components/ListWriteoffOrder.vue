<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-dialog
      :title="$t('b004448c.bdc4b9')"
      :visible.sync="visible"
      :before-close="handleWriteoffOrder"
      width="57%"
    >
      <template>
        <el-form ref="cancelForm" :model="writeoffOrderForm" class="" label-width="100px">
          <el-form-item :label="$t('b004448c.070dce')">
            <el-col :span="20">
              {{ writeoffOrderData.order_id }}
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('b004448c.2083dd')">
            <el-col v-for="item in writeoffOrderData.items" :key="item.item_id">
              {{ item.item_name }} {{ item.item_spec_desc }} × {{ item.num }}
            </el-col>
          </el-form-item>
          <el-form-item v-if="writeoffOrderData.pickupcode_status" :label="$t('b004448c.a5a7dd')">
            <el-input
              v-model="writeoffOrderForm.pickupcode"
              :maxlength="6"
              type="text"
              :placeholder="$t('b004448c.ba231e')"
              style="width: 180px"
            />
          </el-form-item>
        </el-form>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="handleWriteoffOrder"> {{ $t('b004448c.625fb2') }} </el-button>
        <el-button type="primary" @click="submitWriteoffOrderConfirmAction">
          {{ $t('b004448c.38cf16') }}
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="$t('b004448c.ae62ca')"
      :visible.sync="writeoffOrderSuccVisible"
      :before-close="handleWriteoffOrderSucc"
      width="57%"
    >
      <template>
        <span>{{ writeoffOrderSucc.msg }}</span>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="handleWriteoffOrderSucc"> {{ $t('b004448c.ce2695') }} </el-button>
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
        this.$message.error(this.$t('b004448c.080282'))
        return false
      }
      doWriteoff(this.writeoffOrderForm.order_id, this.writeoffOrderForm).then((response) => {
        var writeoffStatus = response.data.data.ziti_status
        var order_id = response.data.data.order_id
        if (writeoffStatus == 'DONE') {
          this.handleWriteoffOrder()
          this.writeoffOrderSuccVisible = true
          this.writeoffOrderSucc.msg = this.$t('b004448c.44961f', { orderId: order_id })
        } else {
          this.$message.success(this.$t('b004448c.47c5ff'))
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
