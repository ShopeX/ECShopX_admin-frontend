<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="">
    <div v-if="$route.path.indexOf('detail') === -1">
      <el-row class="filter-header" :gutter="20">
        <el-col>
          <el-date-picker
            v-model="create_time"
            type="daterange"
            :start-placeholder="$t('08fc23a1.b44c0f')"
            :range-separator="$t('08fc23a1.981cbe')"
            :end-placeholder="$t('08fc23a1.1d468b')"
            value-format="yyyy/MM/dd"
            :placeholder="$t('08fc23a1.4b8cb9')"
            @change="dateChange"
          />
          <el-select
            v-model="order_class"
            :placeholder="$t('08fc23a1.249ee7')"
            @change="TypeHandle"
          >
            <el-option
              v-for="(item, index) in order_class_array"
              :key="index"
              :label="$t(item.name)"
              :value="item.value"
            />
          </el-select>
          <el-autocomplete
            v-model="source_name"
            class="inline-input"
            :fetch-suggestions="querySearch"
            :placeholder="$t('08fc23a1.4b525f')"
            @select="sourceSearch"
          />
          <el-input v-model="salesman_mobile" class="input-m" :placeholder="$t('08fc23a1.f1ba67')">
            <el-button slot="append" icon="el-icon-search" @click="numberSearch" />
          </el-input>
          <el-input v-model="identifier" class="input-m" :placeholder="$t('08fc23a1.f4b2e7')">
            <el-button slot="append" icon="el-icon-search" @click="numberSearch" />
          </el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col>
          <el-button-group>
            <el-button type="primary" @click="exportData('normal_master_order')">
              {{ $t('08fc23a1.538414') }}
            </el-button>
            <el-button type="primary" @click="exportData('normal_order')">
{{
              $t('08fc23a1.82b914')
            }}
