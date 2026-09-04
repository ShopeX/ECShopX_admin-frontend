<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <!-- <div v-if="$route.path.indexOf('detail') === -1 && $route.path.indexOf('process') === -1"> -->
  <SpPage>
    <SpRouterView>
      <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onSearch">
        <SpFilterFormItem prop="mobile" :label="$t('60de5de3.ce2bf3')">
          <el-input v-model="params.mobile" :placeholder="$t('60de5de3.a11d70')" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="order_id" :label="$t('60de5de3.070dce')">
          <el-input v-model="params.order_id" :placeholder="$t('60de5de3.e9e836')" />
        </SpFilterFormItem>

        <SpFilterFormItem prop="order_date" :label="$t('60de5de3.43c297')">
          <el-date-picker
            v-model="params.order_date"
            clearable
            type="daterange"
            align="right"
            format="yyyy-MM-dd"
            :range-separator="$t('60de5de3.981cbe')"
            :start-placeholder="$t('60de5de3.b44c0f')"
            :end-placeholder="$t('60de5de3.1d468b')"
            prefix-icon="null"
            :default-time="defaultTime"
            :picker-options="pickerOptions"
          />
        </SpFilterFormItem>

        <!-- <SpFilterFormItem
        v-if="!VERSION_STANDARD() && !VERSION_IN_PURCHASE()"
        prop="distributor_type"
        label="订单分类:"
      >
        <el-select v-model="params.distributor_type" clearable placeholder="请选择">
          <el-option
            v-for="item in orderCategory"
            :key="item.value"
            size="mini"
            :label="item.title"
            :value="item.value"
          />
        </el-select>
      </SpFilterFormItem> -->
        <SpFilterFormItem
          v-if="
            (!isMicorMall || login_type != 'distributor') &&
            !VERSION_B2C() &&
            !VERSION_IN_PURCHASE()
          "
          prop="distributor_id"
          :label="$t('60de5de3.16f2bc')"
        >
          <SpSelectShop
            v-model="params.distributor_id"
            clearable
            :placeholder="$t('60de5de3.708c9d')"
          />
        </SpFilterFormItem>
      </SpFilterForm>

      <div class="action-container">
        <el-dropdown trigger="click" @command="handleExport">
          <el-button type="primary" plain>
            {{ $t('d41d8cd9.i6j7k8') }}<i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="exportInvoice">
              {{ $t('60de5de3.019aea') }}
            </el-dropdown-item>
            <el-dropdown-item command="exportSupplierOrders">
              {{ $t('60de5de3.d4d21f') }}
            </el-dropdown-item>
            <el-dropdown-item command="exportOrderItems">
              {{ $t('60de5de3.a19dd9') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

      <el-tabs v-model="params.order_status" type="card" @tab-click="onSearch">
        <el-tab-pane
          v-for="item in orderStatus"
          :key="item.value"
          :label="item.title"
          :name="item.value"
        />
        <el-table v-loading="loading" border :data="tableList">
          <el-table-column width="180" prop="order_id" :label="$t('60de5de3.1e8dc2')">
            <template slot-scope="scope">
              <div class="order-num">
                {{ scope.row.order_id }}
                <el-tooltip effect="dark" :content="$t('60de5de3.79d3ab')" placement="top-start">
                  <i
                    v-clipboard:copy="scope.row.order_id"
                    v-clipboard:success="onCopySuccess"
                    class="el-icon-document-copy"
                  />
                </el-tooltip>
              </div>
              <div class="order-time">
                <el-tooltip effect="dark" :content="$t('60de5de3.2240cc')" placement="top-start">
                  <i class="el-icon-time" />
                </el-tooltip>
                {{ scope.row.create_time | datetime('YYYY-MM-DD HH:mm:ss') }}
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="pay_type" width="120" label="支付方式" align="right" header-align="center">
          <template slot-scope="scope">
            {{ $t(payTypeList[scope.row.pay_type]) }}
          </template>
        </el-table-column> -->
          <!-- <el-table-column prop="total_fee" width="120" label="订单金额（¥）" align="right" header-align="center">
          <template slot-scope="scope">
            {{ (scope.row.total_fee / 100).toFixed(2) }}
          </template>
        </el-table-column> -->
          <el-table-column
            prop="cost_fee"
            width="120"
            :label="$t('60de5de3.17b4aa')"
            align="right"
            header-align="center"
          >
            <template slot-scope="scope">
              {{ (scope.row.cost_fee / 100).toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="cost_fee"
            width="120"
            :label="$t('60de5de3.0545e0')"
            align="right"
            header-align="center"
          >
            <template slot-scope="scope">
              {{ (scope.row.item_fee / 100).toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column
            width="100"
            :label="$t('60de5de3.4dd437')"
            align="right"
            header-align="center"
          >
            <template slot-scope="scope">
              {{ (scope.row.freight_fee || 0) / 100 }}
            </template>
          </el-table-column>
          <el-table-column prop="receiver_mobile" width="130" :label="$t('60de5de3.61270b')">
            <template slot-scope="scope">
              <span>{{ scope.row.receiver_mobile }}</span>
              <el-tooltip
                v-if="datapass_block == 0"
                effect="dark"
                :content="$t('60de5de3.79d3ab')"
                placement="top-start"
              >
                <i
                  v-clipboard:copy="scope.row.receiver_mobile"
                  v-clipboard:success="onCopySuccess"
                  class="el-icon-document-copy"
                />
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="receiver_name" :label="$t('60de5de3.6aea70')" />
          <el-table-column prop="shop_name" :label="$t('60de5de3.dc43e6')" />

          <el-table-column prop="distributor_name" :label="$t('60de5de3.53cc55')" width="150" />
          <!--        <template v-if="login_type != 'merchant'">-->
          <!--          <el-table-column v-if="!isMicorMall" label="订单类型">-->
          <!--            <template slot-scope="scope">-->
          <!--              {{ getOrderType(scope.row) }}-->
          <!--            </template>-->
          <!--          </el-table-column>-->
          <!--        </template>-->
          <el-table-column prop="order_status" :label="$t('60de5de3.86f6cf')">
            <template slot-scope="scope">
              {{ scope.row.order_status_msg }}
            </template>
          </el-table-column>

          <!--        <el-table-column label="配送方式">-->
          <!--          <template slot-scope="scope">-->
          <!--            {{ getDistributionType(scope.row) }}-->
          <!--          </template>-->
          <!--        </el-table-column>-->

          <!-- <el-table-column prop="source_name" label="来源"></el-table-column> -->
          <el-table-column :label="$t('60de5de3.2b6bc0')" fixed="left">
            <template slot-scope="scope">
              <el-button type="text" style="margin-right: 8px">
                <router-link
                  :to="`${$route.path}/detail?orderId=${scope.row.order_id}&resource=${$route.path}`"
                >
                  {{ $t('d41d8cd9.l9m0n1') }}
                </router-link>
              </el-button>
              <el-popover placement="right" trigger="hover">
                <div class="operating-icons">
                  <el-button type="text">
                    <router-link
                      :to="`${$route.path}/process?orderId=${scope.row.order_id}&resource=${$route.path}`"
                    >
                      {{ $t('d41d8cd9.o2p3q4') }}
                    </router-link>
                  </el-button>
                  <template v-for="(btn, index) in scope.row.actionBtns">
                    <el-button
                      :key="`btn-item__${index}`"
                      type="text"
                      @click="handleAction(scope.row, btn)"
                    >
                      {{ btn.name }}
                    </el-button>
                  </template>
                </div>
                <el-button slot="reference" type="text">
                  {{ $t('d41d8cd9.r5s6t7') }}<i class="el-icon-d-arrow-right" />
                </el-button>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
        <div class="mt-4 text-right">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :current-page.sync="page.pageIndex"
            :page-sizes="[10, 20, 50]"
            :total="page.total"
            :page-size="page.pageSize"
            @current-change="onCurrentChange"
            @size-change="onSizeChange"
          />
        </div>
      </el-tabs>

      <!-- 备注 -->
      <SpDialog
        ref="remarkDialogRef"
        v-model="remarkDialog"
        :title="`${$t('d41d8cd9.u8v9w0')}${remarkForm.orderId}】`"
        :form="remarkForm"
        :form-list="remarkFormList"
        @onSubmit="onRemarkSubmit"
      />

      <!-- 取消订单 -->
      <SpDialog
        ref="cancelOrderDialogRef"
        v-model="cancelOrderDialog"
        class="dialog-cancelorder"
        :title="`${$t('d41d8cd9.x1y2z3')}${cancelOrderForm.order_id}】`"
        :loading="cancelOrderForm.loading"
        :form="cancelOrderForm"
        :form-list="cancelOrderFormList"
        @onSubmit="onCancelOrderSubmit"
      />

      <!-- 发货 -->
      <SpDialog
        ref="deliverGoodsDialogRef"
        v-model="deliverGoodsDialog"
        width="1000px"
        :title="`${$t('d41d8cd9.a4b5c6')}${deliverGoodsForm.order_id}】`"
        :form="deliverGoodsForm"
        :form-list="deliverGoodsFormList"
        @onSubmit="deliverGoodsSubmit"
      />

      <!-- 核销 -->
      <SpDialog
        ref="writeOffDialogRef"
        v-model="writeOffDialog"
        :title="`${$t('d41d8cd9.d7e8f9')}${writeOffForm.order_id}】`"
        :form="writeOffForm"
        :form-list="writeOffFormList"
        @onSubmit="writeOffSubmit"
      />

      <!-- 退款审核 -->
      <SpDialog
        ref="refundRef"
        v-model="refundDialog"
        :title="`${$t('d41d8cd9.g0h1i2')}${refundForm.order_id}】`"
        :form="refundForm"
        :form-list="refundFormList"
        @onSubmit="refundSubmit"
      />
    </SpRouterView>
  </SpPage>
</template>
<script>
import { mapGetters } from 'vuex'
import mixin from '@/mixins'
import { pageMixin } from '@/mixins'
import {
  VERSION_STANDARD,
  VERSION_PLATFORM,
  isArray,
  VERSION_B2C,
  VERSION_IN_PURCHASE,
  IS_DISTRIBUTOR,
  IS_SUPPLIER
} from '@/utils'
import { exportInvoice, orderExport } from '@/api/trade'
import CompTableView from '../trade/normalorders/components/comp-tableview'
import CompReceiveInfo from '../trade/normalorders/components/comp-receiveInfo'
import moment from 'moment'
import {
  DISTRIBUTION_TYPE,
  ORDER_STATUS,
  ORDER_B2C_STATUS,
  IN_PURCHASE_STATUS,
  ORDER_TYPE,
  INVOICE_STATUS,
  ORDER_CATEGORY,
  PICKER_DATE_OPTIONS,
  REFUND_STATUS,
  REFUND_PROCESS,
  PAY_TYPE
} from '@/consts'

export default {
  // components: { CompTableView },
  mixins: [mixin, pageMixin],
  data() {
    return {
      loading: false,
      defaultTime: ['00:00:00', '23:59:59'],
      params: {
        mobile: '',
        order_id: '',
        order_date: [],
        original_order_id: '',
        supplier_name: '',
        order_class_exclude: 'drug,pointsmall,community',
        salesman_mobile: '',
        receipt_type: '', // 配送类型
        source: '', // 订单来源
        order_status: '', // 订单状态
        order_class: '', // 订单类型
        is_invoiced: '', // 开票状态
        time_start_begin: '', //
        time_start_end: '',
        distributor_type: '', // 订单分类
        distributor_id: '', // 店铺
        subDistrict: []
      },
      payTypeList: {
        wxpay: this.$t('d41d8cd9.j3k4l5'),
        point: this.$t('d41d8cd9.m6n7o8'),
        deposit: this.$t('d41d8cd9.p9q0r1')
      },
      datapass_block: 1, // 是否为数据脱敏
      subDistrictList: [],
      distributionType: DISTRIBUTION_TYPE,
      orderStatus: VERSION_B2C()
        ? ORDER_B2C_STATUS
        : VERSION_IN_PURCHASE()
        ? IN_PURCHASE_STATUS
        : ORDER_STATUS,
      orderType: ORDER_TYPE,
      invoiceStatus: INVOICE_STATUS,
      orderCategory: ORDER_CATEGORY,
      pickerOptions: PICKER_DATE_OPTIONS,
      orderSourceList: [],
      remarkDialog: false,
      remarkFormList: [
        {
          label: this.$t('d41d8cd9.s2t3u4'),
          key: 'remark',
          type: 'textarea',
          maxlength: 150,
          placeholder: this.$t('d41d8cd9.v5w6x7'),
          required: true,
          message: this.$t('d41d8cd9.y8z9a0')
        }
      ],
      remarkForm: {
        orderId: '',
        is_distribution: 1,
        remark: ''
      },
      cancelOrderDialog: false,
      cancelOrderFormList: [
        {
          component: () => <div class='tip-bar'>{this.$t('d41d8cd9.b1c2d3')}</div>
        },
        {
          label: '',
          component: () => (
            <CompReceiveInfo
              orderId={this.cancelOrderForm.order_id}
              on-onLoad={this.onLoadCancelOrderRef}
            />
          )
        },
        {
          label: this.$t('d41d8cd9.e4f5g6'),
          key: 'cancel_reason',
          placeholder: this.$t('d41d8cd9.h7i8j9'),
          type: 'select',
          options: [
            { title: this.$t('d41d8cd9.k0l1m2'), value: 1 },
            { title: this.$t('d41d8cd9.n3o4p5'), value: 2 },
            { title: this.$t('d41d8cd9.q6r7s8'), value: 3 },
            { title: this.$t('d41d8cd9.t9u0v1'), value: 4 },
            { title: this.$t('d41d8cd9.w2x3y4'), value: 5 },
            { title: this.$t('d41d8cd9.z5a6b7'), value: 6 },
            { title: this.$t('d41d8cd9.c8d9e0'), value: 7 },
            { title: this.$t('d41d8cd9.f1g2h3'), value: 8 },
            { title: this.$t('d41d8cd9.i4j5k6'), value: 9 },
            { title: this.$t('d41d8cd9.l7m8n9'), value: 10 },
            { title: this.$t('d41d8cd9.o0p1q2'), value: 11 },
            { title: this.$t('d41d8cd9.r3s4t5'), value: 12 }
          ],
          required: true,
          message: this.$t('d41d8cd9.y8z9a0'),
          onChange: (e) => {
            if (e == 12) {
              this.cancelOrderFormList[3].isShow = true
            } else {
              this.cancelOrderFormList[3].isShow = false
            }
          }
        },
        {
          label: this.$t('d41d8cd9.u6v7w8'),
          key: 'other_reason',
          type: 'input',
          placeholder: this.$t('d41d8cd9.x9y0z1'),
          isShow: false,
          validator: (rule, value, callback) => {
            if (this.cancelOrderForm.cancel_reason == 12 && !value) {
              callback(new Error(this.$t('d41d8cd9.y8z9a0')))
            } else {
              callback()
            }
          }
        }
      ],
      cancelOrderForm: {
        order_id: '',
        buy_member: '',
        buy_mobile: '',
        receive_name: '',
        receive_mobile: '',
        receive_address: '',
        loading: false,
        cancel_reason: '',
        other_reason: ''
      },
      deliverGoodsDialog: false,
      deliverGoodsFormList: [
        {
          label: this.$t('d41d8cd9.a2b3c4'),
          key: 'delivery_type',
          type: 'radio',
          disabled: false,
          options: [
            { label: 'batch', name: this.$t('d41d8cd9.d5e6f7') },
            { label: 'sep', name: this.$t('d41d8cd9.g8h9i0') }
          ],
          onChange: (e) => {
            if (e == 'sep') {
              this.deliverGoodsFormList[1].options[3].isShow = true
            } else {
              this.deliverGoodsFormList[1].options[3].isShow = false
            }
          }
        },
        {
          label: '',
          key: 'items',
          type: 'table',
          options: [
            { title: this.$t('d41d8cd9.j1k2l3'), key: 'item_name' },
            { title: this.$t('d41d8cd9.m4n5o6'), key: 'num', width: 60 },
            { title: this.$t('d41d8cd9.p7q8r9'), key: 'delivery_item_num', width: 100 },
            // { title: '总支付价（¥）', key: 'price', width: 120 },
            {
              title: this.$t('d41d8cd9.s0t1u2'),
              key: 'item_num',
              width: 160,
              render: (row, column, cell) => {
                if (row.delivery_item_num && row.num <= row.delivery_item_num) {
                  return this.$t('d41d8cd9.v3w4x5')
                } else {
                  return (
                    <el-input-number
                      size='mini'
                      v-model={row.delivery_num}
                      min={1}
                      max={row.num - row.delivery_item_num}
                    ></el-input-number>
                  )
                }
              },
              isShow: false
            }
          ]
        },
        {
          label: this.$t('d41d8cd9.y6z7a8'),
          key: 'delivery_corp',
          placeholder: this.$t('d41d8cd9.b9c0d1'),
          type: 'select',
          options: [],
          required: true,
          message: this.$t('d41d8cd9.y8z9a0')
        },
        {
          label: this.$t('d41d8cd9.e2f3g4'),
          key: 'delivery_code',
          type: 'input',
          placeholder: this.$t('d41d8cd9.h5i6j7'),
          required: true,
          message: this.$t('d41d8cd9.y8z9a0')
        }
      ],
      deliverGoodsForm: {
        order_id: '',
        ship_mobile: '',
        delivery_type: 'batch',
        delivery_corp: '',
        delivery_code: '',
        type: '',
        items: []
      },
      writeOffDialog: false,
      writeOffFormList: [
        {
          label: '',
          key: 'items',
          type: 'table',
          options: [
            { title: this.$t('d41d8cd9.j1k2l3'), key: 'item_name' },
            { title: this.$t('d41d8cd9.m4n5o6'), key: 'num', width: 60 },
            { title: this.$t('d41d8cd9.p7q8r9'), key: 'delivery_item_num', width: 100 }
            // { title: '总支付价（¥）', key: 'price', width: 120 }
          ]
        }
      ],
      writeOffForm: {
        order_id: '',
        pickupcode: '',
        items: []
      },
      refundDialog: false,
      refundFormList: [
        {
          label: this.$t('d41d8cd9.k8l9m0'),
          key: 'source',
          type: 'text'
        },
        {
          label: this.$t('d41d8cd9.n1o2p3'),
          key: 'applyTime',
          type: 'text'
        },
        {
          label: this.$t('d41d8cd9.q4r5s6'),
          key: 'refundStatus',
          type: 'text'
        },
        {
          label: this.$t('d41d8cd9.t7u8v9'),
          key: 'process',
          type: 'text'
        },
        {
          label: this.$t('d41d8cd9.w0x1y2'),
          key: 'refundPrice',
          type: 'text'
        },
        {
          label: this.$t('d41d8cd9.z3a4b5'),
          key: 'payType',
          type: 'text'
        },
        {
          label: this.$t('d41d8cd9.e4f5g6'),
          key: 'reason',
          type: 'text'
        },
        {
          label: this.$t('d41d8cd9.c6d7e8'),
          key: 'check_cancel',
          type: 'radio',
          options: [
            { label: '0', name: this.$t('d41d8cd9.f9g0h1') },
            { label: '1', name: this.$t('d41d8cd9.i2j3k4') }
          ],
          onChange: (e) => {
            if (e == '0') {
              this.refundFormList[8].isShow = true
            } else {
              this.refundFormList[8].isShow = false
            }
          }
        },
        {
          label: this.$t('d41d8cd9.l5m6n7'),
          key: 'shop_reject_reason',
          type: 'input',
          placeholder: this.$t('d41d8cd9.o8p9q0'),
          isShow: false,
          validator: (rule, value, callback) => {
            if (this.refundFormList.check_cancel == '0' && !value) {
              callback(new Error(this.$t('d41d8cd9.y8z9a0')))
            } else {
              callback()
            }
          }
        }
      ],
      refundForm: {
        order_id: '',
        source: '',
        applyTime: '',
        refundStatus: '',
        process: '',
        refundPrice: '',
        payType: '',
        reason: '',
        check_cancel: '1',
        shop_reject_reason: ''
      },
      changePriceDialog: false,
      changePriceFormList: [
        {
          component: () => <div class='tip-bar'>{this.$t('d41d8cd9.r1s2t3')}</div>
        },
        {
          component: () => (
            <div class='receive-info'>
              <div class='receive-item'>
                <label class='item-label'>{this.$t('d41d8cd9.u4v5w6')}</label>
                {`${this.changePriceForm.buy_member} | ${this.changePriceForm.buy_mobile}`}
              </div>
              <div class='receive-item'>
                <label class='item-label'>{`${
                  this.changePriceForm.isZiti
                    ? this.$t('d41d8cd9.x7y8z9')
                    : this.$t('d41d8cd9.a0b1c2')
                }`}</label>
                {`${this.changePriceForm.receive_name} | ${this.changePriceForm.receive_mobile}`}
              </div>
              <div class='receive-item'>
                <label class='item-label'>
                  {`${
                    this.changePriceForm.isZiti
                      ? this.$t('d41d8cd9.d3e4f5')
                      : this.$t('d41d8cd9.g6h7i8')
                  }`}
                </label>
                {this.changePriceForm.receive_address}
              </div>
            </div>
          )
        },
        {
          component: () => (
            <CompTableView
              value={this.changePriceForm.items}
              orderId={this.changePriceForm.order_id}
              itemTotalFee={this.changePriceForm.itemTotalFee}
              pointFreightFee={this.changePriceForm.pointFreightFee}
              receiptType={this.changePriceForm.receipt_type}
              freightFee={this.changePriceForm.freightFee}
              orderFee={this.changePriceForm.orderFee}
              on-onChange={this.onChangeTableView}
            />
          )
        }
      ],
      changePriceForm: {
        order_id: '',
        buy_member: '',
        buy_mobile: '',
        receive_name: '',
        receive_mobile: '',
        receive_address: '',
        loading: false,
        isZiti: false,
        items: [],
        // 配送类型
        receipt_type: '',
        // 商品应付金额
        itemTotalFee: 0,
        // 邮费
        freightFee: 0,
        // 订单应付金额
        orderFee: 0,
        // 运费积分抵扣
        pointFreightFee: 0
      },
      origin: '',
      isBindOMS: false
    }
  },
  computed: {
    ...mapGetters(['login_type', 'isMicorMall'])
  },
  async created() {
    const { result } = await this.$api.trade.isBindOMS()
    this.isBindOMS = result
  },
  mounted() {
    this.origin = window.location.origin
    const { tab } = this.$route.query
    if (tab) {
      this.params.order_status = tab
    }
    this.fetchList()
    this.getOrderSourceList()
    this.getLogisticsList()
    this.getSubDistrictList()
    this.getPickupcodeSetting()

    this.$EventBus.$on('event.tradelist.refresh', () => {
      this.fetchList()
    })
  },
  methods: {
    async fetchList() {
      this.loading = true
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        order_type: 'normal',
        ...this.params
      }
      if (isArray(this.params.create_time) && this.params.create_time.length >= 2) {
        params.time_start_begin = moment(this.params.create_time[0]).unix()
        params.time_start_end = moment(this.params.create_time[1]).unix()
      }

      if (isArray(this.params.delivery_time) && this.params.delivery_time.length >= 2) {
        params.delivery_time_begin = moment(this.params.delivery_time[0]).unix()
        params.delivery_time_end = moment(this.params.delivery_time[1]).unix()
      }

      delete params.create_time
      delete params.delivery_time

      const { list, total_count, datapass_block } = await this.$api.supplier.getOrderList(params)

      this.tableList = list.map((item) => {
        const actionBtns = []
        const {
          distributor_id,
          receipt_type,
          cancel_status,
          is_logistics,
          is_invoiced,
          invoice,
          order_status,
          order_status_des,
          ziti_status,
          dada,
          delivery_status,
          pay_status,
          can_apply_aftersales,
          items
        } = item
        const isDada = receipt_type == 'dada'
        const isLogistics = receipt_type == 'logistics'
        if (VERSION_STANDARD() || distributor_id == 0 || this.login_type == 'distributor') {
          if (
            !isDada &&
            cancel_status == 'NO_APPLY_CANCEL' &&
            ['PAYED'].includes(order_status) &&
            ziti_status != 'DONE'
          ) {
            // 非同城配的取消订单按钮
            if (!isDada || (isDada && ['0', '1'].includes(dada.data_status))) {
              actionBtns.push({ name: this.$t('60de5de3.b21b5e'), key: 'cancel' })
            }
          }

          if (order_status == 'PAYED' && receipt_type == 'ziti' && ziti_status == 'PENDING') {
            actionBtns.push({ name: this.$t('60de5de3.e7d31e'), key: 'writeOff' })
          }

          if (
            isDada &&
            ['NO_APPLY_CANCEL', 'FAILS'].includes(cancel_status) &&
            order_status == 'PAYED' &&
            delivery_status != 'DONE' &&
            dada.dada_status == '0'
          ) {
            actionBtns.push({ name: this.$t('60de5de3.7d4577'), key: 'takeOrder' })
          }

          if (isDada && pay_status == 'PAYED' && dada.dada_status == '9') {
            actionBtns.push({ name: this.$t('60de5de3.f1557d'), key: 'orderSendBack' })
          }

          if (
            (isLogistics || is_logistics) &&
            !isDada &&
            order_status == 'PAYED' &&
            delivery_status != 'DONE' &&
            receipt_type != 'ziti' &&
            this.login_type == 'supplier'
          ) {
            actionBtns.push({ name: this.$t('60de5de3.045315'), key: 'deliverGoods' })
          }

          if (cancel_status == 'WAIT_PROCESS' && order_status == 'PAYED') {
            actionBtns.push({ name: this.$t('60de5de3.44c198'), key: 'refund' })
          }

          if (is_invoiced == '0' && invoice) {
            actionBtns.push({ name: this.$t('60de5de3.963609'), key: 'waitInvoice' })
          }
        }
        if (order_status == 'WAIT_PAID_CONFIRM') {
          actionBtns.push({ name: this.$t('60de5de3.e56c99'), key: 'paidConfirm' })
        }
        if (can_apply_aftersales == 1) {
          if (VERSION_PLATFORM()) {
            if ((this.IS_ADMIN() && distributor_id == 0) || this.IS_DISTRIBUTOR()) {
              actionBtns.push({ name: this.$t('60de5de3.45eb0c'), key: 'salesAfter' })
            }
          } else if (!VERSION_IN_PURCHASE()) {
            actionBtns.push({ name: this.$t('60de5de3.45eb0c'), key: 'salesAfter' })
          }
        }

        return {
          ...item,
          actionBtns
        }
      })
      this.page.total = total_count ? total_count : 0
      this.datapass_block = datapass_block
      this.loading = false
    },
    async getSubDistrictList() {
      const res = await this.$api.subdistrict.getSubDistrictList()
      console.log(`getSubDistrictList:`, res)
      this.subDistrictList = res
    },
    getOrderType({ order_class, type }) {
      if (order_class == 'normal') {
        return type == '1' ? this.$t('60de5de3.443aa4') : this.$t('60de5de3.e7978e')
      }
      const fd = ORDER_TYPE.find((item) => item.value == order_class)
      if (fd) {
        return fd.title
      }
    },
    getDistributionType({ receipt_type }) {
      const fd = DISTRIBUTION_TYPE.find((item) => item.value == receipt_type)
      if (fd) {
        return fd.title
      }
    },
    async getOrderSourceList() {
      const { list } = await this.$api.datacube.getSourcesList({
        page: 1,
        pageSize: 1000
      })

      this.orderSourceList = list.map(({ sourceName, sourceId }) => {
        return {
          title: sourceName,
          value: sourceId
        }
      })
    },
    async getLogisticsList() {
      const { list } = await this.$api.trade.getLogisticsList()
      this.deliverGoodsFormList[2].options = list.map((item) => {
        return {
          title: item.name,
          value: item.value
        }
      })
    },
    async handleAction(
      {
        order_id,
        order_status,
        distributor_remark,
        receiver_mobile,
        items,
        delivery_type,
        delivery_status,
        receipt_type
      },
      { key }
    ) {
      if (key == 'remark') {
        this.$refs['remarkDialogRef'].resetForm()
        this.remarkForm.orderId = order_id
        this.remarkForm.remark = distributor_remark
        this.remarkDialog = true
      } else if (key == 'cancel') {
        this.$refs['cancelOrderDialogRef'].resetForm()
        if (order_status == 'PAYED') {
          this.cancelOrderFormList[0].isShow = false
        } else {
          this.cancelOrderFormList[0].isShow = true
        }
        this.cancelOrderForm.order_id = order_id
        this.cancelOrderForm.loading = true
        this.cancelOrderDialog = true
      } else if (key == 'deliverGoods') {
        // 已对接 OMS 时仅供应商端可发货，其余端不可操作
        if (this.isBindOMS && !IS_SUPPLIER()) {
          return this.$message.warning(this.$t('60de5de3.72b354'))
        }

        this.$refs['deliverGoodsDialogRef'].resetForm()
        this.deliverGoodsForm.order_id = order_id
        this.deliverGoodsForm.ship_mobile = receiver_mobile
        this.deliverGoodsForm.items = items.map((item) => {
          return {
            ...item,
            price: item.price / 100
          }
        })
        this.deliverGoodsForm.type = delivery_type
        // 部分发货
        if (delivery_status == 'PARTAIL') {
          this.deliverGoodsForm.delivery_type = 'sep'
          this.deliverGoodsFormList[0].disabled = true
          this.deliverGoodsFormList[1].options[3].isShow = true
        } else {
          this.deliverGoodsFormList[0].disabled = false
          this.deliverGoodsFormList[1].options[3].isShow = false
        }
        this.deliverGoodsDialog = true
      } else if (key == 'writeOff') {
        this.$refs['writeOffDialogRef'].resetForm()
        this.writeOffForm.order_id = order_id
        this.writeOffForm.items = items.map((item) => {
          return {
            ...item,
            price: item.price / 100
          }
        })
        this.writeOffDialog = true
      } else if (key == 'takeOrder') {
        this.$confirm(this.$t('60de5de3.f3e80d'), this.$t('60de5de3.c1b226'), {
          confirmButtonText: this.$t('60de5de3.38cf16'),
          cancelButtonText: this.$t('60de5de3.625fb2'),
          type: 'warning'
        }).then(async () => {
          await this.$api.trade.doBusinessReceipt(order_id)
          this.$message.success(this.$t('60de5de3.740ca1'))
        })
      } else if (key == 'paidConfirm') {
        this.$confirm(this.$t('60de5de3.a7d5e1'), this.$t('60de5de3.90df67'), {
          confirmButtonText: this.$t('60de5de3.38cf16'),
          cancelButtonText: this.$t('60de5de3.625fb2'),
          type: 'warning'
        }).then(async () => {
          await this.$api.supplier.orderPaidConfirm({ order_id })
          this.fetchList()
          this.$message.success(this.$t('60de5de3.d19795'))
        })
      } else if (key == 'orderSendBack') {
        this.$confirm(this.$t('60de5de3.f1557d'), this.$t('60de5de3.df2e45'), {
          confirmButtonText: this.$t('60de5de3.38cf16'),
          cancelButtonText: this.$t('60de5de3.625fb2'),
          type: 'warning'
        }).then(async () => {
          await this.$api.trade.confirmBack(order_id)
          this.$message.success(this.$t('60de5de3.2ab3ab'))
        })
      } else if (key == 'refund') {
        this.$refs['refundRef'].resetForm()
        this.refundDialog = true
        const {
          cancel_from,
          create_time,
          refund_status,
          progress,
          fee_symbol,
          total_fee,
          pay_type,
          pay_channel,
          cancel_reason
        } = await this.$api.trade.getCancelOrderInfo(order_id, { order_type: 'normal' })
        this.refundForm = {
          ...this.refundForm,
          order_id,
          source: cancel_from == 'buyer' ? this.$t('60de5de3.a54c66') : this.$t('60de5de3.ca6dd8'),
          applyTime: moment(create_time * 1000).format('YYYY-MM-DD HH:mm:ss'),
          refundStatus: REFUND_STATUS[refund_status],
          process: REFUND_PROCESS[progress],
          refundPrice: `${fee_symbol}${total_fee / 100}`,
          payType: pay_channel ? PAY_TYPE[pay_channel] : PAY_TYPE[pay_type],
          reason: cancel_reason
        }
      } else if (key == 'waitInvoice') {
        this.$confirm(this.$t('60de5de3.23d4a7'), this.$t('60de5de3.02d981'), {
          cancelButtonText: this.$t('60de5de3.625fb2'),
          confirmButtonText: this.$t('60de5de3.38cf16'),
          type: 'warning'
        }).then(async () => {
          const { success } = await this.$api.trade.isInvoiced({
            order_id: order_id,
            status: 1
          })
          this.fetchList()
          if (success) {
            this.$message.success(this.$t('60de5de3.ee73ff'))
          } else {
            this.$message.error(this.$t('60de5de3.34b438'))
          }
        })
      } else if (key == 'changePrice') {
        this.changePriceDialog = true
        this.changePriceForm.loading = true
        const { orderInfo, distributor, profit, tradeInfo } = await this.$api.trade.getOrderDetail(
          order_id
        )
        const { store_address, store_name } = distributor
        const {
          items = [],
          user_id,
          receiver_name,
          receiver_mobile,
          receiver_state,
          receiver_city,
          receiver_district,
          receiver_address,
          order_class,
          total_fee,
          freight_fee,
          item_fee_new,
          item_total_fee,
          receipt_type,
          point_freight_fee
        } = orderInfo
        const { username, mobile } = await this.$api.member.getMember({
          user_id: user_id
        })
        this.changePriceForm.loading = false
        this.changePriceForm.order_id = order_id
        this.changePriceForm.buy_member = username
        this.changePriceForm.buy_mobile = mobile
        if (
          order_class == 'excard' ||
          order_class == 'shopadmin' ||
          (order_class == 'normal' && receipt_type == 'ziti')
        ) {
          this.changePriceForm.receive_name = username
          this.changePriceForm.receive_mobile = mobile
          this.changePriceForm.receive_address = `${store_address}（${store_name}）`
          this.changePriceForm.isZiti = true
        } else {
          this.changePriceForm.receive_name = receiver_name
          this.changePriceForm.receive_mobile = receiver_mobile
          this.changePriceForm.receive_address = `${receiver_state}${receiver_city}${receiver_district}${receiver_address}`
          this.changePriceForm.isZiti = false
        }
        this.changePriceForm.receipt_type = receipt_type
        // this.changePriceForm.itemFee = item_fee_new / 100
        this.changePriceForm.freightFee = freight_fee / 100
        this.changePriceForm.orderFee = total_fee / 100
        this.changePriceForm.itemTotalFee = item_total_fee / 100
        // 运费积分抵扣
        this.changePriceForm.pointFreightFee = point_freight_fee / 100

        this.changePriceForm.items = items.map((item) => {
          return {
            ...item,
            change_discount: '',
            change_price: '',
            total: item_total_fee / 100
          }
        })
        console.log('this.changePriceForm:', this.changePriceForm)
      } else if (key == 'salesAfter') {
        if (IS_DISTRIBUTOR()) {
          this.$router.push({ path: `/shopadmin/order/tradenormalorders/after-sale/${order_id}` })
        } else if (this.$store.getters.login_type == 'supplier') {
          this.$router.push({ path: `/supplier/order/tradenormalorders/after-sale/${order_id}` })
        } else {
          this.$router.push({ path: `/order/entitytrade/tradenormalorders/after-sale/${order_id}` })
        }
      }
    },
    onLoadCancelOrderRef() {
      this.cancelOrderForm.loading = false
    },
    async onRemarkSubmit() {
      await this.$api.order.remarks(this.remarkForm)
      this.$message.success(this.$t('60de5de3.c75e91'))
      this.remarkDialog = false
      this.fetchList()
    },
    async onCancelOrderSubmit() {
      const { order_id } = this.cancelOrderForm
      console.log(this.cancelOrderForm)
      await this.$api.trade.cancelOrderConfirm(order_id, this.cancelOrderForm)
      this.cancelOrderDialog = false
      this.$message.success(this.$t('60de5de3.c771bd'))
      // await this.$confirm('订单已取消', '确认信息', {
      //   distinguishCancelAndClose: true,
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消'
      // })
      this.fetchList()
    },
    async deliverGoodsSubmit() {
      const { order_id, delivery_type, delivery_corp, delivery_code, ship_mobile, type, items } =
        this.deliverGoodsForm
      let params = {
        order_id,
        ship_mobile,
        delivery_type,
        delivery_corp,
        delivery_code,
        type
      }
      // 拆单发货
      if (delivery_type == 'sep') {
        params['sepInfo'] = JSON.stringify(items.filter((item) => item.delivery_num))
      }
      const { delivery_status } = await this.$api.trade.delivery(params)
      this.deliverGoodsDialog = false
      this.fetchList()
      if (delivery_status && delivery_status != 'PENDING') {
        this.$message.success(this.$t('60de5de3.de3b52'))
      } else {
        this.$message.error(this.$t('60de5de3.2249c1'))
      }
    },
    async writeOffSubmit() {
      const { order_id } = this.writeOffForm
      const { ziti_status } = await this.$api.trade.doWriteoff(order_id, this.writeOffForm)
      if (ziti_status == 'DONE') {
        this.$message.success(this.$t('60de5de3.b8ba0a'))
      } else {
        this.$message.error(this.$t('60de5de3.47c5ff'))
      }
      this.writeOffDialog = false
    },
    async refundSubmit() {
      const { order_id, check_cancel, shop_reject_reason } = this.refundForm
      const { refund_status } = await this.$api.trade.cancelConfirm(order_id, {
        order_id,
        check_cancel,
        shop_reject_reason
      })
      if (refund_status == 'AUDIT_SUCCESS') {
        this.$message.success(this.$t('60de5de3.a41119'))
      } else if (refund_status == 'SHOP_CHECK_FAILS') {
        this.$message.success(this.$t('60de5de3.ff3161'))
      } else {
        this.$message.error(this.$t('60de5de3.f74090'))
      }
      this.refundDialog = false
    },
    async changePriceSubmit() {
      const { items, freightFee, order_id, pointFreightFee } = this.changePriceForm
      let params = {
        order_id,
        down_type: 'items'
      }
      if (freightFee >= 0) {
        params['freight_fee'] = (freightFee - pointFreightFee) * 100
      }
      if (items.length > 0) {
        params['items'] = items.map((item) => {
          return {
            item_id: item.item_id,
            total_fee: item.total_fee
          }
        })
      }
      await this.$api.trade.changePriceConfirm(params)
      this.changePriceDialog = false
      this.fetchList()
    },
    async salesAfterSubmit() {},
    exportInvoice() {
      let type = 'normal'
      this.$emit('onChangeData', 'params', { type })
      exportInvoice({
        ...this.params,
        type,
        order_type: 'supplier_order'
      }).then((response) => {
        const { status, url, filename } = response.data.data
        if (status) {
          this.$message.success(this.$t('60de5de3.3e1ddd'))
          this.$export_open('invoice')
          return
        } else if (url) {
          window.open(url)
        } else {
          this.$message.error(this.$t('60de5de3.c849e4'))
          return
        }
      })
    },
    exportOrderItems() {
      this.exportData('normal_order')
    },
    exportSupplierOrders() {
      this.exportData('supplier_order')
    },
    handleExport(command) {
      if (command === 'exportInvoice') {
        this.exportInvoice()
      } else if (command === 'exportSupplierOrders') {
        this.exportSupplierOrders()
      } else if (command === 'exportOrderItems') {
        this.exportOrderItems()
      }
    },
    exportData(type) {
      console.log('====exportData', type)
      let params = {
        ...this.params,
        order_type: 'normal',
        type,
        page: this.page.pageIndex
      }
      if (isArray(this.params.create_time) && this.params.create_time.length >= 2) {
        params.time_start_begin = moment(this.params.create_time[0]).unix()
        params.time_start_end = moment(this.params.create_time[1]).unix()
      }

      if (isArray(this.params.delivery_time) && this.params.delivery_time.length >= 2) {
        params.delivery_time_begin = moment(this.params.delivery_time[0]).unix()
        params.delivery_time_end = moment(this.params.delivery_time[1]).unix()
      }

      delete params.create_time
      delete params.delivery_time

      orderExport(params).then((response) => {
        const { status, url, filename } = response.data.data
        if (status) {
          this.$message.success(this.$t('60de5de3.3e1ddd'))
          this.$export_open(type)
          return
        } else if (url) {
          window.open(url)
        } else {
          this.$message.error(this.$t('60de5de3.c849e4'))
          return
        }
      })
    },
    async uploadHandleChange(file) {
      const params = {
        isUploadFile: true,
        file_type: 'normal_orders',
        file: file.raw
      }
      await this.$api.common.handleUploadFile(params)
      this.$message.success(this.$t('60de5de3.7bbfaa'))
      this.fetchList()
    },
    async uploadHandlePatchCancel(file) {
      const params = {
        isUploadFile: true,
        file_type: 'normal_orders_cancel',
        file: file.raw
      }
      await this.$api.common.handleUploadFile(params)
      this.$message.success(this.$t('60de5de3.7bbfaa'))
      this.fetchList()
    },
    async getPickupcodeSetting() {
      const { pickupcode_status } = await this.$api.company.getPickupcodeSetting()
      if (!pickupcode_status) return
      this.writeOffFormList.push({
        label: this.$t('60de5de3.a5a7dd'),
        key: 'pickupcode',
        type: 'input',
        placeholder: this.$t('60de5de3.ba231e'),
        required: true,
        message: this.$t('60de5de3.281bad')
      })
    },
    onChangeTableView({ items, item_fee_new, freight_fee, total_fee, item_total_fee }) {
      // this.changePriceForm.itemFee = item_fee_new / 100
      this.changePriceForm.freightFee = freight_fee / 100
      this.changePriceForm.orderFee = total_fee / 100
      this.changePriceForm.itemTotalFee = item_total_fee / 100
      this.changePriceForm.items = items.map((item) => {
        return {
          ...item,
          change_discount: '',
          change_price: '',
          total: item_total_fee / 100
        }
      })
    },
    async downloadtemplate() {
      const { name, file } = await this.$api.common.download()
      if (file) {
        var a = document.createElement('a')
        a.href = file
        a.download = name
        document.body.appendChild(a)
        a.click()
        a.remove()
      }
    }
  }
}
</script>
<style lang="scss" scope>
.sp-filter-form {
  margin-bottom: 16px;
}

.dialog-changeprice,
.dialog-cancelorder,
.dialog-salesafter {
  .el-form {
    margin-right: 0 !important;
  }
  .tip-bar {
    border: 1px solid #7db3f2;
    border-radius: 4px;
    background: #e6f0ff;
    padding: 0 10px;
    color: #4f77a8;
    height: 36px;
    line-height: 36px;
    font-size: 13px;
  }
  .receive-info {
    line-height: 22px;
  }
  .receive-item {
    color: #7d7d7d;
  }
  .receive-label {
    color: #b8b8b8;
  }
}
.dialog-cancelorder {
  .el-form-item {
    &:nth-child(1) {
      .el-form-item__content {
        margin-left: 0 !important;
      }
    }
    &:nth-child(2) {
      .el-form-item__content {
        margin-left: 26px !important;
      }
    }
  }
}
.dialog-changeprice {
  .el-form-item {
    &:nth-child(1),
    &:nth-child(2),
    &:nth-child(3) {
      .el-form-item__content {
        margin-left: 0 !important;
      }
    }
  }
}
.dialog-salesafter {
  .el-form-item {
    &:nth-child(1) {
      .el-form-item__content {
        margin-left: 0 !important;
      }
    }
  }
}
</style>
