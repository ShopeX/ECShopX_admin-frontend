<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <SpRouterView>
      <div class="page-body">
        <div>
          <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onSearch">
            <SpFilterFormItem prop="mobile" :label="$t('273931a4.ce2bf3')">
              <el-input v-model="params.mobile" :placeholder="$t('273931a4.c746c6')" />
            </SpFilterFormItem>
            <SpFilterFormItem prop="order_id" :label="$t('273931a4.070dce')">
              <el-input v-model="params.order_id" :placeholder="$t('273931a4.e9e836')" />
            </SpFilterFormItem>
            <!-- <SpFilterFormItem
          v-if="login_type != 'merchant' && !VERSION_B2C() && !VERSION_IN_PURCHASE()"
          prop="salesman_mobile"
          label="导购手机号:"
        >
          <el-input
            v-model="params.salesman_mobile"
            placeholder="请输入导购手机号码"
          />
        </SpFilterFormItem> -->
            <SpFilterFormItem
              v-if="!isMicorMall"
              prop="receipt_type"
              :label="$t('273931a4.e9d70f')"
            >
              <el-select
                v-model="params.receipt_type"
                clearable
                :placeholder="$t('273931a4.708c9d')"
              >
                <el-option
                  v-for="item in distributionType"
                  :key="item.value"
                  size="mini"
                  :label="$t(item.title)"
                  :value="item.value"
                />
              </el-select>
            </SpFilterFormItem>
            <SpFilterFormItem prop="source" :label="$t('273931a4.b36ea7')">
              <el-select v-model="params.source" clearable :placeholder="$t('273931a4.708c9d')">
                <el-option
                  v-for="item in orderSourceList"
                  :key="item.value"
                  size="mini"
                  :label="item.title"
                  :value="item.value"
                />
              </el-select>
            </SpFilterFormItem>
            <SpFilterFormItem prop="order_class" :label="$t('273931a4.0e83be')">
              <el-select
                v-model="params.order_class"
                clearable
                :placeholder="$t('273931a4.708c9d')"
              >
                <el-option
                  v-for="item in orderType"
                  :key="item.value"
                  size="mini"
                  :label="$t(item.title)"
                  :value="item.value"
                />
              </el-select>
            </SpFilterFormItem>
            <SpFilterFormItem prop="create_time" :label="$t('273931a4.43c297')" size="max">
              <el-date-picker
                v-model="params.create_time"
                clearable
                type="datetimerange"
                align="right"
                format="yyyy-MM-dd HH:mm:ss"
                :range-separator="$t('273931a4.981cbe')"
                :start-placeholder="$t('273931a4.b44c0f')"
                :end-placeholder="$t('273931a4.1d468b')"
                prefix-icon="null"
                :default-time="defaultTime"
                :picker-options="pickerOptions"
              />
            </SpFilterFormItem>
            <SpFilterFormItem
              v-if="!isMicorMall && !VERSION_IN_PURCHASE()"
              prop="is_invoiced"
              :label="$t('273931a4.dfc420')"
            >
              <el-select
                v-model="params.is_invoiced"
                clearable
                :placeholder="$t('273931a4.708c9d')"
              >
                <el-option
                  v-for="item in invoiceStatus"
                  :key="item.value"
                  size="mini"
                  :label="$t(item.title)"
                  :value="item.value"
                />
              </el-select>
            </SpFilterFormItem>
            <SpFilterFormItem prop="delivery_time" :label="$t('273931a4.21524c')" size="max">
              <el-date-picker
                v-model="params.delivery_time"
                clearable
                type="datetimerange"
                align="right"
                format="yyyy-MM-dd HH:mm:ss"
                :range-separator="$t('273931a4.981cbe')"
                :start-placeholder="$t('273931a4.b44c0f')"
                :end-placeholder="$t('273931a4.1d468b')"
                prefix-icon="null"
                :default-time="defaultTime"
                :picker-options="pickerOptions"
              />
            </SpFilterFormItem>
            <SpFilterFormItem
              v-if="!VERSION_STANDARD()"
              prop="distributor_type"
              :label="$t('273931a4.e56a5e')"
            >
              <el-select
                v-model="params.distributor_type"
                clearable
                :placeholder="$t('273931a4.708c9d')"
              >
                <el-option
                  v-for="item in orderCategory"
                  :key="item.value"
                  size="mini"
                  :label="item.title"
                  :value="item.value"
                />
              </el-select>
            </SpFilterFormItem>
            <SpFilterFormItem
              v-if="(!isMicorMall || login_type != 'distributor') && !VERSION_B2C()"
              prop="distributor_id"
              :label="$t('273931a4.efa91f')"
            >
              <SpSelectShop
                v-model="params.distributor_id"
                clearable
                :placeholder="$t('273931a4.708c9d')"
              />
            </SpFilterFormItem>
            <SpFilterFormItem prop="subDistrict" :label="$t('273931a4.d3063b')">
              <el-cascader
                v-model="params.subDistrict"
                clearable
                :props="{
                  value: 'id',
                  checkStrictly: true
                }"
                :options="subDistrictList"
              />
            </SpFilterFormItem>
            <SpFilterFormItem prop="params.activity_name" :label="$t('273931a4.94a6f0')">
              <el-input v-model="params.activity_name" :placeholder="$t('273931a4.1c325c')" />
            </SpFilterFormItem>
          </SpFilterForm>

          <div class="action-container">
            <el-dropdown>
              <el-button type="primary" plain>
                {{ $t('273931a4.55405e') }}<i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <div @click="exportInvoice">{{ $t('273931a4.019aea') }}</div>
                </el-dropdown-item>
                <el-dropdown-item>
                  <div @click="exportDataMaster">{{ $t('273931a4.d4d21f') }}</div>
                </el-dropdown-item>
                <el-dropdown-item>
                  <div @click="exportDataNormal">{{ $t('273931a4.a19dd9') }}</div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-tooltip effect="light" :content="$t('273931a4.29119c')" placement="top-start">
              <el-upload
                action=""
                class="btn-upload"
                :on-change="uploadHandleChange"
                :auto-upload="false"
                :show-file-list="false"
              >
                <el-button type="primary" plain>{{ $t('273931a4.425991') }}</el-button>
              </el-upload>
            </el-tooltip>
            <el-upload
              action=""
              class="btn-upload"
              :on-change="uploadHandlePatchCancel"
              :auto-upload="false"
              :show-file-list="false"
            >
              <el-button type="primary" plain>{{ $t('273931a4.321129') }}</el-button>
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
              <el-table-column width="220" prop="order_id" :label="$t('273931a4.a6d10d')">
                <template slot-scope="scope">
                  <div class="order-num">
                    {{ scope.row.order_id }}
                    <el-tooltip
                      effect="dark"
                      :content="$t('273931a4.79d3ab')"
                      placement="top-start"
                    >
                      <i
                        v-clipboard:copy="scope.row.order_id"
                        v-clipboard:success="onCopySuccess"
                        class="el-icon-document-copy"
                      />
                    </el-tooltip>
                  </div>
                  <div v-if="scope.row.distributor_id !== '0'" class="order-store">
                    <el-tooltip
                      effect="dark"
                      :content="$t('273931a4.8a0cc2')"
                      placement="top-start"
                    >
                      <i class="el-icon-office-building" />
                    </el-tooltip>
                    {{ scope.row.distributor_name }}
                  </div>
                  <div class="order-time">
                    <el-tooltip
                      effect="dark"
                      :content="$t('273931a4.2240cc')"
                      placement="top-start"
                    >
                      <i class="el-icon-time" />
                    </el-tooltip>
                    {{ scope.row.create_time | datetime('YYYY-MM-DD HH:mm:ss') }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column width="220" prop="order_id" :label="$t('273931a4.ba9c75')">
                <template slot-scope="scope">
                  <div>{{ $t('273931a4.c10529') }}{{ scope.row.community_info.chief_name }}</div>
                  <div>{{ $t('273931a4.94210f') }}{{ scope.row.community_info.activity_name }}</div>
                  <div>
                    {{ $t('273931a4.3b449b') }}{{ scope.row.community_info.activity_trade_no }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="mobile" width="150" :label="$t('273931a4.52da4a')">
                <template slot-scope="scope">
                  <template v-if="!scope.row.user_delete && login_type !== 'merchant'">
                    <div>
                      {{ $t('273931a4.ac1e1c') }}{{ scope.row.community_info.ziti_contact_user }}
                    </div>
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
                      :content="$t('273931a4.79d3ab')"
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
                      :content="$t('273931a4.79d3ab')"
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
              <el-table-column prop="total_fee" width="120" :label="$t('273931a4.d194d2')">
                <template slot-scope="scope">
                  {{ (scope.row.total_fee / 100).toFixed(2) }}
                </template>
              </el-table-column>
              <el-table-column width="100" :label="$t('273931a4.4dd437')">
                <template slot-scope="scope">
                  {{ (scope.row.freight_fee || 0) / 100 }}
                </template>
              </el-table-column>
              <template v-if="login_type != 'merchant'">
                <el-table-column v-if="!isMicorMall" :label="$t('273931a4.5cd56b')">
                  <template slot-scope="scope">
                    {{ getOrderType(scope.row) }}
                  </template>
                </el-table-column>
              </template>
              <el-table-column prop="order_status" :label="$t('273931a4.86f6cf')">
                <template slot-scope="scope">
                  {{ scope.row.order_status_msg }}
                </template>
              </el-table-column>

              <el-table-column :label="$t('273931a4.edfe4c')">
                <template slot-scope="scope">
                  {{ getDistributionType(scope.row) }}
                </template>
              </el-table-column>

              <!-- <el-table-column prop="source_name" label="来源"></el-table-column> -->
              <el-table-column :label="$t('273931a4.2b6bc0')" fixed="left">
                <template slot-scope="scope">
                  <el-button type="text" style="margin-right: 8px">
                    <router-link
                      :to="`${$route.path}/detail?orderId=${scope.row.order_id}&resource=${$route.path}`"
                    >
                      {{ $t('273931a4.f26225') }}
                    </router-link>
                  </el-button>
                  <el-popover placement="right" trigger="hover">
                    <div class="operating-icons">
                      <el-button type="text">
                        <router-link
                          :to="`${$route.path}/process?orderId=${scope.row.order_id}&resource=${$route.path}`"
                        >
                          {{ $t('273931a4.456d29') }}
                        </router-link>
                      </el-button>
                      <template v-for="(btn, index) in scope.row.actionBtns">
                        <el-button
                          :key="`btn-item__${index}`"
                          type="text"
                          @click="handleAction(scope.row, btn)"
                        >
                          {{ btn.nameKey ? $t(btn.nameKey) : btn.name }}
                        </el-button>
                      </template>
                    </div>
                    <el-button slot="reference" type="text">
                      {{ $t('273931a4.0ec9ea') }}<i class="el-icon-d-arrow-right" />
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
            :title="$t('273931a4.ad9f9a', { orderId: remarkForm.orderId })"
            :form="remarkForm"
            :form-list="remarkFormList"
            @onSubmit="onRemarkSubmit"
          />

          <!-- 取消订单 -->
          <SpDialog
            ref="cancelOrderDialogRef"
            v-model="cancelOrderDialog"
            :title="$t('273931a4.20d620', { orderId: cancelOrderForm.order_id })"
            :form="cancelOrderForm"
            :form-list="cancelOrderFormList"
            @onSubmit="onCancelOrderSubmit"
          />

          <!-- 发货 -->
          <SpDialog
            ref="deliverGoodsDialogRef"
            v-model="deliverGoodsDialog"
            width="1000px"
            :title="$t('273931a4.ff1901', { orderId: deliverGoodsForm.order_id })"
            :form="deliverGoodsForm"
            :form-list="deliverGoodsFormList"
            @onSubmit="deliverGoodsSubmit"
          />

          <!-- 核销 -->
          <SpDialog
            ref="writeOffDialogRef"
            v-model="writeOffDialog"
            :title="$t('273931a4.f309ed', { orderId: writeOffForm.order_id })"
            :form="writeOffForm"
            :form-list="writeOffFormList"
            @onSubmit="writeOffSubmit"
          />

          <!-- 退款审核 -->
          <SpDialog
            ref="refundRef"
            v-model="refundDialog"
            :title="$t('273931a4.eaf4b8', { orderId: refundForm.order_id })"
            :form="refundForm"
            :form-list="refundFormList"
            @onSubmit="refundSubmit"
          />
        </div>
      </div>
    </SpRouterView>
  </SpPage>
</template>
<script>
import { mapGetters } from 'vuex'
import mixin from '@/mixins'
import { pageMixin } from '@/mixins'
import { VERSION_STANDARD, isArray, VERSION_B2C, VERSION_IN_PURCHASE } from '@/utils'
import { exportInvoice, orderExport } from '@/api/trade'
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
        order_class: 'community', // 订单类型
        is_invoiced: '', // 开票状态
        time_start_begin: '', //
        time_start_end: '',
        distributor_type: '', // 订单分类
        distributor_id: '', // 店铺
        subDistrict: []
      },
      datapass_block: 1, // 是否为数据脱敏
      subDistrictList: [],
      distributionType: DISTRIBUTION_TYPE,
      orderStatus: VERSION_B2C()
        ? ORDER_B2C_STATUS
        : VERSION_IN_PURCHASE()
        ? IN_PURCHASE_STATUS
        : ORDER_STATUS,
      invoiceStatus: INVOICE_STATUS,
      orderCategory: ORDER_CATEGORY,
      pickerOptions: PICKER_DATE_OPTIONS,
      orderSourceList: [],
      remarkDialog: false,
      remarkFormList: [
        {
          label: this.$t('273931a4.b57447'),
          key: 'remark',
          type: 'textarea',
          maxlength: 150,
          placeholder: this.$t('273931a4.bd36b6'),
          required: true,
          message: this.$t('273931a4.281bad')
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
          label: this.$t('273931a4.4a3df6'),
          key: 'cancel_reason',
          placeholder: this.$t('273931a4.bc4a11'),
          type: 'select',
          options: [
            { title: this.$t('273931a4.8f038a'), value: 1 },
            { title: this.$t('273931a4.5e58ba'), value: 2 },
            { title: this.$t('273931a4.151111'), value: 3 },
            { title: this.$t('273931a4.baa450'), value: 4 },
            { title: this.$t('273931a4.3013ee'), value: 5 },
            { title: this.$t('273931a4.e7197e'), value: 6 },
            { title: this.$t('273931a4.74c00b'), value: 7 },
            { title: this.$t('273931a4.16264a'), value: 8 },
            { title: this.$t('273931a4.13bea0'), value: 9 },
            { title: this.$t('273931a4.0e6c86'), value: 10 },
            { title: this.$t('273931a4.e21052'), value: 11 },
            { title: this.$t('273931a4.94490e'), value: 12 }
          ],
          required: true,
          message: this.$t('273931a4.281bad'),
          onChange: (e) => {
            if (e == 12) {
              this.cancelOrderFormList[1].isShow = true
            } else {
              this.cancelOrderFormList[1].isShow = false
            }
          }
        },
        {
          label: this.$t('273931a4.fba26e'),
          key: 'other_reason',
          type: 'input',
          placeholder: this.$t('273931a4.c6af7d'),
          isShow: false,
          validator: (rule, value, callback) => {
            if (this.cancelOrderForm.cancel_reason == 12 && !value) {
              callback(new Error(this.$t('273931a4.281bad')))
            } else {
              callback()
            }
          }
        }
      ],
      cancelOrderForm: {
        order_id: '',
        cancel_reason: '',
        other_reason: ''
      },
      deliverGoodsDialog: false,
      deliverGoodsFormList: [
        {
          label: this.$t('273931a4.b01994'),
          key: 'delivery_type',
          type: 'radio',
          disabled: false,
          options: [
            { label: 'batch', name: this.$t('273931a4.afb426') },
            { label: 'sep', name: this.$t('273931a4.95d243') }
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
            { title: this.$t('273931a4.de5472'), key: 'item_name' },
            { title: this.$t('273931a4.0bf60b'), key: 'num', width: 60 },
            { title: this.$t('273931a4.745165'), key: 'delivery_item_num', width: 100 },
            { title: this.$t('273931a4.e95382'), key: 'price', width: 120 },
            {
              title: this.$t('273931a4.4f5a46'),
              key: 'item_num',
              width: 160,
              render: (row, column, cell) => {
                if (row.num - row.delivery_item_num == 0) {
                  return this.$t('273931a4.fad522')
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
          label: this.$t('273931a4.f3af96'),
          key: 'delivery_corp',
          placeholder: this.$t('273931a4.8367e8'),
          type: 'select',
          options: [],
          required: true,
          message: this.$t('273931a4.281bad')
        },
        {
          label: this.$t('273931a4.0bb075'),
          key: 'delivery_code',
          type: 'input',
          placeholder: this.$t('273931a4.0e9f1e'),
          required: true,
          message: this.$t('273931a4.281bad')
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
            { title: this.$t('273931a4.de5472'), key: 'item_name' },
            { title: this.$t('273931a4.0bf60b'), key: 'num', width: 60 },
            { title: this.$t('273931a4.745165'), key: 'delivery_item_num', width: 100 },
            { title: this.$t('273931a4.e95382'), key: 'price', width: 120 }
          ]
        },
        {
          label: this.$t('273931a4.d0edc9'),
          key: 'pickupcode',
          type: 'input',
          placeholder: this.$t('273931a4.ba231e'),
          // required: true,
          message: this.$t('273931a4.281bad'),
          isShow: () => {
            return this.params.order_class != 'community'
          }
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
          label: this.$t('273931a4.60d99e'),
          key: 'source',
          type: 'text'
        },
        {
          label: this.$t('273931a4.5ba072'),
          key: 'applyTime',
          type: 'text'
        },
        {
          label: this.$t('273931a4.db7c80'),
          key: 'refundStatus',
          type: 'text'
        },
        {
          label: this.$t('273931a4.93b365'),
          key: 'process',
          type: 'text'
        },
        {
          label: this.$t('273931a4.a0cd4c'),
          key: 'refundPrice',
          type: 'text'
        },
        {
          label: this.$t('273931a4.0c9d2b'),
          key: 'payType',
          type: 'text'
        },
        {
          label: this.$t('273931a4.4a3df6'),
          key: 'reason',
          type: 'text'
        },
        {
          label: this.$t('273931a4.9eb71d'),
          key: 'check_cancel',
          type: 'radio',
          options: [
            { label: '0', name: this.$t('273931a4.1bf19c') },
            { label: '1', name: this.$t('273931a4.e61f2c') }
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
          label: this.$t('273931a4.f48f94'),
          key: 'shop_reject_reason',
          type: 'input',
          placeholder: this.$t('273931a4.fc955a'),
          isShow: false,
          validator: (rule, value, callback) => {
            if (this.refundForm.check_cancel == '0' && !value) {
              callback(new Error(this.$t('273931a4.281bad')))
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
      origin: ''
    }
  },
  computed: {
    ...mapGetters(['login_type', 'isMicorMall']),
    orderType() {
      return [{ title: this.$t('273931a4.991e15'), value: 'community' }]
    }
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
  },
  methods: {
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

      const { list, pager, datapass_block } = await this.$api.community.getCommunityOrderList(
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
          ziti_status,
          dada,
          delivery_status,
          pay_status
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
              actionBtns.push({ nameKey: '6648bb92.b21b5e', key: 'cancel' })
            }
          }

          if (order_status == 'PAYED' && receipt_type == 'ziti' && ziti_status == 'PENDING') {
            actionBtns.push({ nameKey: '6648bb92.e7d31e', key: 'writeOff' })
          }

          if (
            isDada &&
            ['NO_APPLY_CANCEL', 'FAILS'].includes(cancel_status) &&
            order_status == 'PAYED' &&
            delivery_status != 'DONE' &&
            dada.dada_status == '0'
          ) {
            actionBtns.push({ nameKey: '6648bb92.7d4577', key: 'takeOrder' })
          }

          if (isDada && pay_status == 'PAYED' && dada.dada_status == '9') {
            actionBtns.push({ nameKey: '6648bb92.f1557d', key: 'orderSendBack' })
          }

          if (
            (isLogistics || is_logistics) &&
            !isDada &&
            order_status == 'PAYED' &&
            delivery_status != 'DONE' &&
            receipt_type != 'ziti'
          ) {
            actionBtns.push({ nameKey: '6648bb92.045315', key: 'deliverGoods' })
          }

          if (cancel_status == 'WAIT_PROCESS' && order_status == 'PAYED') {
            actionBtns.push({ nameKey: '6648bb92.44c198', key: 'refund' })
          }

          if (is_invoiced == '0' && invoice) {
            actionBtns.push({ nameKey: '6648bb92.963609', key: 'waitInvoice' })
          }

          actionBtns.push({ nameKey: '6648bb92.2432b5', key: 'remark' })
        }
        return {
          ...item,
          actionBtns
        }
      })
      this.page.total = pager ? pager.count : 0
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
        return type == '1' ? this.$t('273931a4.443aa4') : this.$t('273931a4.e7978e')
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
      { order_id, distributor_remark, items, delivery_type, delivery_status },
      { key }
    ) {
      if (key == 'remark') {
        this.$refs['remarkDialogRef'].resetForm()
        this.remarkForm.orderId = order_id
        this.remarkForm.remark = distributor_remark
        this.remarkDialog = true
      } else if (key == 'cancel') {
        this.$refs['cancelOrderDialogRef'].resetForm()
        this.cancelOrderForm.order_id = order_id
        this.cancelOrderDialog = true
      } else if (key == 'deliverGoods') {
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
        this.$confirm(this.$t('273931a4.f3e80d'), this.$t('273931a4.c1b226'), {
          confirmButtonText: this.$t('273931a4.38cf16'),
          cancelButtonText: this.$t('273931a4.625fb2'),
          type: 'warning'
        }).then(async () => {
          await this.$api.trade.doBusinessReceipt(order_id)
          this.$message.success(this.$t('273931a4.740ca1'))
        })
      } else if (key == 'orderSendBack') {
        this.$confirm(this.$t('273931a4.f1557d'), this.$t('273931a4.df2e45'), {
          confirmButtonText: this.$t('273931a4.38cf16'),
          cancelButtonText: this.$t('273931a4.625fb2'),
          type: 'warning'
        }).then(async () => {
          await this.$api.trade.confirmBack(order_id)
          this.$message.success(this.$t('273931a4.2ab3ab'))
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
          pay_channel,
          pay_type,
          cancel_reason
        } = await this.$api.trade.getCancelOrderInfo(order_id, { order_type: 'normal' })
        this.refundForm = {
          ...this.refundForm,
          order_id,
          source: cancel_from == 'buyer' ? this.$t('d41d8cd9.h0i1j2') : this.$t('d41d8cd9.k3l4m5'),
          applyTime: moment(create_time * 1000).format('YYYY-MM-DD HH:mm:ss'),
          refundStatus: REFUND_STATUS[refund_status],
          process: REFUND_PROCESS[progress],
          refundPrice: `${fee_symbol}${total_fee / 100}`,
          payType: pay_channel ? PAY_TYPE[pay_channel] : PAY_TYPE[pay_type],
          reason: cancel_reason
        }
      } else if (key == 'waitInvoice') {
        this.$confirm(this.$t('d41d8cd9.n6o7p8'), this.$t('d41d8cd9.q9r0s1'), {
          cancelButtonText: this.$t('d41d8cd9.t2u3v4'),
          confirmButtonText: this.$t('d41d8cd9.w5x6y7'),
          type: 'warning'
        }).then(async () => {
          const { success } = await this.$api.trade.isInvoiced({
            order_id: order_id,
            status: 1
          })
          this.fetchList()
          if (success) {
            this.$message.success(this.$t('d41d8cd9.z8a9b0'))
          } else {
            this.$message.error(this.$t('d41d8cd9.c1d2e3'))
          }
        })
      }
    },
    async onRemarkSubmit() {
      await this.$api.order.remarks(this.remarkForm)
      this.$message.success(this.$t('d41d8cd9.f4g5h6'))
      this.remarkDialog = false
      this.fetchList()
    },
    async onCancelOrderSubmit() {
      const { order_id } = this.cancelOrderForm
      console.log(this.cancelOrderForm)
      await this.$api.trade.cancelOrderConfirm(order_id, this.cancelOrderForm)
      this.$message.success(this.$t('d41d8cd9.i7j8k9'))
      this.cancelOrderDialog = false
      this.fetchList()
    },
    async deliverGoodsSubmit() {
      console.log('kkkkk11111')
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
        this.$message.success(this.$t('d41d8cd9.l0m1n2'))
      } else {
        this.$message.error(this.$t('d41d8cd9.o3p4q5'))
      }
    },
    async writeOffSubmit() {
      const { order_id } = this.writeOffForm
      const { ziti_status } = await this.$api.trade.doWriteoff(order_id, this.writeOffForm)
      if (ziti_status == 'DONE') {
        this.$message.success(this.$t('d41d8cd9.r6s7t8'))
      } else {
        this.$message.error(this.$t('d41d8cd9.u9v0w1'))
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
        this.$message.success(this.$t('d41d8cd9.x2y3z4'))
      } else if (refund_status == 'SHOP_CHECK_FAILS') {
        this.$message.success(this.$t('d41d8cd9.a5b6c7'))
      } else {
        this.$message.error(this.$t('d41d8cd9.d8e9f0'))
      }
      this.refundDialog = false
    },
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
          this.$message.success(this.$t('d41d8cd9.g1h2i3'))
          this.$export_open('invoice')
          return
        } else if (url) {
          window.open(url)
        } else {
          this.$message.error(this.$t('d41d8cd9.j4k5l6'))
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
          this.$message.success(this.$t('d41d8cd9.g1h2i3'))
          this.$export_open(type)
          return
        } else if (url) {
          window.open(url)
        } else {
          this.$message.error(this.$t('d41d8cd9.j4k5l6'))
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
      this.$message.success(this.$t('d41d8cd9.m7n8o9'))
      this.fetchList()
    },
    async uploadHandlePatchCancel(file) {
      const params = {
        isUploadFile: true,
        file_type: 'normal_orders_cancel',
        file: file.raw
      }
      await this.$api.common.handleUploadFile(params)
      this.$message.success(this.$t('d41d8cd9.m7n8o9'))
      this.fetchList()
    }
  }
}
</script>
<style lang="scss" scope>
.sp-filter-form {
  margin-bottom: 16px;
}
</style>