</el-button>
          </el-button-group>
          <el-popover
            placement="top-start"
            width="200"
            trigger="hover"
            :content="$t('08fc23a1.676480')"
          >
            <i slot="reference" class="el-icon-question" />
          </el-popover>
        </el-col>
      </el-row>
      <el-dialog
        :title="$t('08fc23a1.2cf869')"
        :visible.sync="downloadView"
        :close-on-click-modal="false"
      >
        <template v-if="downloadUrl">
          <a :href="downloadUrl" download>{{ downloadName }}</a>
        </template>
      </el-dialog>

      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane :label="$t('08fc23a1.a8b0c2')" name="all" />
        <el-tab-pane :label="$t('08fc23a1.d8476e')" name="notship" />
        <el-tab-pane :label="$t('08fc23a1.6b715b')" name="cancelapply" />
        <el-tab-pane :label="$t('08fc23a1.4933ca')" name="shipping" />
        <el-tab-pane :label="$t('08fc23a1.25d532')" name="ziti" />
        <el-tab-pane :label="$t('08fc23a1.608afd')" name="notpay" />
        <el-tab-pane :label="$t('08fc23a1.3e6db1')" name="cancel" />
        <el-tab-pane :label="$t('08fc23a1.fad522')" name="done" />
        <el-table
          v-loading="loading"
          :data="list"
          style="width: 100%"
          :height="wheight - 190"
          :element-loading-text="$t('08fc23a1.f09b12')"
        >
          <el-table-column prop="order_id" width="150" :label="$t('08fc23a1.1e8dc2')" fixed />
          <el-table-column prop="create_time" width="160" :label="$t('08fc23a1.eca37c')">
            <template slot-scope="scope">
              <span>{{ scope.row.create_time | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
            </template>
          </el-table-column>
          <el-table-column width="70" :label="$t('08fc23a1.9a935b')">
            <template slot-scope="scope">
              {{ scope.row.fee_symbol }}{{ scope.row.freight_fee / 100 }}
            </template>
          </el-table-column>
          <!--
          <el-table-column width="70" label="商品金额">
            <template slot-scope="scope">
              {{scope.row.fee_symbol}}{{scope.row.item_fee / 100}}
            </template>
          </el-table-column>
          -->
          <el-table-column prop="total_fee" width="70" :label="$t('08fc23a1.4cf24a')">
            <template slot-scope="scope">
              {{ scope.row.fee_symbol }}{{ scope.row.total_fee / 100 }}
            </template>
          </el-table-column>
          <el-table-column prop="mobile" width="110" :label="$t('08fc23a1.8098e2')" />
          <el-table-column width="90" :label="$t('08fc23a1.5cd56b')">
            <template slot-scope="scope">
              <span v-if="scope.row.order_class == 'normal'">{{ $t('08fc23a1.e7978e') }}</span>
              <span v-if="scope.row.order_class == 'groups'">{{ $t('08fc23a1.9b251e') }}</span>
              <span v-if="scope.row.order_class == 'seckill'">{{ $t('08fc23a1.ee8bc9') }}</span>
              <span v-if="scope.row.order_class == 'community'">{{ $t('08fc23a1.1ad244') }}</span>
            </template>
          </el-table-column>
          <!--
          <el-table-column prop="is_distribution" label="是否分销">
            <template slot-scope="scope">
              <span v-if="scope.row.is_distribution == 1"> 是 </span>
              <span v-else> - </span>
            </template>
          </el-table-column>
          -->
          <el-table-column prop="order_status" :label="$t('08fc23a1.86f6cf')">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.order_status == 'PAYED'" type="success" size="mini">
                {{ $t('08fc23a1.8d02a5') }}
              </el-tag>
              <el-tag v-else-if="scope.row.order_status == 'NOTPAY'" size="mini">
{{
                $t('08fc23a1.608afd')
              }}
</el-tag>
              <el-tag v-else-if="scope.row.order_status_des == 'CANCEL'" type="danger" size="mini">
                {{ $t('08fc23a1.2111cc') }}
              </el-tag>
              <el-tag v-else-if="scope.row.order_status_des == 'CLOSED'" type="info" size="mini">
                {{ scope.row.order_status_msg }}
              </el-tag>
              <el-tag
                v-else-if="scope.row.order_status == 'WAIT_BUYER_CONFIRM'"
                type="danger"
                size="mini"
              >
                {{ $t('08fc23a1.4933ca') }}
              </el-tag>
              <el-tag
                v-else-if="scope.row.order_status == 'REFUND_SUCCESS'"
                type="warning"
                size="mini"
              >
                {{ $t('08fc23a1.e85018') }}
              </el-tag>
              <el-tag
                v-else-if="scope.row.order_status == 'WAIT_GROUPS_SUCCESS'"
                type="warning"
                size="mini"
              >
                {{ $t('08fc23a1.425a40') }}
              </el-tag>
              <el-tag v-else-if="scope.row.order_status == 'DONE'" type="success" size="mini">
                {{ $t('08fc23a1.fad522') }}
              </el-tag>
              <template
                v-if="
                  scope.row.order_status != 'CANCEL' &&
                  scope.row.order_status != 'REFUND_SUCCESS' &&
                  scope.row.order_status != 'WAIT_GROUPS_SUCCESS'
                "
              >
                <el-tag v-if="scope.row.cancel_status == 'WAIT_PROCESS'" type="warning" size="mini">
                  {{ $t('08fc23a1.57a640') }}
                </el-tag>
                <el-tag
                  v-else-if="scope.row.delivery_status == 'PARTAIL'"
                  type="danger"
                  size="mini"
                >
                  {{ $t('08fc23a1.5296ac') }}
                </el-tag>
                <el-tag v-else-if="scope.row.ziti_status == 'PENDING'" type="danger" size="mini">
                  {{ $t('08fc23a1.25d532') }}
                </el-tag>
                <el-tag v-else-if="scope.row.delivery_status == 'PENDING'" size="mini">
                  {{ $t('08fc23a1.d8476e') }}
                </el-tag>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="source_name" :label="$t('08fc23a1.26ca20')" />
          <el-table-column :label="$t('08fc23a1.2b6bc0')" fixed="left">
            <template slot-scope="scope">
              <router-link
                :to="{
                  path: matchRoutePath('detail'),
                  query: { orderId: scope.row.order_id, resource: $route.path }
                }"
              >
                {{ $t('08fc23a1.f26225') }}
              </router-link>
              <el-button
                v-if="
                  scope.row.cancel_status == 'NO_APPLY_CANCEL' &&
                  (scope.row.order_status == 'NOTPAY' || scope.row.order_status == 'PAYED')
                "
                type="text"
                @click="cancelOrderAction(scope.row.order_id)"
              >
                {{ $t('08fc23a1.b21b5e') }}
              </el-button>
              <el-button
                v-if="
                  scope.row.receipt_type == 'logistics' &&
                  scope.row.order_status == 'PAYED' &&
                  scope.row.delivery_status != 'DONE'
                "
                type="text"
                @click="deliveryAction(scope.row.order_id)"
              >
                {{ $t('08fc23a1.045315') }}
              </el-button>
              <el-button
                v-if="
                  scope.row.cancel_status == 'WAIT_PROCESS' && scope.row.order_status == 'PAYED'
                "
                type="text"
                @click="confirmCancelOrderAction(scope.row.order_id)"
              >
                {{ $t('08fc23a1.44c198') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="mt-4 text-right">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next"
            :current-page.sync="params.page"
            :page-sizes="[10, 20, 50]"
            :total="total_count"
            :page-size="params.pageSize"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
          />
        </div>
      </el-tabs>

      <!-- 发货-开始 -->
      <el-dialog
        :title="deliveryTitle"
        :visible.sync="deliveryVisible"
        :before-close="handleCancel"
        width="57%"
      >
        <template>
          <el-form
            ref="deliveryForm"
            :model="deliveryForm"
            class="demo-ruleForm"
            label-width="100px"
          >
            <el-form-item :label="$t('08fc23a1.1e8dc2')">
              <el-col :span="20">
                {{ deliveryData.orderInfo.order_id }}
              </el-col>
            </el-form-item>
            <el-form-item :label="$t('08fc23a1.b01994')">
              <el-radio-group v-model="deliveryForm.delivery_type" :disabled="IsDisabled">
                <el-radio label="batch">{{ $t('08fc23a1.afb426') }}</el-radio>
                <el-radio label="sep">{{ $t('08fc23a1.95d243') }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('08fc23a1.b433e6')">
              <el-col :span="30">
                <el-table :data="deliveryData.orderInfo.items" style="width: 100%">
                  <el-table-column prop="item_name" :label="$t('08fc23a1.de5472')" width="180" />
                  <el-table-column prop="num" :label="$t('08fc23a1.0bf60b')" width="180" />
                  <el-table-column :label="$t('08fc23a1.232ca6')">
                    <template slot-scope="scope">
                      <span>{{ scope.row.fee_symbol }}{{ scope.row.total_fee / 100 }}</span>
                    </template>
                  </el-table-column>
                  <template v-if="deliveryForm.delivery_type == 'sep'">
                    <el-table-column :label="$t('08fc23a1.f3af96')" width="200">
                      <template slot-scope="scope">
                        <el-select
                          v-model="scope.row.delivery_corp"
                          filterable
                          :placeholder="$t('08fc23a1.32e586')"
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
                    <el-table-column :label="$t('08fc23a1.0bb075')" width="200">
                      <template slot-scope="scope">
                        <el-input
                          v-model="scope.row.delivery_code"
                          :maxlength="20"
                          :placeholder="$t('08fc23a1.0e9f1e')"
                        />
                      </template>
                    </el-table-column>
                  </template>
                </el-table>
              </el-col>
            </el-form-item>
            <template v-if="deliveryForm.delivery_type == 'batch'">
              <el-form-item :label="$t('08fc23a1.f3af96')">
                <el-col>
                  <el-select
                    v-model="deliveryForm.delivery_corp"
                    filterable
                    :placeholder="$t('08fc23a1.32e586')"
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
              <el-form-item :label="$t('08fc23a1.0bb075')">
                <el-col :span="14">
                  <el-input
                    v-model="deliveryForm.delivery_code"
                    :maxlength="20"
                    :placeholder="$t('08fc23a1.0e9f1e')"
                  />
                </el-col>
              </el-form-item>
            </template>
          </el-form>
        </template>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="handleCancel">{{ $t('08fc23a1.625fb2') }}</el-button>
          <el-button type="primary" @click="submitDeliveryAction">
{{
            $t('08fc23a1.38cf16')
          }}
</el-button>
        </div>
      </el-dialog>

      <!-- 取消订单退款审核-开始 -->
      <el-dialog
        :title="$t('08fc23a1.763eea')"
        :visible.sync="cancelVisible"
        :before-close="handleCancelOrderCancel"
        width="57%"
      >
        <template>
          <el-row :gutter="100">
            <el-col :span="24">
              <span class="grid-content">{{ $t('08fc23a1.070dce') }}{{ cancelData.order_id }}</span>
            </el-col>
            <el-col :span="24">
              <span v-if="cancelData.cancel_from == 'buyer'">{{ $t('08fc23a1.497ac9') }}</span>
              <span v-else>{{ $t('08fc23a1.f01ac7') }}</span>
            </el-col>
            <el-col :span="24">
              <span
                >{{ $t('08fc23a1.796c1b')
                }}{{ cancelData.create_time | datetime('YYYY-MM-DD HH:mm:ss') }}</span
              >
            </el-col>
            <el-col :span="24">
              <span>{{ $t('08fc23a1.a2f94f') }}</span>
              <span v-if="cancelData.refund_status == 'WAIT_CHECK'">{{
                $t('08fc23a1.5cb424')
              }}</span>
              <span v-if="cancelData.refund_status == 'FAILS'">{{ $t('08fc23a1.7c2544') }}</span>
              <span v-if="cancelData.refund_status == 'SUCCESS'">{{ $t('08fc23a1.d58cbd') }}</span>
              <span v-if="cancelData.refund_status == 'SHOP_CHECK_FAILS'">{{
                $t('08fc23a1.0e14e3')
              }}</span>
              <span v-if="cancelData.refund_status == 'WAIT_REFUND'">{{
                $t('08fc23a1.12e196')
              }}</span>
            </el-col>
            <el-col :span="24">
              <span>{{ $t('08fc23a1.7f1328') }}</span>
              <span v-if="cancelData.progress == '0'">{{ $t('08fc23a1.047109') }}</span>
              <span v-if="cancelData.progress == '1'">{{ $t('08fc23a1.2111cc') }}</span>
              <span v-if="cancelData.progress == '2'">{{ $t('08fc23a1.07e608') }}</span>
              <span v-if="cancelData.progress == '3'">{{ $t('08fc23a1.fad522') }}</span>
            </el-col>
            <el-col :span="24">
              <span
                >{{ $t('08fc23a1.b772c7') }}{{ cancelData.fee_symbol
                }}{{ cancelData.total_fee / 100 }}</span
              >
            </el-col>
            <el-col :span="24">
              <span v-if="cancelData.pay_type == 'wxpay'">{{ $t('08fc23a1.f5041a') }}</span>
            </el-col>
            <el-col :span="24">
              <span>{{ $t('08fc23a1.27910a') }}{{ cancelData.cancel_reason }}</span>
            </el-col>
          </el-row>
          <el-divider />
          <el-form ref="cancelForm" :model="cancelForm" class="" label-width="100px">
            <el-form-item :label="$t('08fc23a1.de455e')">
              <el-row>
                <el-col :span="20">
                  <template>
                    <el-radio v-model="cancelForm.check_cancel" label="0">
{{
                      $t('08fc23a1.1bf19c')
                    }}
</el-radio>
                    <el-radio v-model="cancelForm.check_cancel" label="1">
{{
                      $t('08fc23a1.e61f2c')
                    }}
</el-radio>
                  </template>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item v-if="cancelForm.check_cancel == '0'" :label="$t('08fc23a1.de77c5')">
              <el-row>
                <el-col :span="24">
                  <el-input
                    v-model="cancelForm.shop_reject_reason"
                    type="textarea"
                    :rows="3"
                    :placeholder="$t('08fc23a1.fc955a')"
                  />
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
        </template>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="handleCancelOrderCancel">{{ $t('08fc23a1.625fb2') }}</el-button>
          <el-button type="primary" @click="submitCancelConfirmAction">
{{
            $t('08fc23a1.38cf16')
          }}
</el-button>
        </div>
      </el-dialog>
      <!-- 取消订单 -->
      <el-dialog
        :title="$t('08fc23a1.b21b5e')"
        :visible.sync="cancelOrderVisible"
        :before-close="handleCancelOrder"
        width="57%"
      >
        <template>
          <el-form ref="cancelForm" :model="cancelOrderForm" class="" label-width="100px">
            <el-form-item :label="$t('08fc23a1.070dce')">
              <el-col :span="20">
                {{ cancelOrderData.orderInfo.order_id }}
              </el-col>
            </el-form-item>
            <el-form-item :label="$t('08fc23a1.27910a')">
              <el-row>
                <el-col :span="20">
                  <template>
                    <el-select
                      v-model="cancel_order"
                      filterable
                      :placeholder="$t('08fc23a1.bc4a11')"
                      @change="cancelReasonSelect"
                    >
                      <el-option
                        v-for="item in order_cancel_reason"
                        :key="item.value"
                        :label="$t(item.name)"
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
                      :placeholder="$t('08fc23a1.c6af7d')"
                    />
                  </template>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
        </template>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="handleCancelOrder">{{ $t('08fc23a1.625fb2') }}</el-button>
          <el-button type="primary" @click="submitCancelOrderConfirmAction">
{{
            $t('08fc23a1.38cf16')
          }}
</el-button>
        </div>
      </el-dialog>
    </div>
    <router-view />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import {
  getOrderList,
  getOrderDetail,
  delivery,
  orderExport,
  getCancelOrderInfo,
  cancelConfirm,
  getLogisticsList,
  cancelOrderConfirm
} from '../../../../api/trade'
import { getSourcesList } from '../../../../api/datacube'
import shopSelect from '@/components/shopSelect'

export default {
  components: {
    shopSelect
  },
  data() {
    return {
      IsDisabled: false,
      activeName: 'all',
      loading: false,
      create_time: '',
      params: {
        page: 1,
        pageSize: 20,
        order_class_exclude: 'drug',
        distributor_id: 0,
        distributorIds: []
      },
      order_class_array: [
        { name: '08fc23a1.dbb4d8', value: '' },
        { name: '08fc23a1.9b251e', value: 'groups' },
        { name: '08fc23a1.ee8bc9', value: 'seckill' },
        { name: '08fc23a1.1ad244', value: 'community' },
        { name: '08fc23a1.7762db', value: 'shopguide' }
      ],
      cancelOrderInput: false,
      order_cancel_reason: [
        { name: '08fc23a1.8f038a', value: 1 },
        { name: '08fc23a1.5e58ba', value: 2 },
        { name: '08fc23a1.151111', value: 3 },
        { name: '08fc23a1.baa450', value: 4 },
        { name: '08fc23a1.3013ee', value: 5 },
        { name: '08fc23a1.e7197e', value: 6 },
        { name: '08fc23a1.74c00b', value: 7 },
        { name: '08fc23a1.16264a', value: 8 },
        { name: '08fc23a1.13bea0', value: 9 },
        { name: '08fc23a1.0e6c86', value: 10 },
        { name: '08fc23a1.e21052', value: 11 },
        { name: '08fc23a1.94490e', value: 12 }
      ],
      order_status: '',
      time_start_begin: '',
      time_start_end: '',
      salesman_mobile: '',
      total_count: 0,
      order_type: 'normal',
      list: [],
      identifier: '',
      source_list: [],
      source_name: '',
      source_id: '',
      order_class: '',
      cancel_order: '',
      deliveryVisible: false,
      deliveryTitle: '',
      deliveryData: {
        orderInfo: {}
      },
      deliveryForm: {
        delivery_type: 'batch',
        order_id: '',
        delivery_corp: '',
        delivery_code: '',
        sepInfo: {}
      },
      dlycorps: [],
      cancelVisible: false,
      cancelData: {
        orderInfo: {}
      },
      cancelForm: {
        order_id: '',
        check_cancel: '1',
        shop_reject_reason: ''
      },
      cancelOrderVisible: false,
      cancelOrderData: {
        orderInfo: {}
      },
      cancelOrderForm: {
        order_id: '',
        cancel_reason: 0,
        other_reason: ''
      },
      downloadView: false,
      downloadUrl: '',
      downloadName: ''
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted() {
    if (this.$route.query.tab) {
      this.activeName = this.$route.query.tab
      this.params.order_status = this.$route.query.tab
      this.params.page = 1
    }
    this.params.order_type = this.order_type
    this.getOrders(this.params)
    this.getAllSourcesList()
  },
  methods: {
    // 切换tab
    handleClick(tab, event) {
      this.activeName = tab.name
      this.params.order_status = tab.name == 'all' ? '' : tab.name
      this.params.page = 1
      this.getParams()
      this.getOrders(this.params)
    },
    storeSearch(val) {
      val && val.shop_id
      this.params.distributor_id = val.shop_id
      this.params.page = 1
      this.getParams()
      this.getOrders(this.params)
    },
    TypeHandle(val) {
      this.params.page = 1
      this.getParams()
      this.getOrders(this.params)
    },
    numberSearch(e) {
      this.params.page = 1
      this.getParams()
      this.getOrders(this.params)
    },
    dateChange(val) {
      if (val.length > 0) {
        this.time_start_begin = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
        this.time_start_end = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
      } else {
        this.time_start_begin = ''
        this.time_start_end = ''
      }
      this.params.page = 1
      this.getParams()
      this.getOrders(this.params)
    },
    sourceSearch(item) {
      this.params.source_id = item.source_id
      this.params.page = 1
      this.getParams()
      this.getOrders(this.params)
    },
    handleCurrentChange(page_num) {
      this.loading = false
      this.params.page = page_num
      this.getParams()
      this.getOrders(this.params)
    },
    handleSizeChange(pageSize) {
      this.loading = false
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getParams()
      this.getOrders(this.params)
    },
    getParams() {
      this.params.time_start_begin = this.time_start_begin
      this.params.time_start_end = this.time_start_end
      this.params.order_type = this.order_type
      this.params.order_class = this.order_class
      this.params.salesman_mobile = this.salesman_mobile
      if (this.identifier.length == 11) {
        this.params.mobile = this.identifier
      } else {
        this.params.mobile = ''
        this.params.order_id = this.identifier
      }
    },
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    getOrders(filter) {
      this.loading = true
      getOrderList(filter).then((response) => {
        this.list = response.data.data.list
        this.total_count = Number(response.data.data.pager.count)
        this.loading = false
      })
    },
    getAllSourcesList() {
      let params = { page: 1, pageSize: 1000 }
      getSourcesList(params).then((response) => {
        if (response.data.data.list) {
          response.data.data.list.forEach((row) => {
            this.source_list.push({ value: row.sourceName, source_id: row.sourceId })
          })
        }
      })
    },
    querySearch(queryString, cb) {
      var restaurants = this.source_list
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    deliveryAction(order_id) {
      // 编辑物料弹框
      this.deliveryTitle = this.$t('08fc23a1.045315')
      getLogisticsList().then((res) => {
        this.dlycorps = res.data.data.list
      })
      getOrderDetail(order_id).then((response) => {
        this.deliveryData = response.data.data
        if (this.deliveryData.orderInfo.cancel_status == 'WAIT_PROCESS') {
          this.$message.error(this.$t('08fc23a1.e406db'))
          return false
        }
        this.deliveryVisible = true
        if (this.deliveryData && this.deliveryData.orderInfo.delivery_status == 'PARTAIL') {
          this.IsDisabled = true
          this.deliveryForm.delivery_type = 'sep'
        }
      })
      this.deliveryForm.order_id = order_id
    },
    confirmCancelOrderAction(order_id) {
      // 已支付订单的取消订单审核
      let params = { order_type: 'normal' }
      getCancelOrderInfo(order_id, params).then((response) => {
        this.cancelData = response.data.data
        this.cancelVisible = true
        console.log(response)
      })
      this.cancelForm.order_id = order_id
    },
    handleCancelOrderCancel() {
      this.cancelVisible = false
      this.cancelForm.order_id = ''
      this.cancelForm.shop_reject_reason = ''
    },
    submitCancelConfirmAction() {
      // 提交取消订单审核结果
      cancelConfirm(this.cancelForm.order_id, this.cancelForm).then((response) => {
        var cancelOrderStatus = response.data.data.refund_status
        if (cancelOrderStatus == 'SUCCESS') {
          this.handleCancelOrderCancel()
          this.$message.success(this.$t('08fc23a1.388738'))
          this.getOrders(this.params)
        } else {
          this.$message.success(this.$t('08fc23a1.af3280'))
          this.getOrders(this.params)
          return false
        }
      })
    },
    handleCancel() {
      this.deliveryVisible = false
      this.deliveryForm.order_id = ''
      this.deliveryForm.delivery_corp = ''
      this.deliveryForm.delivery_code = ''
    },
    submitDeliveryAction() {
      // 提交物料
      if (this.deliveryForm.delivery_type == 'sep') {
        this.deliveryForm.sepInfo = JSON.stringify(this.deliveryData.orderInfo.items)
        this.deliveryForm.delivery_corp = ''
        this.deliveryForm.delivery_code = ''
      } else {
        this.deliveryForm.sepInfo = {}
      }
      delivery(this.deliveryForm).then((response) => {
        var deliveryStatus = response.data.data.delivery_status
        if (deliveryStatus && deliveryStatus != 'PENDING') {
          this.handleCancel()
          this.$message.success(this.$t('08fc23a1.de3b52'))
          this.getOrders(this.params)
        } else {
          this.$message.error(this.$t('08fc23a1.2249c1'))
          return false
        }
      })
    },
    cancelOrderAction(order_id) {
      //取消订单
      let params = { order_type: 'normal' }
      getOrderDetail(order_id).then((response) => {
        this.cancelOrderData = response.data.data
        console.log(this.cancelOrderData)
        if (this.cancelOrderData.orderInfo.cancel_status == 'SUCCESS') {
          this.$message.error(this.$t('08fc23a1.8f8a2c'))
          return false
        }
        this.cancelOrderVisible = true
      })
      this.cancelOrderForm.order_id = order_id
    },
    handleCancelOrder() {
      this.cancel_order = ''
      this.cancelOrderVisible = false
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
        this.$message.error(this.$t('08fc23a1.1be7fb'))
        return false
      }
      if (this.cancelOrderForm.cancel_reason == 12 && this.cancelOrderForm.other_reason == '') {
        this.$message.error(this.$t('08fc23a1.d31b9c'))
        return false
      }
      cancelOrderConfirm(this.cancelOrderForm.order_id, this.cancelOrderForm).then((response) => {
        var cancelOrderStatus = response.data.data.refund_status
        if (cancelOrderStatus == 'WAIT_CHECK') {
          this.handleCancelOrder()
          this.$message.success(this.$t('08fc23a1.86a02e'))
          this.getOrders(this.params)
        } else {
          this.$message.success(this.$t('08fc23a1.dc8eed'))
          this.getOrders(this.params)
          return false
        }
      })
    },
    exportData(type) {
      this.getParams()
      if (type) {
        this.params.type = type
      }
      this.params.page = 1
      if (this.params.order_type != 'normal') {
        this.$message({
          type: 'error',
          message: this.$t('08fc23a1.08bd5c')
        })
        return
      }
      orderExport(this.params).then((response) => {
        if (response.data.data.status) {
          this.$message({
            type: 'success',
            message: this.$t('08fc23a1.3e1ddd')
          })
          return
        } else if (response.data.data.url) {
          this.downloadUrl = response.data.data.url
          this.downloadName = response.data.data.filename
          this.downloadView = true
        } else {
          this.$message({
            type: 'error',
            message: this.$t('08fc23a1.89ae53')
          })
          return
        }
      })
    }
  }
}
</script>
<style>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
