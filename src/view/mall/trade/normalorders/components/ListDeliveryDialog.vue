<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <!-- 发货-开始 -->
    <el-dialog
      :title="$t('9d6ebbf1.045315')"
      :visible.sync="visible"
      :before-close="handleCancel"
      width="65%"
    >
      <template>
        <el-form ref="deliveryForm" :model="deliveryForm" label-width="100px">
          <el-form-item :label="$t('9d6ebbf1.1e8dc2')">
            <el-col :span="20">
              {{ deliveryData.orderInfo.order_id }}
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('9d6ebbf1.b01994')">
            <el-radio-group v-model="deliveryForm.delivery_type" :disabled="IsDisabled">
              <el-radio label="batch"> {{ $t('9d6ebbf1.afb426') }} </el-radio>
              <el-radio label="sep"> {{ $t('9d6ebbf1.95d243') }} </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('9d6ebbf1.b433e6')">
            <el-col :span="30">
              <el-table :data="deliveryData.orderInfo.items">
                <el-table-column prop="item_name" :label="$t('9d6ebbf1.de5472')" width="180" />
                <el-table-column prop="num" :label="$t('9d6ebbf1.0bf60b')" width="180" />
                <el-table-column :label="$t('9d6ebbf1.6943ad')">
                  <template slot-scope="scope">
                    <span>{{ scope.row.fee_symbol }}{{ scope.row.total_fee / 100 }}</span>
                  </template>
                </el-table-column>
                <template v-if="deliveryForm.delivery_type == 'sep'">
                  <el-table-column :label="$t('9d6ebbf1.f3af96')" width="200">
                    <template slot-scope="scope">
                      <el-select
                        v-model="scope.row.delivery_corp"
                        filterable
                        :placeholder="$t('9d6ebbf1.32e586')"
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
                  <el-table-column :label="$t('9d6ebbf1.0bb075')" width="200">
                    <template slot-scope="scope">
                      <el-input
                        v-model="scope.row.delivery_code"
                        :maxlength="20"
                        :placeholder="$t('9d6ebbf1.0e9f1e')"
                      />
                    </template>
                  </el-table-column>
                </template>
              </el-table>
            </el-col>
          </el-form-item>
          <template v-if="deliveryForm.delivery_type == 'batch'">
            <el-form-item :label="$t('9d6ebbf1.f3af96')">
              <el-col>
                <el-select
                  v-model="deliveryForm.delivery_corp"
                  filterable
                  :placeholder="$t('9d6ebbf1.32e586')"
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
            <el-form-item :label="$t('9d6ebbf1.0bb075')">
              <el-col :span="14">
                <el-input
                  v-model="deliveryForm.delivery_code"
                  :maxlength="20"
                  :placeholder="$t('9d6ebbf1.0e9f1e')"
                />
              </el-col>
            </el-form-item>
          </template>
        </el-form>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="handleCancel"> {{ $t('9d6ebbf1.625fb2') }} </el-button>
        <el-button type="primary" @click="submitDeliveryAction">
          {{ $t('9d6ebbf1.38cf16') }}
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="$t('9d6ebbf1.045315')"
      :visible.sync="newVisible"
      :before-close="handleCancel"
      width="65%"
    >
      <template>
        <el-form :model="deliveryForm" label-width="100px">
          <el-form-item :label="$t('9d6ebbf1.1e8dc2')">
            <el-col :span="20">
              {{ deliveryData.orderInfo.order_id }}
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('9d6ebbf1.b01994')">
            <el-radio-group v-model="deliveryForm.delivery_type" :disabled="IsDisabled">
              <el-radio label="batch"> {{ $t('9d6ebbf1.afb426') }} </el-radio>
              <el-radio label="sep"> {{ $t('9d6ebbf1.95d243') }} </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('9d6ebbf1.b433e6')">
            <el-table :data="deliveryData.orderInfo.items">
              <el-table-column prop="item_name" :label="$t('9d6ebbf1.de5472')" width="180" />
              <el-table-column prop="num" :label="$t('9d6ebbf1.0bf60b')" width="180" />
              <el-table-column
                prop="delivery_item_num"
                :label="$t('9d6ebbf1.745165')"
                width="180"
              />

              <el-table-column :label="$t('9d6ebbf1.6943ad')">
                <template slot-scope="scope">
                  <span>{{ scope.row.fee_symbol }}{{ scope.row.total_fee / 100 }}</span>
                </template>
              </el-table-column>
              <template v-if="deliveryForm.delivery_type == 'sep'">
                <el-table-column :label="$t('9d6ebbf1.4f5a46')" width="200">
                  <template slot-scope="scope">
                    <el-input-number
                      v-if="scope.row.num - scope.row.delivery_item_num != 0"
                      v-model="scope.row.delivery_num"
                      :placeholder="$t('9d6ebbf1.4f5a46')"
                      controls-position="right"
                      :min="0"
                      :max="scope.row.num - scope.row.delivery_item_num"
                    />
                    <!-- <el-input v-model="scope.row.delivery_num" :maxlength=20 placeholder="发货数量"></el-input> -->
                    <span v-if="scope.row.num - scope.row.delivery_item_num == 0">{{
                      $t('9d6ebbf1.82446c')
                    }}</span>
                  </template>
                </el-table-column>
              </template>
            </el-table>
          </el-form-item>

          <el-form-item :label="$t('9d6ebbf1.f3af96')">
            <el-col>
              <el-select
                v-model="deliveryForm.delivery_corp"
                filterable
                :placeholder="$t('9d6ebbf1.32e586')"
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
          <el-form-item :label="$t('9d6ebbf1.0bb075')">
            <el-col :span="14">
              <el-input
                v-model="deliveryForm.delivery_code"
                :maxlength="20"
                :placeholder="$t('9d6ebbf1.0e9f1e')"
              />
            </el-col>
          </el-form-item>
        </el-form>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="handleCancel">{{ $t('9d6ebbf1.625fb2') }}</el-button>
        <el-button type="primary" @click="submitDeliveryAction">
{{
          $t('9d6ebbf1.38cf16')
        }}
</el-button>
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
              (item) => item.delivery_num && item.delivery_num != ''
            )
          )
        }
      } else {
        this.deliveryForm.sepInfo = {}
      }
      delivery(this.deliveryForm).then((response) => {
        let deliveryStatus = response.data.data.delivery_status
        if (deliveryStatus && deliveryStatus != 'PENDING') {
          this.handleCancel()
          this.$emit('onSuccessDelivery')
          this.$message.success(this.$t('9d6ebbf1.de3b52'))
        } else {
          this.$message.error(this.$t('9d6ebbf1.2249c1'))
          return false
        }
      })
    }
  }
}
</script>

<style></style>
