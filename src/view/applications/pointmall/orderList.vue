<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <div class="">
      <div v-if="$route.path.indexOf('detail') === -1">
        <el-row class="filter-header" :gutter="20">
          <!-- <shop-select v-if="$store.getters.login_type != 'distributor'" distributors  @update="storeSearch"></shop-select> -->
          <el-date-picker
            v-model="create_time"
            type="daterange"
            :start-placeholder="$t('829ad9f2.b44c0f')"
            range-separator="-"
            :end-placeholder="$t('829ad9f2.1d468b')"
            value-format="yyyy/MM/dd"
            :placeholder="$t('829ad9f2.4b8cb9')"
            @change="dateChange"
          />
          <!-- <el-select v-model="order_class" @change="TypeHandle" placeholder="请选择订单类型">
            <el-option
              v-for="(item, index) in order_class_array"
              :key="index"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select> -->
          <!-- <el-autocomplete
            class="inline-input"
            v-model="source_name"
            :fetch-suggestions="querySearch"
            placeholder="请输入来源"
            @select="sourceSearch">
          </el-autocomplete> -->
          <!-- <el-input class="input-m" placeholder="导购员手机号" v-model="salesman_mobile">
            <el-button slot="append" icon="el-icon-search" @click="numberSearch"></el-button>
          </el-input> -->
          <el-col :span="8">
            <el-input v-model="identifier" class="input-m" :placeholder="$t('829ad9f2.f4b2e7')">
              <el-button slot="append" icon="el-icon-search" @click="numberSearch" />
            </el-input>
          </el-col>
          <el-select
            v-model="invoice_status"
            :placeholder="$t('829ad9f2.2af9f7')"
            @change="invoiceStatusChange"
            clearable
          >
            <el-option
              v-for="item in open_status_arr"
              :key="item.value"
              :label="$t(item.i18nKey)"
              :value="item.value"
            />
          </el-select>
        </el-row>
        <el-row>
          <el-col>
            <el-button-group>
              <el-button type="primary" @click="exportData('normal_master_order')">
                {{ $t('829ad9f2.538414') }}
              </el-button>
              <el-button type="primary" @click="exportData('normal_order')">
                {{ $t('829ad9f2.82b914') }}
              </el-button>
            </el-button-group>
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              :content="$t('829ad9f2.676480')"
            >
              <i slot="reference" class="el-icon-question" />
            </el-popover>
            <!-- <el-upload action="" style="display: inline; margin-left: 20px;" :on-change="uploadHandleChange" :auto-upload="false" :show-file-list="false" >
            <el-button type="primary" icon="el-icon-box" plain>批量发货</el-button>
          </el-upload> -->
          </el-col>
        </el-row>
        <el-dialog
          :title="$t('829ad9f2.2cf869')"
          :visible.sync="downloadView"
          :close-on-click-modal="false"
        >
          <template v-if="downloadUrl">
            <a :href="downloadUrl" download>{{ downloadName }}</a>
          </template>
        </el-dialog>

        <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
          <el-tab-pane :label="$t('829ad9f2.a8b0c2')" name="all" />
          <el-tab-pane :label="$t('829ad9f2.d8476e')" name="notship" />
          <el-tab-pane :label="$t('829ad9f2.6b715b')" name="cancelapply" />
          <el-tab-pane :label="$t('829ad9f2.4933ca')" name="shipping" />
          <!-- <el-tab-pane label="待自提" name="ziti"></el-tab-pane> -->
          <el-tab-pane :label="$t('829ad9f2.608afd')" name="notpay" />
          <el-tab-pane :label="$t('829ad9f2.3e6db1')" name="cancel" />
          <el-tab-pane :label="$t('829ad9f2.fad522')" name="finish" />
          <!-- <el-tab-pane label="已完成未开票" name="done_noinvoice"></el-tab-pane>
          <el-tab-pane label="已完成已开票" name="done_invoice"></el-tab-pane> -->
          <el-table v-loading="loading" :data="list" :element-loading-text="$t('829ad9f2.f09b12')">
            <el-table-column width="280" prop="order_id" :label="$t('829ad9f2.a6d10d')">
              <template slot-scope="scope">
                <div class="order-num">
                  {{ scope.row.order_id }}
                  <el-tooltip effect="dark" :content="$t('829ad9f2.79d3ab')" placement="top-start">
                    <i
                      v-clipboard:copy="scope.row.order_id"
                      v-clipboard:success="onCopy"
                      class="el-icon-document-copy"
                    />
                  </el-tooltip>
                </div>
                <div v-if="scope.row.distributor_name" class="order-store">
                  <el-tooltip effect="dark" :content="$t('829ad9f2.8a0cc2')" placement="top-start">
                    <i class="el-icon-office-building" />
                  </el-tooltip>
                  {{ scope.row.distributor_name }}
                </div>
                <div class="order-time">
                  <el-tooltip effect="dark" :content="$t('829ad9f2.2240cc')" placement="top-start">
                    <i class="el-icon-time" />
                  </el-tooltip>
                  {{ scope.row.create_time | datetime('YYYY-MM-DD HH:mm:ss') }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="80" :label="$t('829ad9f2.9a935b')">
              <template slot-scope="scope">
                <span v-if="scope.row.freight_type == 'cash'"
                  ><span class="cur">{{ scope.row.fee_symbol }}</span
                  >{{ scope.row.freight_fee / 100 }}</span
                >
                <span v-else>{{ scope.row.freight_fee }}{{ $t('829ad9f2.9f68a8') }}</span>
              </template>
            </el-table-column>
            <!--
          <el-table-column width="70" label="商品金额">
            <template slot-scope="scope">
              {{scope.row.fee_symbol}}{{scope.row.item_fee / 100}}
            </template>
          </el-table-column>
          -->
            <!-- <el-table-column prop="total_fee" width="100" label="订单金额">
            <template slot-scope="scope">
              <span class="cur">{{scope.row.fee_symbol}}</span>{{scope.row.total_fee / 100}}
            </template>
          </el-table-column> -->
            <el-table-column prop="point" width="200" :label="$t('829ad9f2.9cf4c6')">
              <template slot-scope="scope">
                {{ scope.row.item_point }}{{ $t('829ad9f2.9f68a8') }}
                <span v-if="scope.row.item_fee > 0"
                  >+<span class="cur">{{ scope.row.fee_symbol }}</span
                  >{{ scope.row.item_fee / 100 }}</span
                >
              </template>
            </el-table-column>
            <el-table-column prop="mobile" width="160" :label="$t('829ad9f2.057157')">
              <template slot-scope="scope">
                <i class="el-icon-mobile" />
                {{ scope.row.mobile }}
                <el-tooltip
                  v-if="datapass_block == 0"
                  effect="dark"
                  :content="$t('829ad9f2.79d3ab')"
                  placement="top-start"
                >
                  <i
                    v-clipboard:copy="scope.row.mobile"
                    v-clipboard:success="onCopy"
                    class="el-icon-document-copy"
                  />
                </el-tooltip>
              </template>
            </el-table-column>
            <!-- <el-table-column width="90" label="类型">
            <template slot-scope="scope">
              <span v-if="scope.row.order_class=='normal'">
                <span v-if="scope.row.type=='1'">跨境订单</span>
                <span v-else>普通订单</span>
              </span>
              <span v-if="scope.row.order_class=='groups'">团购订单</span>
              <span v-if="scope.row.order_class=='seckill'">秒杀订单</span>
              <span v-if="scope.row.order_class=='community'">社区订单</span>
              <span v-if="scope.row.order_class=='shopguide'">导购订单</span>
              <span v-if="scope.row.order_class=='bargain'">助力订单</span>
            </template>
          </el-table-column> -->
            <!--
          <el-table-column prop="is_distribution" label="是否分销">
            <template slot-scope="scope">
              <span v-if="scope.row.is_distribution == 1"> 是 </span>
              <span v-else> - </span>
            </template>
          </el-table-column>
          -->
            <el-table-column
              v-if="activeName == 'all'"
              width="120"
              prop="order_status"
              :label="$t('829ad9f2.3fea7c')"
            >
              <template slot-scope="scope">
                <!-- 订单状态 -->
                <span v-if="scope.row.order_status == 'PAYED'">{{ $t('829ad9f2.8d02a5') }}</span>
                <span v-if="scope.row.order_status == 'NOTPAY'">{{ $t('829ad9f2.608afd') }}</span>
                <span v-if="scope.row.order_status_des == 'CANCEL'">{{
                  $t('829ad9f2.2111cc')
                }}</span>
                <span v-if="scope.row.order_status_des == 'CLOSED'">{{
                  scope.row.order_status_msg
                }}</span>
                <span v-if="scope.row.order_status == 'WAIT_BUYER_CONFIRM'">{{
                  $t('829ad9f2.4933ca')
                }}</span>
                <span v-if="scope.row.order_status == 'REFUND_SUCCESS'">{{
                  $t('829ad9f2.e85018')
                }}</span>
                <span v-if="scope.row.order_status == 'WAIT_GROUPS_SUCCESS'">{{
                  $t('829ad9f2.425a40')
                }}</span>
                <span v-if="scope.row.order_status == 'PART_PAYMENT'">{{
                  $t('829ad9f2.38b508')
                }}</span>
                <span v-if="scope.row.order_status == 'DONE'">{{ $t('829ad9f2.fad522') }}</span>
                <template
                  v-if="
                    scope.row.order_status != 'CANCEL' &&
                    scope.row.order_status != 'REFUND_SUCCESS' &&
                    scope.row.order_status != 'WAIT_GROUPS_SUCCESS'
                  "
                >
                  <!-- 发货状态 -->
                  <span v-if="scope.row.cancel_status == 'WAIT_PROCESS'">{{
                    $t('829ad9f2.57a640')
                  }}</span>
                  <span v-if="scope.row.delivery_status == 'PARTAIL'">{{
                    $t('829ad9f2.5296ac')
                  }}</span>
                  <span
                    v-if="scope.row.receipt_type == 'ziti' && scope.row.ziti_status == 'PENDING'"
                    >{{ $t('829ad9f2.25d532') }}</span
                  >
                  <span
                    v-if="
                      scope.row.receipt_type == 'logistics' &&
                      scope.row.delivery_status == 'PENDING' &&
                      scope.row.order_status !== 'PART_PAYMENT'
                    "
                    >{{ $t('829ad9f2.d8476e') }}</span
                  >
                </template>
              </template>
            </el-table-column>
            <el-table-column prop="invoice_status" :label="$t('829ad9f2.2af9f7')">
              <template slot-scope="scope">
                <span v-if="scope.row.invoice_status === 'success'" style="color: green">
                  {{ invoiceStatusText(scope.row.invoice_status) }}
                </span>
                <span v-else-if="scope.row.invoice_status === 'failed'" style="color: red">
                  {{ invoiceStatusText(scope.row.invoice_status) }}
                </span>
                <span v-else> {{ invoiceStatusText(scope.row.invoice_status) }} </span>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="source_name" label="来源"></el-table-column>
          <el-table-column width="120" label="海关审批状态">
            <template slot-scope="scope">
              <template v-if="scope.row.type == 1">
                <span v-if="scope.row.audit_status == 'approved'">审核通过</span>
                <span v-if="scope.row.audit_status == 'processing'">审核中</span>
                <span v-if="scope.row.audit_status == 'rejected'">审核失败</span>
              </template>
              <template v-else>-</template>
            </template>
          </el-table-column> -->
            <el-table-column width="200" :label="$t('829ad9f2.2b6bc0')">
              <template slot-scope="scope">
                <el-button type="text">
                  <router-link
                    :to="{
                      path: matchRoutePath('detail'),
                      query: { orderId: scope.row.order_id, resource: $route.path }
                    }"
                  >
                    {{ $t('829ad9f2.f26225') }}
                  </router-link>
                </el-button>
                <el-button
                  v-if="
                    (VERSION_STANDARD() || is_distributor || scope.row.distributor_id == 0) &&
                    scope.row.cancel_status == 'NO_APPLY_CANCEL' &&
                    (scope.row.order_status == 'NOTPAY' || scope.row.order_status == 'PAYED')
                  "
                  type="text"
                  @click="cancelOrderAction(scope.row.order_id)"
                >
                  {{ $t('829ad9f2.b21b5e') }}
                </el-button>
                <el-button
                  v-if="
                    (VERSION_STANDARD() || is_distributor || scope.row.distributor_id == 0) &&
                    scope.row.order_status == 'PAYED' &&
                    scope.row.receipt_type == 'ziti' &&
                    scope.row.ziti_status == 'PENDING'
                  "
                  type="text"
                  @click="writeoffOrderAction(scope.row.order_id)"
                >
                  {{ $t('829ad9f2.e7d31e') }}
                </el-button>
                <template
                  v-if="
                    !IsBind &&
                    (VERSION_STANDARD() || is_distributor || scope.row.distributor_id == 0)
                  "
                >
                  <el-button
                    v-if="
                      scope.row.receipt_type == 'logistics' &&
                      scope.row.order_status == 'PAYED' &&
                      scope.row.delivery_status != 'DONE' &&
                      !jstErpSetting?.is_open
                    "
                    type="text"
                    @click="deliveryAction(scope.row)"
                  >
                    {{ $t('829ad9f2.045315') }}
                  </el-button>
                  <el-button
                    v-if="
                      scope.row.cancel_status == 'WAIT_PROCESS' && scope.row.order_status == 'PAYED'
                    "
                    type="text"
                    @click="confirmCancelOrderAction(scope.row.order_id)"
                  >
                    {{ $t('829ad9f2.44c198') }}
                  </el-button>
                </template>
                <el-button
                  v-if="scope.row.is_invoiced == '1' && scope.row.invoice"
                  type="text"
                  @click="IsInvoiced(scope.row, 0)"
                >
                  {{ $t('829ad9f2.963609') }}
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
        <!-- 发货-开始 -->
        <el-dialog
          :title="deliveryTitle"
          :visible.sync="deliveryVisible"
          :before-close="handleCancel"
          width="65%"
        >
          <template>
            <el-form
              ref="deliveryForm"
              :model="deliveryForm"
              class="demo-ruleForm"
              label-width="100px"
            >
              <el-form-item :label="$t('829ad9f2.1e8dc2')">
                <el-col :span="20">
                  {{ deliveryData.orderInfo.order_id }}
                </el-col>
              </el-form-item>
              <el-form-item :label="$t('829ad9f2.b01994')">
                <el-radio-group v-model="deliveryForm.delivery_type" :disabled="IsDisabled">
                  <el-radio label="batch">{{ $t('829ad9f2.afb426') }}</el-radio>
                  <el-radio label="sep">{{ $t('829ad9f2.95d243') }}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="$t('829ad9f2.b433e6')">
                <el-col :span="30">
                  <el-table :data="deliveryData.orderInfo.items">
                    <el-table-column prop="item_name" :label="$t('829ad9f2.de5472')" width="180" />
                    <el-table-column prop="num" :label="$t('829ad9f2.0bf60b')" width="180" />
                    <el-table-column :label="$t('829ad9f2.4df53f')">
                      <template slot-scope="scope">
                        <span>{{ scope.row.item_point }}{{ $t('829ad9f2.9f68a8') }}</span>
                        <span v-if="scope.row.item_fee > 0"
                          >+{{ scope.row.fee_symbol }}{{ scope.row.item_fee / 100 }}</span
                        >
                      </template>
                    </el-table-column>
                    <template v-if="deliveryForm.delivery_type == 'sep'">
                      <el-table-column :label="$t('829ad9f2.f3af96')" width="200">
                        <template slot-scope="scope">
                          <el-select
                            v-model="scope.row.delivery_corp"
                            filterable
                            :placeholder="$t('829ad9f2.32e586')"
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
                      <el-table-column :label="$t('829ad9f2.0bb075')" width="200">
                        <template slot-scope="scope">
                          <el-input
                            v-model="scope.row.delivery_code"
                            :maxlength="20"
                            :placeholder="$t('829ad9f2.0e9f1e')"
                          />
                        </template>
                      </el-table-column>
                    </template>
                  </el-table>
                </el-col>
              </el-form-item>
              <template v-if="deliveryForm.delivery_type == 'batch'">
                <el-form-item :label="$t('829ad9f2.f3af96')">
                  <el-col>
                    <el-select
                      v-model="deliveryForm.delivery_corp"
                      filterable
                      :placeholder="$t('829ad9f2.32e586')"
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
                <el-form-item :label="$t('829ad9f2.0bb075')">
                  <el-col :span="14">
                    <el-input
                      v-model="deliveryForm.delivery_code"
                      :maxlength="20"
                      :placeholder="$t('829ad9f2.0e9f1e')"
                    />
                  </el-col>
                </el-form-item>
              </template>
            </el-form>
          </template>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="handleCancel">{{ $t('829ad9f2.625fb2') }}</el-button>
            <el-button type="primary" @click="submitDeliveryAction">
              {{ $t('829ad9f2.38cf16') }}
            </el-button>
          </div>
        </el-dialog>
        <el-dialog
          :title="deliveryTitle"
          :visible.sync="deliveryVisibleNew"
          :before-close="handleCancel"
          width="65%"
        >
          <template>
            <el-form
              ref="deliveryForm"
              :model="deliveryForm"
              class="demo-ruleForm"
              label-width="100px"
            >
              <el-form-item :label="$t('829ad9f2.1e8dc2')">
                <el-col :span="20">
                  {{ deliveryData.orderInfo.order_id }}
                </el-col>
              </el-form-item>
              <el-form-item :label="$t('829ad9f2.b01994')">
                <el-radio-group v-model="deliveryForm.delivery_type" :disabled="IsDisabled">
                  <el-radio label="batch">{{ $t('829ad9f2.afb426') }}</el-radio>
                  <el-radio label="sep">{{ $t('829ad9f2.95d243') }}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="$t('829ad9f2.b433e6')">
                <el-table :data="deliveryData.orderInfo.items">
                  <el-table-column prop="item_name" :label="$t('829ad9f2.de5472')" width="180" />
                  <el-table-column prop="num" :label="$t('829ad9f2.0bf60b')" width="180" />
                  <el-table-column
                    prop="delivery_item_num"
                    :label="$t('829ad9f2.745165')"
                    width="180"
                  />

                  <el-table-column :label="$t('829ad9f2.fadbf7')">
                    <template slot-scope="scope">
                      <span>{{ scope.row.item_point }}{{ $t('829ad9f2.9f68a8') }}</span>
                      <span v-if="scope.row.item_fee > 0"
                        >+{{ scope.row.fee_symbol }}{{ scope.row.item_fee / 100 }}</span
                      >
                    </template>
                  </el-table-column>
                  <template v-if="deliveryForm.delivery_type == 'sep'">
                    <el-table-column :label="$t('829ad9f2.4f5a46')" width="200">
                      <template slot-scope="scope">
                        <el-input-number
                          v-if="scope.row.num - scope.row.delivery_item_num != 0"
                          v-model="scope.row.delivery_num"
                          :placeholder="$t('829ad9f2.4f5a46')"
                          controls-position="right"
                          :min="0"
                          :max="scope.row.num - scope.row.delivery_item_num"
                        />
                        <!-- <el-input v-model="scope.row.delivery_num" :maxlength=20 placeholder="发货数量"></el-input> -->
                        <span v-if="scope.row.num - scope.row.delivery_item_num == 0">{{
                          $t('829ad9f2.82446c')
                        }}</span>
                      </template>
                    </el-table-column>
                  </template>
                </el-table>
              </el-form-item>

              <el-form-item :label="$t('829ad9f2.f3af96')">
                <el-col>
                  <el-select
                    v-model="deliveryForm.delivery_corp"
                    filterable
                    :placeholder="$t('829ad9f2.32e586')"
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
              <el-form-item :label="$t('829ad9f2.0bb075')">
                <el-col :span="14">
                  <el-input
                    v-model="deliveryForm.delivery_code"
                    :maxlength="20"
                    :placeholder="$t('829ad9f2.0e9f1e')"
                  />
                </el-col>
              </el-form-item>
            </el-form>
          </template>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="handleCancel">{{ $t('829ad9f2.625fb2') }}</el-button>
            <el-button type="primary" @click="submitDeliveryAction">
              {{ $t('829ad9f2.38cf16') }}
            </el-button>
          </div>
        </el-dialog>

        <!-- 取消订单退款审核-开始 -->
        <el-dialog
          :title="$t('829ad9f2.763eea')"
          :visible.sync="cancelVisible"
          :before-close="handleCancelOrderCancel"
          width="57%"
        >
          <template>
            <el-row :gutter="100">
              <el-col :span="24">
                <span class="grid-content"
                  >{{ $t('829ad9f2.070dce') }}{{ cancelData.order_id }}</span
                >
              </el-col>
              <el-col :span="24">
                <span v-if="cancelData.cancel_from == 'buyer'">{{ $t('829ad9f2.497ac9') }}</span>
                <span v-else>{{ $t('829ad9f2.f01ac7') }}</span>
              </el-col>
              <el-col :span="24">
                <span
                  >{{ $t('829ad9f2.796c1b')
                  }}{{ cancelData.create_time | datetime('YYYY-MM-DD HH:mm:ss') }}</span
                >
              </el-col>
              <el-col :span="24">
                <span>{{ $t('829ad9f2.a2f94f') }}</span>
                <span v-if="cancelData.refund_status == 'WAIT_CHECK'">{{
                  $t('829ad9f2.5cb424')
                }}</span>
                <span v-if="cancelData.refund_status == 'FAILS'">{{ $t('829ad9f2.7c2544') }}</span>
                <span v-if="cancelData.refund_status == 'SUCCESS'">{{
                  $t('829ad9f2.d58cbd')
                }}</span>
                <span v-if="cancelData.refund_status == 'SHOP_CHECK_FAILS'">{{
                  $t('829ad9f2.0e14e3')
                }}</span>
                <span v-if="cancelData.refund_status == 'WAIT_REFUND'">{{
                  $t('829ad9f2.12e196')
                }}</span>
              </el-col>
              <el-col :span="24">
                <span>{{ $t('829ad9f2.7f1328') }}</span>
                <span v-if="cancelData.progress == '0'">{{ $t('829ad9f2.047109') }}</span>
                <span v-if="cancelData.progress == '1'">{{ $t('829ad9f2.2111cc') }}</span>
                <span v-if="cancelData.progress == '2'">{{ $t('829ad9f2.07e608') }}</span>
                <span v-if="cancelData.progress == '3'">{{ $t('829ad9f2.fad522') }}</span>
              </el-col>
              <el-col :span="24">
                <span
                  >{{ $t('829ad9f2.27a09b') }}{{ cancelData.point
                  }}{{ $t('829ad9f2.9f68a8') }}</span
                >
              </el-col>
              <el-col :span="24">
                <span
                  >{{ $t('829ad9f2.b772c7') }}{{ cancelData.fee_symbol
                  }}{{ cancelData.total_fee / 100 }}</span
                >
              </el-col>
              <el-col :span="24">
                <span v-if="cancelData.pay_type == 'wxpay'">{{ $t('829ad9f2.f5041a') }}</span>
              </el-col>
              <el-col :span="24">
                <span>{{ $t('829ad9f2.27910a') }}{{ cancelData.cancel_reason }}</span>
              </el-col>
            </el-row>
            <el-divider />
            <el-form ref="cancelForm" :model="cancelForm" class="" label-width="100px">
              <el-form-item :label="$t('829ad9f2.de455e')">
                <el-row>
                  <el-col :span="20">
                    <template>
                      <el-radio v-model="cancelForm.check_cancel" label="0">
                        {{ $t('829ad9f2.1bf19c') }}
                      </el-radio>
                      <el-radio v-model="cancelForm.check_cancel" label="1">
                        {{ $t('829ad9f2.e61f2c') }}
                      </el-radio>
                    </template>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item v-if="cancelForm.check_cancel == '0'" :label="$t('829ad9f2.de77c5')">
                <el-row>
                  <el-col :span="24">
                    <el-input
                      v-model="cancelForm.shop_reject_reason"
                      type="textarea"
                      :rows="3"
                      :placeholder="$t('829ad9f2.fc955a')"
                    />
                  </el-col>
                </el-row>
              </el-form-item>
            </el-form>
          </template>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="handleCancelOrderCancel">
              {{ $t('829ad9f2.625fb2') }}
            </el-button>
            <el-button type="primary" @click="submitCancelConfirmAction">
              {{ $t('829ad9f2.38cf16') }}
            </el-button>
          </div>
        </el-dialog>
        <!-- 取消订单 -->
        <el-dialog
          :title="$t('829ad9f2.b21b5e')"
          :visible.sync="cancelOrderVisible"
          :before-close="handleCancelOrder"
          width="57%"
        >
          <template>
            <el-form ref="cancelForm" :model="cancelOrderForm" class="" label-width="100px">
              <el-form-item :label="$t('829ad9f2.070dce')">
                <el-col :span="20">
                  {{ cancelOrderData.orderInfo.order_id }}
                </el-col>
              </el-form-item>
              <el-form-item :label="$t('829ad9f2.27910a')">
                <el-row>
                  <el-col :span="20">
                    <template>
                      <el-select
                        v-model="cancel_order"
                        filterable
                        :placeholder="$t('829ad9f2.bc4a11')"
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
                        :placeholder="$t('829ad9f2.c6af7d')"
                      />
                    </template>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-form>
          </template>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="handleCancelOrder">{{ $t('829ad9f2.625fb2') }}</el-button>
            <el-button type="primary" @click="submitCancelOrderConfirmAction">
              {{ $t('829ad9f2.38cf16') }}
            </el-button>
          </div>
        </el-dialog>
        <!-- 自提订单核销 -->
        <el-dialog
          :title="$t('829ad9f2.bdc4b9')"
          :visible.sync="writeoffOrderVisible"
          :before-close="handleWriteoffOrder"
          width="57%"
        >
          <template>
            <el-form ref="cancelForm" :model="writeoffOrderForm" class="" label-width="100px">
              <el-form-item :label="$t('829ad9f2.070dce')">
                <el-col :span="20">
                  {{ writeoffOrderData.order_id }}
                </el-col>
              </el-form-item>
              <el-form-item :label="$t('829ad9f2.2083dd')">
                <el-col v-for="item in writeoffOrderData.items" :key="item.item_id">
                  {{ item.item_name }} {{ item.item_spec_desc }} × {{ item.num }}
                </el-col>
              </el-form-item>
              <el-form-item
                v-if="writeoffOrderData.pickupcode_status"
                :label="$t('829ad9f2.a5a7dd')"
              >
                <el-input
                  v-model="writeoffOrderForm.pickupcode"
                  :maxlength="6"
                  type="text"
                  :placeholder="$t('829ad9f2.ba231e')"
                  style="width: 180px"
                />
              </el-form-item>
            </el-form>
          </template>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="handleWriteoffOrder">{{ $t('829ad9f2.625fb2') }}</el-button>
            <el-button type="primary" @click="submitWriteoffOrderConfirmAction">
              {{ $t('829ad9f2.38cf16') }}
            </el-button>
          </div>
        </el-dialog>
        <!-- 自提订单核销完成 -->
        <el-dialog
          :title="$t('829ad9f2.ae62ca')"
          :visible.sync="writeoffOrderSuccVisible"
          :before-close="handleWriteoffOrderSucc"
          width="57%"
        >
          <template>
            <span>{{ writeoffOrderSucc.msg }}</span>
          </template>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="handleWriteoffOrderSucc">
              {{ $t('829ad9f2.ce2695') }}
            </el-button>
          </div>
        </el-dialog>
      </div>
      <router-view />
    </div>
  </SpPage>
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
  cancelOrderConfirm,
  isBind,
  exportInvoice,
  isInvoiced,
  getWriteoff,
  doWriteoff,
  getPickupcode
} from '@/api/trade'

