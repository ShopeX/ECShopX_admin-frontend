<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <SpRouterView>
      <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onSearch">
        <SpFilterFormItem prop="mobile" :label="$t('931fca81.ce2bf3')">
          <el-input v-model="params.mobile" :placeholder="$t('931fca81.c746c6')" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="order_id" :label="$t('931fca81.070dce')">
          <el-input v-model="params.order_id" :placeholder="$t('931fca81.e9e836')" />
        </SpFilterFormItem>
        <SpFilterFormItem v-if="!isMicorMall" prop="receipt_type" :label="$t('931fca81.e9d70f')">
          <el-select v-model="params.receipt_type" clearable :placeholder="$t('931fca81.708c9d')">
            <el-option
              v-for="item in distributionType"
              :key="item.value"
              size="mini"
              :label="item.title"
              :value="item.value"
            />
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem prop="create_time" :label="$t('931fca81.43c297')" size="max">
          <el-date-picker
            v-model="params.create_time"
            clearable
            type="datetimerange"
            align="right"
            format="yyyy-MM-dd HH:mm:ss"
            :range-separator="$t('931fca81.981cbe')"
            :start-placeholder="$t('931fca81.b44c0f')"
            :end-placeholder="$t('931fca81.1d468b')"
            prefix-icon="null"
            :default-time="defaultTime"
            :picker-options="pickerOptions"
          />
        </SpFilterFormItem>
        <SpFilterFormItem prop="act_id" :label="$t('931fca81.ae21df')" size="max">
          <el-select
            v-model="params.act_id"
            v-scroll="() => pagesQuery.nextPage()"
            multiple
            :placeholder="$t('931fca81.708c9d')"
          >
            <el-option
              v-for="(item, index) in purchaseActivityList"
              :key="`activity-item__${index}`"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem prop="delivery_time" :label="$t('931fca81.21524c')" size="max">
          <el-date-picker
            v-model="params.delivery_time"
            clearable
            type="datetimerange"
            align="right"
            format="yyyy-MM-dd HH:mm:ss"
            :range-separator="$t('931fca81.981cbe')"
            :start-placeholder="$t('931fca81.b44c0f')"
            :end-placeholder="$t('931fca81.1d468b')"
            prefix-icon="null"
            :default-time="defaultTime"
            :picker-options="pickerOptions"
          />
        </SpFilterFormItem>
        <SpFilterFormItem prop="enterprise_id" :label="$t('931fca81.3c0a34')" size="max">
          <el-select
            v-model="params.enterprise_id"
            v-scroll="() => enterprisePagesQuery.nextPage()"
            multiple
            :placeholder="$t('931fca81.708c9d')"
          >
            <el-option
              v-for="(item, index) in enterpriseList"
              :key="`enterprise-item__${index}`"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </SpFilterFormItem>
      </SpFilterForm>

      <div class="action-container">
        <el-dropdown>
          <el-button type="primary" plain>
            {{ $t('931fca81.55405e') }}<i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <div @click="exportInvoice">{{ $t('931fca81.019aea') }}</div>
            </el-dropdown-item>
            <el-dropdown-item>
              <div @click="exportDataMaster">{{ $t('931fca81.d4d21f') }}</div>
            </el-dropdown-item>
            <el-dropdown-item>
              <div @click="exportDataNormal">{{ $t('931fca81.a19dd9') }}</div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-tooltip effect="light" :content="$t('931fca81.29119c')" placement="top-start">
          <el-upload
            action=""
            class="btn-upload"
            :on-change="uploadHandleChange"
            :auto-upload="false"
            :show-file-list="false"
          >
            <el-button type="primary" plain> {{ $t('931fca81.425991') }} </el-button>
          </el-upload>
        </el-tooltip>
        <el-upload
          action=""
          class="btn-upload"
          :on-change="uploadHandlePatchCancel"
          :auto-upload="false"
          :show-file-list="false"
        >
          <el-button type="primary" plain> {{ $t('931fca81.321129') }} </el-button>
        </el-upload>
      </div>

      <el-tabs v-model="params.order_status" type="card" @tab-click="onSearch">
        <el-tab-pane
          v-for="item in orderStatus"
          :key="item.value"
          :label="item.title"
          :name="item.value"
        />
        <el-table v-loading="loading" border :data="tableList">
          <el-table-column width="220" prop="order_id" :label="$t('931fca81.a6d10d')">
            <template slot-scope="scope">
              <div class="order-num">
                {{ scope.row.order_id }}
                <el-tooltip effect="dark" :content="$t('931fca81.79d3ab')" placement="top-start">
                  <i
                    v-clipboard:copy="scope.row.order_id"
                    v-clipboard:success="onCopySuccess"
                    class="el-icon-document-copy"
                  />
                </el-tooltip>
              </div>
              <div v-if="scope.row.distributor_id !== '0'" class="order-store">
                <el-tooltip effect="dark" :content="$t('931fca81.8a0cc2')" placement="top-start">
                  <i class="el-icon-office-building" />
                </el-tooltip>
                {{ scope.row?.sale_salesman_distributor_info?.name }}
              </div>
              <div class="order-time">
                <el-tooltip effect="dark" :content="$t('931fca81.43c297')" placement="top-start">
                  <i class="el-icon-time" />
                </el-tooltip>
                {{ scope.row.create_time | datetime('YYYY-MM-DD HH:mm:ss') }}
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="total_fee" width="120" :label="$t('931fca81.d194d2')">
            <template slot-scope="scope">
              {{ (scope.row.total_fee / 100).toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column width="100" :label="$t('931fca81.4dd437')">
            <template slot-scope="scope">
              {{ (scope.row.freight_fee || 0) / 100 }}
            </template>
          </el-table-column>
          <el-table-column prop="mobile" :label="$t('931fca81.a32da1')">
            <template slot-scope="scope">
              <template v-if="!scope.row.user_delete && login_type !== 'merchant'">
                <router-link
                  target="_blank"
                  :to="{
                    path: `${
                      login_type != 'distributor'
                        ? '/member/member/memberlist/detail'
                        : '/shopadmin/member/member/detail'
                    }`,
                    query: { user_id: scope.row.user_id }
                  }"
                >
                  {{ scope.row.mobile }}
                </router-link>
                <el-tooltip
                  v-if="datapass_block == 0"
                  effect="dark"
                  :content="$t('931fca81.79d3ab')"
                  placement="top-start"
                >
                  <i
                    v-clipboard:copy="scope.row.mobile"
                    v-clipboard:success="onCopySuccess"
                    class="el-icon-document-copy"
                  />
                </el-tooltip>
              </template>
              <template v-else slot-scope="scope">
                <span>{{ scope.row.mobile }}</span>
                <el-tooltip
                  v-if="datapass_block == 0"
                  effect="dark"
                  :content="$t('931fca81.79d3ab')"
                  placement="top-start"
                >
                  <i
                    v-clipboard:copy="scope.row.mobile"
                    v-clipboard:success="onCopySuccess"
                    class="el-icon-document-copy"
                  />
                </el-tooltip>
              </template>
            </template>
          </el-table-column>
          <template v-if="login_type != 'merchant'">
            <el-table-column v-if="!isMicorMall" :label="$t('931fca81.5cd56b')">
              <template slot-scope="scope">
                {{ getOrderType(scope.row) }}
              </template>
            </el-table-column>
          </template>
          <el-table-column prop="order_status" :label="$t('931fca81.86f6cf')">
            <template slot-scope="scope">
              {{ scope.row.order_status_msg }}
            </template>
          </el-table-column>

          <el-table-column :label="$t('931fca81.edfe4c')">
            <template slot-scope="scope">
              {{ getDistributionType(scope.row) }}
            </template>
          </el-table-column>

          <!-- <el-table-column prop="source_name" label="来源"></el-table-column> -->
          <el-table-column :label="$t('931fca81.2b6bc0')" fixed="left">
            <template slot-scope="scope">
              <el-button type="text" style="margin-right: 8px">
                <router-link
                  :to="`${$route.path}/detail?orderId=${scope.row.order_id}&resource=${$route.path}`"
                >
                  {{ $t('931fca81.f26225') }}
                </router-link>
              </el-button>
              <el-popover placement="right" trigger="hover">
                <div class="operating-icons">
                  <el-button type="text">
                    <router-link
                      :to="`${$route.path}/process?orderId=${scope.row.order_id}&resource=${$route.path}`"
                    >
                      {{ $t('931fca81.456d29') }}
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
                  {{ $t('931fca81.0ec9ea') }}<i class="el-icon-d-arrow-right" />
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
        :title="$t('931fca81.0bd1b0', [remarkForm.orderId])"
        :form="remarkForm"
        :form-list="remarkFormList"
        @onSubmit="onRemarkSubmit"
      />

      <!-- 取消订单 -->
      <SpDialog
        ref="cancelOrderDialogRef"
        v-model="cancelOrderDialog"
        class="dialog-cancelorder"
        :title="$t('931fca81.4dad03', [cancelOrderForm.order_id])"
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
        :title="$t('931fca81.b70c69', [deliverGoodsForm.order_id])"
        :form="deliverGoodsForm"
        :form-list="deliverGoodsFormList"
        @onSubmit="deliverGoodsSubmit"
      />

      <!-- 核销 -->
      <SpDialog
        ref="writeOffDialogRef"
        v-model="writeOffDialog"
        :title="$t('931fca81.f35625', [writeOffForm.order_id])"
        :form="writeOffForm"
        :form-list="writeOffFormList"
        @onSubmit="writeOffSubmit"
      />

      <!-- 退款审核 -->
      <SpDialog
        ref="refundRef"
        v-model="refundDialog"
        :title="$t('931fca81.047fb2', [refundForm.order_id])"
        :form="refundForm"
        :form-list="refundFormList"
        @onSubmit="refundSubmit"
      />

      <!-- 订单改价 -->
      <SpDialog
        ref="changePriceRef"
        v-model="changePriceDialog"
        width="1000px"
        class="dialog-changeprice"
        :loading="changePriceForm.loading"
        :destroy-on-close="true"
        :title="$t('931fca81.d73114', [changePriceForm.order_id])"
        :form="changePriceForm"
        :form-list="changePriceFormList"
        @onSubmit="changePriceSubmit"
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
  IS_ADMIN,
  IS_DISTRIBUTOR
} from '@/utils'
import { exportInvoice, orderExport } from '@/api/trade'
import Pages from '@/utils/pages'
import CompTableView from './comps/comp-tableview'
import CompReceiveInfo from './comps/comp-receiveInfo'
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
        salesman_mobile: '',
        receipt_type: '', // 配送类型
        source: '', // 订单来源
        order_status: '', // 订单状态
        order_class: 'employee_purchase', // 订单类型
        is_invoiced: '', // 开票状态
        time_start_begin: '', //
        time_start_end: '',
        distributor_type: '', // 订单分类
        distributor_id: '', // 店铺
        subDistrict: [],
        act_id: [],
        enterprise_id: ''
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
          label: this.$t('931fca81.b57447'),
          key: 'remark',
          type: 'textarea',
          maxlength: 150,
          placeholder: this.$t('931fca81.bd36b6'),
          required: true,
          message: this.$t('931fca81.281bad')
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
          component: () => <div class='tip-bar'>{this.$t('931fca81.ef5069')}</div>
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
          label: this.$t('931fca81.4a3df6'),
          key: 'cancel_reason',
          placeholder: this.$t('931fca81.bc4a11'),
          type: 'select',
          options: [
            { title: this.$t('931fca81.8f038a'), value: 1 },
            { title: this.$t('931fca81.5e58ba'), value: 2 },
            { title: this.$t('931fca81.151111'), value: 3 },
            { title: this.$t('931fca81.baa450'), value: 4 },
            { title: this.$t('931fca81.3013ee'), value: 5 },
            { title: this.$t('931fca81.e7197e'), value: 6 },
            { title: this.$t('931fca81.74c00b'), value: 7 },
            { title: this.$t('931fca81.16264a'), value: 8 },
            { title: this.$t('931fca81.13bea0'), value: 9 },
            { title: this.$t('931fca81.0e6c86'), value: 10 },
            { title: this.$t('931fca81.e21052'), value: 11 },
            { title: this.$t('931fca81.94490e'), value: 12 }
          ],
          required: true,
          message: this.$t('931fca81.281bad'),
          onChange: (e) => {
            if (e == 12) {
              this.cancelOrderFormList[3].isShow = true
            } else {
              this.cancelOrderFormList[3].isShow = false
            }
          }
        },
        {
          label: this.$t('931fca81.fba26e'),
          key: 'other_reason',
          type: 'input',
          placeholder: this.$t('931fca81.c6af7d'),
          isShow: false,
          validator: (rule, value, callback) => {
            if (this.cancelOrderForm.cancel_reason == 12 && !value) {
              callback(new Error(this.$t('931fca81.281bad')))
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
          label: this.$t('931fca81.b01994'),
          key: 'delivery_type',
          type: 'radio',
          disabled: false,
          options: [
            { label: 'batch', name: this.$t('931fca81.afb426') },
            { label: 'sep', name: this.$t('931fca81.95d243') }
          ],
          onChange: (e) => {
            if (e == 'sep') {
              this.deliverGoodsFormList[1].options[4].isShow = true
            } else {
              this.deliverGoodsFormList[1].options[4].isShow = false
            }
          }
        },
        {
          label: '',
          key: 'items',
          type: 'table',
          options: [
            { title: this.$t('931fca81.de5472'), key: 'item_name' },
            { title: this.$t('931fca81.0bf60b'), key: 'num', width: 60 },
            { title: this.$t('931fca81.745165'), key: 'delivery_item_num', width: 100 },
            { title: this.$t('931fca81.e95382'), key: 'price', width: 120 },
            {
              title: this.$t('931fca81.4f5a46'),
              key: 'item_num',
              width: 160,
              render: (row, column, cell) => {
                if (row.num - row.delivery_item_num == 0) {
                  return this.$t('931fca81.fad522')
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
          label: this.$t('931fca81.f3af96'),
          key: 'delivery_corp',
          placeholder: this.$t('931fca81.8367e8'),
          type: 'select',
          options: [],
          required: true,
          message: this.$t('931fca81.281bad')
        },
        {
          label: this.$t('931fca81.0bb075'),
          key: 'delivery_code',
          type: 'input',
          placeholder: this.$t('931fca81.0e9f1e'),
          required: true,
          message: this.$t('931fca81.281bad')
        }
      ],
      deliverGoodsForm: {
        order_id: '',
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
            { title: this.$t('931fca81.de5472'), key: 'item_name' },
            { title: this.$t('931fca81.0bf60b'), key: 'num', width: 60 },
            { title: this.$t('931fca81.745165'), key: 'delivery_item_num', width: 100 },
            { title: this.$t('931fca81.e95382'), key: 'price', width: 120 }
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
          label: this.$t('931fca81.60d99e'),
          key: 'source',
          type: 'text'
        },
        {
          label: this.$t('931fca81.5ba072'),
          key: 'applyTime',
          type: 'text'
        },
        {
          label: this.$t('931fca81.db7c80'),
          key: 'refundStatus',
          type: 'text'
        },
        {
          label: this.$t('931fca81.93b365'),
          key: 'process',
          type: 'text'
        },
        {
          label: this.$t('931fca81.a0cd4c'),
          key: 'refundPrice',
          type: 'text'
        },
        {
          label: this.$t('931fca81.0c9d2b'),
          key: 'payType',
          type: 'text'
        },
        {
          label: this.$t('931fca81.4a3df6'),
          key: 'reason',
          type: 'text'
        },
        {
          label: this.$t('931fca81.9eb71d'),
          key: 'check_cancel',
          type: 'radio',
          options: [
            { label: '0', name: this.$t('931fca81.1bf19c') },
            { label: '1', name: this.$t('931fca81.e61f2c') }
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
          label: this.$t('931fca81.f48f94'),
          key: 'shop_reject_reason',
          type: 'input',
          placeholder: this.$t('931fca81.fc955a'),
          isShow: false,
          validator: (rule, value, callback) => {
            if (this.refundFormList.check_cancel == '0' && !value) {
              callback(new Error(this.$t('931fca81.281bad')))
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
          component: () => <div class='tip-bar'>{this.$t('931fca81.596d85')}</div>
        },
        {
          component: () => (
            <div class='receive-info'>
              <div class='receive-item'>
                <label class='item-label'>{this.$t('931fca81.60db2a')}</label>
                {`${this.changePriceForm.buy_member} | ${this.changePriceForm.buy_mobile}`}
              </div>
              <div class='receive-item'>
                <label class='item-label'>
                  {this.changePriceForm.isZiti
                    ? this.$t('931fca81.6b1044')
                    : this.$t('931fca81.02ddb4')}
                </label>
                {`${this.changePriceForm.receive_name} | ${this.changePriceForm.receive_mobile}`}
              </div>
              <div class='receive-item'>
                <label class='item-label'>
                  {this.changePriceForm.isZiti
                    ? this.$t('931fca81.d87411')
                    : this.$t('931fca81.e512d6')}
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
      isBindOMS: false,
      purchaseActivityList: [],
      enterpriseList: [],
      jstErpSetting: {}
    }
  },
  computed: {
    ...mapGetters(['login_type', 'isMicorMall'])
  },
  async created() {
    const { result } = await this.$api.trade.isBindOMS()
    this.isBindOMS = result

    this.pagesQuery = new Pages({
      fetch: this.getPurchaseActivity
    }).nextPage()

    this.enterprisePagesQuery = new Pages({
      fetch: this.getEnterpriseList
    }).nextPage()
  },
  async mounted() {
    await this.getJstErpSetting()

    this.origin = window.location.origin
    const { tab, activity_id } = this.$route.query
    if (tab) {
      this.params.order_status = tab
    }
    if (activity_id) {
      this.params.act_id.push(activity_id)
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
    getJstErpSetting() {
      this.$api.third.getJstErpSetting().then((res) => {
        this.jstErpSetting = res
      })
    },
    async fetchList() {
      this.loading = true
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        order_type: 'normal',
        ...this.params,
        subdistrict_parent_id: this.params.subDistrict[0], // 街道id
        subdistrict_id: this.params.subDistrict[1] // 居委id
      }
      delete params.subDistrict

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

      const { list, pager, datapass_block, total_count } = await this.$api.trade.getOrderList(
        params
      )

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
          can_apply_aftersales
        } = item
        const isDada = receipt_type == 'dada'
        const isLogistics = receipt_type == 'logistics'
        if (VERSION_STANDARD() || distributor_id == 0 || this.login_type == 'distributor') {
          if (
            !isDada &&
            cancel_status == 'NO_APPLY_CANCEL' &&
            ['NOTPAY', 'PAYED'].includes(order_status) &&
            ziti_status != 'DONE'
          ) {
            // 非同城配的取消订单按钮
            if (!isDada || (isDada && ['0', '1'].includes(dada.data_status))) {
              actionBtns.push({ name: this.$t('931fca81.b21b5e'), key: 'cancel' })
            }
          }

          if (order_status == 'PAYED' && receipt_type == 'ziti' && ziti_status == 'PENDING') {
            actionBtns.push({ name: this.$t('931fca81.e7d31e'), key: 'writeOff' })
          }

          if (
            isDada &&
            ['NO_APPLY_CANCEL', 'FAILS'].includes(cancel_status) &&
            order_status == 'PAYED' &&
            delivery_status != 'DONE' &&
            dada.dada_status == '0'
          ) {
            actionBtns.push({ name: this.$t('931fca81.7d4577'), key: 'takeOrder' })
          }

          if (isDada && pay_status == 'PAYED' && dada.dada_status == '9') {
            actionBtns.push({ name: this.$t('931fca81.f1557d'), key: 'orderSendBack' })
          }

          if (
            (isLogistics || is_logistics) &&
            !isDada &&
            order_status == 'PAYED' &&
            delivery_status != 'DONE' &&
            receipt_type != 'ziti' &&
            !this.jstErpSetting?.is_open
          ) {
            actionBtns.push({ name: this.$t('931fca81.045315'), key: 'deliverGoods' })
          }

          if (cancel_status == 'WAIT_PROCESS' && order_status == 'PAYED') {
            actionBtns.push({ name: this.$t('931fca81.44c198'), key: 'refund' })
          }

          if (is_invoiced == '0' && invoice) {
            actionBtns.push({ name: this.$t('931fca81.963609'), key: 'waitInvoice' })
          }

          actionBtns.push({ name: this.$t('931fca81.2432b5'), key: 'remark' })
        }
        if (order_status == 'NOTPAY') {
          if (VERSION_PLATFORM()) {
            if ((this.IS_ADMIN() && distributor_id == 0) || this.IS_DISTRIBUTOR()) {
              actionBtns.push({ name: this.$t('931fca81.bb6d2b'), key: 'changePrice' })
            }
          } else if (!VERSION_IN_PURCHASE()) {
            actionBtns.push({ name: this.$t('931fca81.bb6d2b'), key: 'changePrice' })
          }
        }
        if (can_apply_aftersales == 1) {
          if (VERSION_PLATFORM()) {
            if ((this.IS_ADMIN() && distributor_id == 0) || this.IS_DISTRIBUTOR()) {
              actionBtns.push({ name: this.$t('931fca81.45eb0c'), key: 'salesAfter' })
            }
          } else if (!VERSION_IN_PURCHASE()) {
            actionBtns.push({ name: this.$t('931fca81.45eb0c'), key: 'salesAfter' })
          }
        }

        return {
          ...item,
          actionBtns
        }
      })
      this.page.total = parseInt(total_count)
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
        return type == '1' ? this.$t('931fca81.443aa4') : this.$t('931fca81.e7978e')
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
        if (this.isBindOMS) {
          return this.$message.warning(this.$t('931fca81.72b354'))
        }

        this.$refs['deliverGoodsDialogRef'].resetForm()
        this.deliverGoodsForm.order_id = order_id
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
          this.deliverGoodsFormList[1].options[4].isShow = true
        } else {
          this.deliverGoodsFormList[0].disabled = false
          this.deliverGoodsFormList[1].options[4].isShow = false
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
        this.$confirm(this.$t('931fca81.f3e80d'), this.$t('931fca81.c1b226'), {
          confirmButtonText: this.$t('931fca81.38cf16'),
          cancelButtonText: this.$t('931fca81.625fb2'),
          type: 'warning'
        }).then(async () => {
          await this.$api.trade.doBusinessReceipt(order_id)
          this.$message.success(this.$t('931fca81.740ca1'))
        })
      } else if (key == 'orderSendBack') {
        this.$confirm(this.$t('931fca81.f1557d'), this.$t('931fca81.df2e45'), {
          confirmButtonText: this.$t('931fca81.38cf16'),
          cancelButtonText: this.$t('931fca81.625fb2'),
          type: 'warning'
        }).then(async () => {
          await this.$api.trade.confirmBack(order_id)
          this.$message.success(this.$t('931fca81.2ab3ab'))
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
          source: cancel_from == 'buyer' ? this.$t('931fca81.a54c66') : this.$t('931fca81.ca6dd8'),
          applyTime: moment(create_time * 1000).format('YYYY-MM-DD HH:mm:ss'),
          refundStatus: REFUND_STATUS[refund_status],
          process: REFUND_PROCESS[progress],
          refundPrice: `${fee_symbol}${total_fee / 100}`,
          payType: pay_channel ? PAY_TYPE[pay_channel] : PAY_TYPE[pay_type],
          reason: cancel_reason
        }
      } else if (key == 'waitInvoice') {
        this.$confirm(this.$t('931fca81.23d4a7'), this.$t('931fca81.02d981'), {
          cancelButtonText: this.$t('931fca81.625fb2'),
          confirmButtonText: this.$t('931fca81.38cf16'),
          type: 'warning'
        }).then(async () => {
          const { success } = await this.$api.trade.isInvoiced({
            order_id: order_id,
            status: 1
          })
          this.fetchList()
          if (success) {
            this.$message.success(this.$t('931fca81.ee73ff'))
          } else {
            this.$message.error(this.$t('931fca81.34b438'))
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
      this.$message.success(this.$t('931fca81.c75e91'))
      this.remarkDialog = false
      this.fetchList()
    },
    async onCancelOrderSubmit() {
      const { order_id } = this.cancelOrderForm
      console.log(this.cancelOrderForm)
      await this.$api.trade.cancelOrderConfirm(order_id, this.cancelOrderForm)
      this.cancelOrderDialog = false
      this.$message.success(this.$t('931fca81.c771bd'))
      // await this.$confirm('订单已取消', '确认信息', {
      //   distinguishCancelAndClose: true,
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消'
      // })
      this.fetchList()
    },
    async deliverGoodsSubmit() {
      const { order_id, delivery_type, delivery_corp, delivery_code, type, items } =
        this.deliverGoodsForm
      let params = {
        order_id,
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
        this.$message.success(this.$t('931fca81.de3b52'))
      } else {
        this.$message.error(this.$t('931fca81.2249c1'))
      }
    },
    async writeOffSubmit() {
      const { order_id } = this.writeOffForm
      const { ziti_status } = await this.$api.trade.doWriteoff(order_id, this.writeOffForm)
      if (ziti_status == 'DONE') {
        this.$message.success(this.$t('931fca81.b8ba0a'))
      } else {
        this.$message.error(this.$t('931fca81.47c5ff'))
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
        this.$message.success(this.$t('931fca81.a41119'))
      } else if (refund_status == 'SHOP_CHECK_FAILS') {
        this.$message.success(this.$t('931fca81.ff3161'))
      } else {
        this.$message.error(this.$t('931fca81.f74090'))
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
        order_type: 'normal'
      }).then((response) => {
        const { status, url, filename } = response.data.data
        if (status) {
          this.$message.success(this.$t('931fca81.3e1ddd'))
          this.$export_open('invoice')
          return
        } else if (url) {
          window.open(url)
        } else {
          this.$message.error(this.$t('931fca81.c849e4'))
          return
        }
      })
    },
    exportDataNormal() {
      this.exportData('normal_order')
    },
    exportDataMaster() {
      this.exportData('normal_master_order')
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
          this.$message.success(this.$t('931fca81.3e1ddd'))
          this.$export_open(type)
          return
        } else if (url) {
          window.open(url)
        } else {
          this.$message.error(this.$t('931fca81.c849e4'))
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
      this.$message.success(this.$t('931fca81.7bbfaa'))
      this.fetchList()
    },
    async uploadHandlePatchCancel(file) {
      const params = {
        isUploadFile: true,
        file_type: 'normal_orders_cancel',
        file: file.raw
      }
      await this.$api.common.handleUploadFile(params)
      this.$message.success(this.$t('931fca81.7bbfaa'))
      this.fetchList()
    },
    async getPickupcodeSetting() {
      const { pickupcode_status } = await this.$api.company.getPickupcodeSetting()
      if (!pickupcode_status) return
      this.writeOffFormList.push({
        label: this.$t('931fca81.a5a7dd'),
        key: 'pickupcode',
        type: 'input',
        placeholder: this.$t('931fca81.ba231e'),
        required: true,
        message: this.$t('931fca81.281bad')
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
    async getPurchaseActivity({ page, pageSize }) {
      const { list, total_count } = await this.$api.marketing.getPurchaseActivity({
        page,
        pageSize
      })
      this.pagesQuery.setTotal(total_count)
      this.purchaseActivityList = this.purchaseActivityList.concat(list)
    },
    async getEnterpriseList({ page, pageSize }) {
      const { list, total_count } = await this.$api.member.getPurchaseCompanyList({
        page,
        pageSize
      })
      this.pagesQuery.setTotal(total_count)
      this.enterpriseList = this.enterpriseList.concat(list)
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
