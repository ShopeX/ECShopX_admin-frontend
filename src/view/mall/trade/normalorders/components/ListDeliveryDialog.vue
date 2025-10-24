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
    <!-- 发货-开始 -->
    <el-dialog title="发货" :visible.sync="visible" :before-close="handleCancel" width="65%">
      <template>
        <el-form ref="deliveryForm" :model="deliveryForm" label-width="100px">
          <el-form-item label="订单号">
            <el-col :span="20">
              {{ deliveryData.orderInfo.order_id }}
            </el-col>
          </el-form-item>
          <el-form-item label="发货类型">
            <el-radio-group v-model="deliveryForm.delivery_type" :disabled="IsDisabled">
              <el-radio label="batch"> 整单发货 </el-radio>
              <el-radio label="sep"> 拆分发货 </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="商品信息">
            <el-col :span="30">
              <el-table :data="deliveryData.orderInfo.items">
                <el-table-column prop="item_name" label="商品名" width="180" />
                <el-table-column prop="num" label="数量" width="180" />
                <el-table-column label="总支付价(元)">
                  <template slot-scope="scope">
                    <span>{{ scope.row.fee_symbol }}{{ scope.row.total_fee / 100 }}</span>
                  </template>
                </el-table-column>
                <template v-if="deliveryForm.delivery_type == 'sep'">
                  <el-table-column label="快递公司" width="200">
                    <template slot-scope="scope">
                      <el-select
                        v-model="scope.row.delivery_corp"
                        filterable
                        placeholder="请选择快递公司，可搜索"
                      >
                        <el-option
                          v-for="item in dlycorps"
                          :key="item.value"
                          :label="item.name"
                          :value="item.value"
                        />
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="物流单号" width="200">
                    <template slot-scope="scope">
                      <el-input
                        v-model="scope.row.delivery_code"
                        :maxlength="20"
                        placeholder="物流公司单号"
                      />
                    </template>
                  </el-table-column>
                </template>
              </el-table>
            </el-col>
          </el-form-item>
          <template v-if="deliveryForm.delivery_type == 'batch'">
            <el-form-item label="快递公司">
              <el-col>
                <el-select
                  v-model="deliveryForm.delivery_corp"
                  filterable
                  placeholder="请选择快递公司，可搜索"
                >
                  <el-option
                    v-for="item in dlycorps"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="物流单号">
              <el-col :span="14">
                <el-input
                  v-model="deliveryForm.delivery_code"
                  :maxlength="20"
                  placeholder="物流公司单号"
                />
              </el-col>
            </el-form-item>
          </template>
        </el-form>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="handleCancel"> 取消 </el-button>
        <el-button type="primary" @click="submitDeliveryAction"> 确定 </el-button>
      </div>
    </el-dialog>
    <el-dialog title="发货" :visible.sync="newVisible" :before-close="handleCancel" width="65%">
      <template>
        <el-form :model="deliveryForm" label-width="100px">
          <el-form-item label="订单号">
            <el-col :span="20">
              {{ deliveryData.orderInfo.order_id }}
            </el-col>
          </el-form-item>
          <el-form-item label="发货类型">
            <el-radio-group v-model="deliveryForm.delivery_type" :disabled="IsDisabled">
              <el-radio label="batch"> 整单发货 </el-radio>
              <el-radio label="sep"> 拆分发货 </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="商品信息">
            <el-table :data="deliveryData.orderInfo.items">
              <el-table-column prop="item_name" label="商品名" width="180" />
              <el-table-column prop="num" label="数量" width="180" />
              <el-table-column prop="delivery_item_num" label="已发货数量" width="180" />

              <el-table-column label="总支付价(元)">
                <template slot-scope="scope">
                  <span>{{ scope.row.fee_symbol }}{{ scope.row.total_fee / 100 }}</span>
                </template>
              </el-table-column>
              <template v-if="deliveryForm.delivery_type == 'sep'">
                <el-table-column label="发货数量" width="200">
                  <template slot-scope="scope">
                    <el-input-number
                      v-if="scope.row.num - scope.row.delivery_item_num != 0"
                      v-model="scope.row.delivery_num"
                      placeholder="发货数量"
                      controls-position="right"
                      :min="0"
                      :max="scope.row.num - scope.row.delivery_item_num"
                    />
                    <!-- <el-input v-model="scope.row.delivery_num" :maxlength=20 placeholder="发货数量"></el-input> -->
                    <span v-if="scope.row.num - scope.row.delivery_item_num == 0">已发完</span>
                  </template>
                </el-table-column>
              </template>
            </el-table>
          </el-form-item>

          <el-form-item label="快递公司">
            <el-col>
              <el-select
                v-model="deliveryForm.delivery_corp"
                filterable
                placeholder="请选择快递公司，可搜索"
              >
                <el-option
                  v-for="item in dlycorps"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="物流单号">
            <el-col :span="14">
              <el-input
                v-model="deliveryForm.delivery_code"
                :maxlength="20"
                placeholder="物流公司单号"
              />
            </el-col>
          </el-form-item>
        </el-form>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="handleCancel"> 取消 </el-button>
        <el-button type="primary" @click="submitDeliveryAction"> 确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { delivery } from '@/api/trade'
export default {
  props: [
    'visible',
    'newVisible',
    'deliveryData',
    'IsDisabled',
    'selectItemType',
    'dlycorps',
    'deliveryInfo'
  ],
  data() {
    return {
      deliveryForm: {
        delivery_type: 'batch',
        order_id: '',
        delivery_corp: '',
        delivery_code: '',
        sepInfo: {}
      }
    }
  },
  watch: {
    deliveryInfo: {
      handler(val) {
        if (val.delivery_type) {
          this.deliveryForm.delivery_type = val.delivery_type
        }
        if (val.order_id) {
          this.deliveryForm.order_id = val.order_id
        }
      },
      deep: true
    }
  },
  methods: {
    handleCancel() {
      this.deliveryForm.order_id = ''
      this.deliveryForm.delivery_corp = ''
      this.deliveryForm.delivery_code = ''
      this.deliveryForm = {
        delivery_type: 'batch',
        order_id: '',
        delivery_corp: '',
        delivery_code: '',
        sepInfo: {}
      }
      this.$emit('onCancel')
    },

    submitDeliveryAction() {
      // 提交物料
      this.deliveryForm.type = this.selectItemType

      if (this.deliveryForm.delivery_type == 'sep') {
        if (this.selectItemType == 'old') {
          this.deliveryForm.sepInfo = JSON.stringify(this.deliveryData.orderInfo.items)
          this.deliveryForm.delivery_corp = ''
          this.deliveryForm.delivery_code = ''
        } else {
          this.deliveryForm.sepInfo = JSON.stringify(
            JSON.parse(JSON.stringify(this.deliveryData.orderInfo.items)).filter(
              item => item.delivery_num && item.delivery_num != ''
            )
          )
        }
      } else {
        this.deliveryForm.sepInfo = {}
      }
      delivery(this.deliveryForm).then(response => {
        let deliveryStatus = response.data.data.delivery_status
        if (deliveryStatus && deliveryStatus != 'PENDING') {
          this.handleCancel()
          this.$emit('onSuccessDelivery')
          this.$message.success('发货成功!')
        } else {
          this.$message.error('发货失败!')
          return false
        }
      })
    }
  }
}
</script>

<style></style>