import { open_status_map, open_status_arr } from '@/view/financial/invoice/constants'
import { getSourcesList } from '@/api/datacube'
import { handleUploadFile } from '@/api/common'
import shopSelect from '@/components/shopSelect'
import store from '@/store'

export default {
  components: {
    shopSelect
  },
  data() {
    return {
      is_distributor: false,
      IsDisabled: false,
      IsBind: false,
      activeName: 'all',
      loading: false,
      create_time: '',
      params: {
        page: 1,
        pageSize: 20,
        order_class_exclude: 'drug'
      },
      order_class_array: [{ name: '829ad9f2.6530f7', value: 'pointsmall' }],
      cancelOrderInput: false,
      order_cancel_reason: [
        { name: '829ad9f2.8f038a', value: 1 },
        { name: '829ad9f2.5e58ba', value: 2 },
        { name: '829ad9f2.151111', value: 3 },
        { name: '829ad9f2.baa450', value: 4 },
        { name: '829ad9f2.3013ee', value: 5 },
        { name: '829ad9f2.e7197e', value: 6 },
        { name: '829ad9f2.74c00b', value: 7 },
        { name: '829ad9f2.16264a', value: 8 },
        { name: '829ad9f2.13bea0', value: 9 },
        { name: '829ad9f2.0e6c86', value: 10 },
        { name: '829ad9f2.e21052', value: 11 },
        { name: '829ad9f2.94490e', value: 12 }
      ],
      open_status_map,
      open_status_arr,
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
      order_class: 'pointsmall',
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
      writeoffOrderVisible: false,
      writeoffOrderData: {
        items: {}
      },
      writeoffOrderForm: {
        order_id: '',
        pickupcode: ''
      },
      writeoffOrderSuccVisible: false,
      writeoffOrderSucc: {
        msg: ''
      },
      downloadView: false,
      downloadUrl: '',
      downloadName: '',
      deliveryVisibleNew: false,
      datapass_block: 1,
      exportTab: '',
      jstErpSetting: {},
      invoice_status: ''
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted() {
    if (store.getters.login_type === 'distributor') {
      this.is_distributor = true
    }
    if (this.$route.query.tab) {
      this.activeName = this.$route.query.tab
      this.params.order_status = this.$route.query.tab
      this.params.page = 1
    }
    this.params.order_type = this.order_type
    this.params.order_class = this.order_class
    this.getStatus()
    this.getOrders(this.params)
    this.getAllSourcesList()
    this.getJstErpSetting()
  },
  methods: {
    /** 开票状态：从 i18n key 转为当前语言文案 */
    invoiceStatusText(status) {
      const key = this.open_status_map[status]
      return key ? this.$t(key) : ''
    },
    getJstErpSetting() {
      this.$api.third.getJstErpSetting().then((res) => {
        this.jstErpSetting = res
      })
    },
    onCopy() {
      this.$notify({
        message: this.$t('829ad9f2.20a495'),
        type: 'success'
      })
    },
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
    invoiceStatusChange(val) {
      this.params.invoice_status = val
      this.params.page = 1
      this.getParams()
      this.getOrders(this.params)
    },
    dateChange(val) {
      if (val && val.length > 0) {
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
        this.params.order_id = ''
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
        this.datapass_block = response.data.data.datapass_block
        this.loading = false
      })
    },
    getStatus() {
      isBind().then((response) => {
        this.IsBind = response.data.data.result
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
    deliveryAction(data) {
      // 编辑物料弹框
      let order_id = data.order_id
      console.log(order_id, 'order_id')
      this.selectItemType = data.delivery_type
      // this.selectItemType = 'new'
      this.deliveryTitle = this.$t('829ad9f2.045315')
      getLogisticsList().then((res) => {
        this.dlycorps = res.data.data.list
      })
      getOrderDetail(order_id).then((response) => {
        this.deliveryData = response.data.data
        if (this.deliveryData.orderInfo.cancel_status == 'WAIT_PROCESS') {
          this.$message.error(this.$t('829ad9f2.e406db'))
          return false
        }

        if (this.selectItemType == 'old') {
          this.deliveryVisible = true
        } else {
          this.deliveryVisibleNew = true
        }
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
      this.cancelForm.order_type = 'normal_pointsmall'
    },
    handleCancelOrderCancel() {
      this.cancelVisible = false
      this.cancelForm.order_id = ''
      this.cancelForm.shop_reject_reason = ''
      this.cancelForm.order_type = ''
    },
    submitCancelConfirmAction() {
      // 提交取消订单审核结果
      cancelConfirm(this.cancelForm.order_id, this.cancelForm).then((response) => {
        var cancelOrderStatus = response.data.data.refund_status
        if (cancelOrderStatus == 'SUCCESS' || cancelOrderStatus == 'AUDIT_SUCCESS') {
          this.handleCancelOrderCancel()
          this.$message.success(this.$t('829ad9f2.388738'))
          this.getOrders(this.params)
        } else {
          this.$message.success(this.$t('829ad9f2.af3280'))
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
      this.deliveryVisibleNew = false
      this.deliveryForm = {
        delivery_type: 'batch',
        order_id: '',
        delivery_corp: '',
        delivery_code: '',
        sepInfo: {}
      }
      this.IsDisabled = false
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
        var deliveryStatus = response.data.data.delivery_status
        if (deliveryStatus && deliveryStatus != 'PENDING') {
          this.handleCancel()
          this.$message.success(this.$t('829ad9f2.de3b52'))
          this.getOrders(this.params)
        } else {
          this.$message.error(this.$t('829ad9f2.2249c1'))
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
          this.$message.error(this.$t('829ad9f2.8f8a2c'))
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
        this.$message.error(this.$t('829ad9f2.1be7fb'))
        return false
      }
      if (this.cancelOrderForm.cancel_reason == 12 && this.cancelOrderForm.other_reason == '') {
        this.$message.error(this.$t('829ad9f2.d31b9c'))
        return false
      }
      cancelOrderConfirm(this.cancelOrderForm.order_id, this.cancelOrderForm).then((response) => {
        var cancelOrderStatus = response.data.data.refund_status
        if (cancelOrderStatus == 'WAIT_CHECK' || cancelOrderStatus == 'SUCCESS') {
          this.handleCancelOrder()
          this.$message.success(this.$t('829ad9f2.86a02e'))
          this.getOrders(this.params)
        } else {
          this.$message.success(this.$t('829ad9f2.dc8eed'))
          this.getOrders(this.params)
          return false
        }
      })
    },
    writeoffOrderAction(order_id) {
      //自提订单核销
      getWriteoff(order_id).then((response) => {
        this.writeoffOrderData = response.data.data
        if (this.writeoffOrderData.ziti_status == 'DONE') {
          this.$message.error(this.$t('829ad9f2.c9045d'))
          return false
        }
        this.writeoffOrderVisible = true
      })
      console.log(order_id, 111111)
      this.writeoffOrderForm.order_id = order_id
    },
    handleWriteoffOrder() {
      this.writeoffOrderVisible = false
      this.writeoffOrderForm.order_id = ''
      this.writeoffOrderForm.pickupcode = ''
      this.writeoffOrderInput = false
    },
    submitWriteoffOrderConfirmAction() {
      if (
        this.writeoffOrderData.pickupcode_status == 1 &&
        this.writeoffOrderForm.pickupcode == ''
      ) {
        this.$message.error(this.$t('829ad9f2.080282'))
        return false
      }
      doWriteoff(this.writeoffOrderForm.order_id, this.writeoffOrderForm).then((response) => {
        var writeoffStatus = response.data.data.ziti_status
        var order_id = response.data.data.order_id
        if (writeoffStatus == 'DONE') {
          this.handleWriteoffOrder()
          this.writeoffOrderSuccVisible = true
          this.writeoffOrderSucc.msg =
            this.$t('829ad9f2.4c117f') + order_id + this.$t('829ad9f2.065407')
        } else {
          this.$message.success(this.$t('829ad9f2.47c5ff'))
          return false
        }
      })
    },
    handleWriteoffOrderSucc() {
      this.writeoffOrderSuccVisible = false
      this.writeoffOrderSucc.msg = ''
      this.getOrders(this.params)
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
          message: this.$t('829ad9f2.08bd5c')
        })
        return
      }
      orderExport(this.params).then((response) => {
        if (response.data.data.status) {
          this.$message({
            type: 'success',
            message: this.$t('829ad9f2.3e1ddd')
          })
          this.$export_open(type)
          return
        } else if (response.data.data.url) {
          this.downloadUrl = response.data.data.url
          this.downloadName = response.data.data.filename
          this.downloadView = true
        } else {
          this.$message({
            type: 'error',
            message: this.$t('829ad9f2.89ae53')
          })
          return
        }
      })
    },
    exportInvoice() {
      this.getParams()
      ;(this.params.type = 'normal'),
        exportInvoice(this.params).then((response) => {
          if (response.data.data.status) {
            this.$message({
              type: 'success',
              message: this.$t('829ad9f2.3e1ddd')
            })
            this.$export_open('normal_order')
            return
          } else if (response.data.data.url) {
            this.downloadUrl = response.data.data.url
            this.downloadName = response.data.data.filename
            this.downloadView = true
          } else {
            this.$message({
              type: 'error',
              message: this.$t('829ad9f2.89ae53')
            })
            return
          }
        })
    },
    IsInvoiced(row, status) {
      if (!row.invoice) {
        this.$message({
          type: 'info',
          message: this.$t('829ad9f2.df2bb8')
        })
        return
      }
      this.$confirm(this.$t('829ad9f2.23d4a7'), this.$t('8312e7f7.02d981'), {
        cancelButtonText: this.$t('829ad9f2.625fb2'),
        confirmButtonText: this.$t('829ad9f2.38cf16'),
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            var params = {
              order_id: row.order_id,
              status: status
            }
            isInvoiced(params).then((response) => {
              if (response.data.data.success) {
                this.$message({
                  type: 'success',
                  message: this.$t('829ad9f2.ee73ff')
                })
                this.getOrders(this.params)
              } else {
                this.$message({
                  type: 'error',
                  message: this.$t('829ad9f2.34b438')
                })
              }
            })
          }
          done()
        }
      })
    },
    uploadHandleChange(file, fileList) {
      let params = { isUploadFile: true, file_type: 'normal_orders', file: file.raw }
      handleUploadFile(params).then((response) => {
        this.$message({
          type: 'success',
          message: this.$t('829ad9f2.7bbfaa')
        })
      })
    }
  }
}
</script>
<style lang="scss">
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
.invoice {
  cursor: pointer;
}
</style>
