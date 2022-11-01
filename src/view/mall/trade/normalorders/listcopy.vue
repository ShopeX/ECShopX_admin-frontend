<template>
  <div class="">
    <div v-if="$route.path.indexOf('_detail') === -1 && $route.path.indexOf('_process') === -1">
      <el-row
        class="filter-header"
        :gutter="20"
      >
        <el-col>
          <shop-select
            v-if="$store.getters.login_type != 'distributor'"
            distributors
            @update="storeSearch"
          />
          <el-date-picker
            v-model="create_time"
            type="daterange"
            start-placeholder="开始日期"
            ange-separator="至"
            end-placeholder="结束日期"
            value-format="yyyy/MM/dd"
            placeholder="选择日期范围"
            @change="dateChange"
          />
          <el-select
            v-model="order_class"
            placeholder="请选择订单类型"
            @change="TypeHandle"
          >
            <el-option
              v-for="(item, index) in order_class_array"
              :key="index"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
          <el-autocomplete
            v-model="source_name"
            class="inline-input"
            :fetch-suggestions="querySearch"
            placeholder="请输入来源"
            @select="sourceSearch"
          />
          <el-input
            v-model="salesman_mobile"
            class="input-m"
            placeholder="导购员手机号"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="numberSearch"
            />
          </el-input>
          <el-input
            v-model="identifier"
            class="input-m"
            placeholder="手机号/订单号"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="numberSearch"
            />
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-button-group>
            <el-button
              type="primary"
              @click="exportData('normal_master_order')"
            >
              导出主订单
            </el-button>
            <el-button
              type="primary"
              @click="exportData('normal_order')"
            >
              导出子订单
            </el-button>
            <el-button
              type="primary"
              @click="exportInvoice()"
            >
              导出未开票订单
            </el-button>
          </el-button-group>
          <el-popover
            placement="top-start"
            width="200"
            trigger="hover"
            content="导出任务会以队列执行，点击导出后，请至‘设置-导出列表’页面中查看及下载数据"
          >
            <i
              slot="reference"
              class="el-icon-question"
            />
          </el-popover>
          <el-upload
            action=""
            style="display: inline; margin-left: 20px"
            :on-change="uploadHandleChange"
            :auto-upload="false"
            :show-file-list="false"
          >
            <el-button
              type="primary"
              icon="el-icon-box"
              plain
            >
              批量发货
            </el-button>
          </el-upload>
        </el-col>
      </el-row>
      <el-dialog
        title="订单下载"
        :visible.sync="downloadView"
        :close-on-click-modal="false"
      >
        <template v-if="downloadUrl">
          <a
            :href="downloadUrl"
            download
          >{{ downloadName }}</a>
        </template>
      </el-dialog>

      <el-tabs
        v-model="activeName"
        type="border-card"
        @tab-click="handleClick"
      >
        <el-tab-pane
          label="全部"
          name="all"
        />
        <el-tab-pane
          label="待发货"
          name="notship"
        />
        <el-tab-pane
          label="待退款"
          name="cancelapply"
        />
        <el-tab-pane
          label="待收货"
          name="shipping"
        />
        <el-tab-pane
          label="待自提"
          name="ziti"
        />
        <el-tab-pane
          label="未支付"
          name="notpay"
        />
        <el-tab-pane
          label="已取消/已关闭"
          name="cancel"
        />
        <el-tab-pane
          label="已完成"
          name="finish"
        />
        <el-tab-pane
          label="已完成未开票"
          name="done_noinvoice"
        />
        <el-tab-pane
          label="已完成已开票"
          name="done_invoice"
        />
        <el-table
          v-loading="loading"
          :data="list"
          element-loading-text="数据加载中"
        >
          <el-table-column
            width="280"
            prop="order_id"
            label="订单信息"
          >
            <template slot-scope="scope">
              <div class="order-num">
                {{ scope.row.order_id }}
                <el-tooltip
                  effect="dark"
                  content="复制"
                  placement="top-start"
                >
                  <i
                    v-clipboard:copy="scope.row.order_id"
                    v-clipboard:success="onCopy"
                    class="el-icon-document-copy"
                  />
                </el-tooltip>
              </div>
              <div
                v-if="scope.row.distributor_name"
                class="order-store"
              >
                <el-tooltip
                  effect="dark"
                  content="店铺名"
                  placement="top-start"
                >
                  <i class="el-icon-office-building" />
                </el-tooltip>
                {{ scope.row.distributor_name }}
              </div>
              <div class="order-time">
                <el-tooltip
                  effect="dark"
                  content="下单时间"
                  placement="top-start"
                >
                  <i class="el-icon-time" />
                </el-tooltip>
                {{ scope.row.create_time | datetime('YYYY-MM-DD HH:mm:ss') }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            width="80"
            label="运费"
          >
            <template slot-scope="scope">
              <span class="cur">{{ scope.row.fee_symbol }}</span>{{ scope.row.freight_fee / 100 }}
            </template>
          </el-table-column>
          <!--
          <el-table-column width="70" label="商品金额">
            <template slot-scope="scope">
              {{scope.row.fee_symbol}}{{scope.row.item_fee / 100}}
            </template>
          </el-table-column>
          -->
          <el-table-column
            prop="total_fee"
            width="100"
            label="订单金额"
          >
            <template slot-scope="scope">
              <span class="cur">{{ scope.row.fee_symbol }}</span>{{ scope.row.total_fee / 100 }}
            </template>
          </el-table-column>
          <el-table-column
            prop="mobile"
            width="160"
            label="联系手机"
          >
            <template slot-scope="scope">
              <i class="el-icon-mobile" />
              <router-link
                target="_blank"
                :to="{ path: '/member/member/detail', query: { user_id: scope.row.user_id } }"
              >
                {{ scope.row.mobile }}
              </router-link>
              <el-tooltip
                effect="dark"
                content="复制"
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
          <el-table-column
            width="90"
            label="类型"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.order_class == 'normal'">
                <span v-if="scope.row.type == '1'">跨境订单</span>
                <span v-else>普通订单</span>
              </span>
              <span v-if="scope.row.order_class == 'groups'">团购订单</span>
              <span v-if="scope.row.order_class == 'seckill'">秒杀订单</span>
              <span v-if="scope.row.order_class == 'community'">社区订单</span>
              <span v-if="scope.row.order_class == 'shopguide'">导购订单</span>
              <span v-if="scope.row.order_class == 'bargain'">助力订单</span>
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
          <el-table-column
            v-if="activeName == 'all'"
            width="120"
            prop="order_status"
            label="状态"
          >
            <template slot-scope="scope">
              <!-- 订单状态 -->
              <template v-if="scope.row.receipt_type == 'dada'">
                <span v-if="scope.row.order_status == 'NOTPAY'">未支付</span>
                <span v-if="scope.row.order_status_des == 'CANCEL'">已取消</span>
                <span v-if="scope.row.order_status == 'DONE'">已完成</span>
                <span
                  v-if="scope.row.pay_status == 'PAYED' && scope.row.dada.dada_status == '0'"
                >商家待接单</span>
                <span
                  v-if="scope.row.pay_status == 'PAYED' && scope.row.dada.dada_status == '1'"
                >骑士待接单</span>
                <span
                  v-if="scope.row.pay_status == 'PAYED' && scope.row.dada.dada_status == '2'"
                >待取货</span>
                <span
                  v-if="scope.row.pay_status == 'PAYED' && scope.row.dada.dada_status == '100'"
                >骑士到店</span>
                <span
                  v-if="scope.row.pay_status == 'PAYED' && scope.row.dada.dada_status == '100'"
                >骑士到店</span>
                <span
                  v-if="scope.row.pay_status == 'PAYED' && scope.row.dada.dada_status == '3'"
                >配送中</span>
                <span
                  v-if="scope.row.pay_status == 'PAYED' && scope.row.dada.dada_status == '9'"
                >未妥投</span>
                <span
                  v-if="scope.row.pay_status == 'PAYED' && scope.row.dada.dada_status == '10'"
                >妥投异常</span>
              </template>
              <template v-if="scope.row.receipt_type != 'dada'">
                <span v-if="scope.row.order_status == 'PAYED'">已支付</span>
                <span v-if="scope.row.order_status == 'NOTPAY'">未支付</span>
                <span v-if="scope.row.order_status_des == 'CANCEL'">已取消</span>
                <span v-if="scope.row.order_status_des == 'CLOSED'">{{
                  scope.row.order_status_msg
                }}</span>
                <span v-if="scope.row.order_status == 'WAIT_BUYER_CONFIRM'">待收货</span>
                <span v-if="scope.row.order_status == 'REFUND_SUCCESS'">已退款</span>
                <span v-if="scope.row.order_status == 'WAIT_GROUPS_SUCCESS'">等待成团</span>
                <span v-if="scope.row.order_status == 'DONE'">已完成</span>
                <template
                  v-if="
                    scope.row.order_status != 'CANCEL' &&
                      scope.row.order_status != 'REFUND_SUCCESS' &&
                      scope.row.order_status != 'WAIT_GROUPS_SUCCESS'
                  "
                >
                  <!-- 发货状态 -->
                  <span v-if="scope.row.cancel_status == 'WAIT_PROCESS'">取消待退款</span>
                  <span v-if="scope.row.delivery_status == 'PARTAIL'">部分发货</span>
                  <span
                    v-if="scope.row.receipt_type == 'ziti' && scope.row.ziti_status == 'PENDING'"
                  >待自提</span>
                  <span
                    v-if="
                      scope.row.receipt_type == 'logistics' &&
                        scope.row.delivery_status == 'PENDING'
                    "
                  >待发货</span>
                </template>
              </template>
            </template>
          </el-table-column>
          <el-table-column
            width="120"
            label="配送方式"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.receipt_type == 'logistics'">普通快递</span>
              <span v-if="scope.row.receipt_type == 'ziti'">自提</span>
              <span v-if="scope.row.receipt_type == 'dada'">同城配</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="source_name"
            label="来源"
          />
          <el-table-column
            width="120"
            label="海关审批状态"
          >
            <template slot-scope="scope">
              <template v-if="scope.row.type == 1">
                <span v-if="scope.row.audit_status == 'approved'">审核通过</span>
                <span v-if="scope.row.audit_status == 'processing'">审核中</span>
                <span v-if="scope.row.audit_status == 'rejected'">审核失败</span>
              </template>
              <template v-else>
                -
              </template>
            </template>
          </el-table-column>
          <el-table-column
            width="200"
            label="操作"
          >
            <template slot-scope="scope">
              <router-link
                :to="{
                  path: matchHidePage('detail'),
                  query: { orderId: scope.row.order_id, resource: $route.path }
                }"
              >
                详情
              </router-link>
              <el-button
                v-if="
                  ((VERSION_STANDARD || is_distributor || scope.row.distributor_id == 0) &&
                    scope.row.cancel_status == 'NO_APPLY_CANCEL' &&
                    (scope.row.order_status == 'NOTPAY' || scope.row.order_status == 'PAYED') &&
                    scope.row.ziti_status != 'DONE') ||
                    (scope.row.receipt_type == 'dada' &&
                      (scope.row.dada.dada_status == '0' || scope.row.dada.dada_status == '1'))
                "
                type="text"
                @click="cancelOrderAction(scope.row.order_id)"
              >
                取消订单
              </el-button>
              <router-link
                :to="{
                  path: matchHidePage('process'),
                  query: { orderId: scope.row.order_id, resource: $route.path }
                }"
              >
                操作日志
              </router-link>
              <el-button
                v-if="
                  (VERSION_STANDARD || is_distributor || scope.row.distributor_id == 0) &&
                    scope.row.order_status == 'PAYED' &&
                    scope.row.receipt_type == 'ziti' &&
                    scope.row.ziti_status == 'PENDING'
                "
                type="text"
                @click="writeoffOrderAction(scope.row.order_id)"
              >
                核销
              </el-button>
              <el-button
                v-if="
                  (VERSION_STANDARD || is_distributor || scope.row.distributor_id == 0) &&
                    scope.row.receipt_type == 'dada' &&
                    scope.row.order_status == 'PAYED' &&
                    scope.row.delivery_status != 'DONE' &&
                    scope.row.dada.dada_status == '0'
                "
                type="text"
                @click="businessReceiptAction(scope.row)"
              >
                接单
              </el-button>

              <template
                v-if="
                  !IsBind && (VERSION_STANDARD || is_distributor || scope.row.distributor_id == 0)
                "
              >
                <el-button
                  v-if="
                    (scope.row.receipt_type == 'logistics' || scope.row.is_logistics) &&
                      scope.row.receipt_type != 'dada' &&
                      scope.row.order_status == 'PAYED' &&
                      scope.row.delivery_status != 'DONE'
                  "
                  type="text"
                  @click="deliveryAction(scope.row)"
                >
                  发货
                </el-button>
                <el-button
                  v-if="
                    scope.row.cancel_status == 'WAIT_PROCESS' && scope.row.order_status == 'PAYED'
                  "
                  type="text"
                  @click="confirmCancelOrderAction(scope.row.order_id)"
                >
                  退款
                </el-button>
              </template>
              <el-button
                v-if="scope.row.is_invoiced == '0' && scope.row.invoice"
                type="text"
                @click="IsInvoiced(scope.row, 1)"
              >
                待开票
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="content-padded content-center">
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
        width="65%"
      >
        <template>
          <el-form
            ref="deliveryForm"
            :model="deliveryForm"
            class="demo-ruleForm"
            label-width="100px"
          >
            <el-form-item label="订单号">
              <el-col :span="20">
                {{ deliveryData.orderInfo.order_id }}
              </el-col>
            </el-form-item>
            <el-form-item label="发货类型">
              <el-radio-group
                v-model="deliveryForm.delivery_type"
                :disabled="IsDisabled"
              >
                <el-radio label="batch">
                  整单发货
                </el-radio>
                <el-radio label="sep">
                  拆分发货
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="商品信息">
              <el-col :span="30">
                <el-table :data="deliveryData.orderInfo.items">
                  <el-table-column
                    prop="item_name"
                    label="商品名"
                    width="180"
                  />
                  <el-table-column
                    prop="num"
                    label="数量"
                    width="180"
                  />
                  <el-table-column label="总支付价(元)">
                    <template slot-scope="scope">
                      <span>{{ scope.row.fee_symbol }}{{ scope.row.total_fee / 100 }}</span>
                    </template>
                  </el-table-column>
                  <template v-if="deliveryForm.delivery_type == 'sep'">
                    <el-table-column
                      label="快递公司"
                      width="200"
                    >
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
                    <el-table-column
                      label="物流单号"
                      width="200"
                    >
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
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click.native="handleCancel">
            取消
          </el-button>
          <el-button
            type="primary"
            @click="submitDeliveryAction"
          >
            确定
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
            <el-form-item label="订单号">
              <el-col :span="20">
                {{ deliveryData.orderInfo.order_id }}
              </el-col>
            </el-form-item>
            <el-form-item label="发货类型">
              <el-radio-group
                v-model="deliveryForm.delivery_type"
                :disabled="IsDisabled"
              >
                <el-radio label="batch">
                  整单发货
                </el-radio>
                <el-radio label="sep">
                  拆分发货
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="商品信息">
              <el-table :data="deliveryData.orderInfo.items">
                <el-table-column
                  prop="item_name"
                  label="商品名"
                  width="180"
                />
                <el-table-column
                  prop="num"
                  label="数量"
                  width="180"
                />
                <el-table-column
                  prop="delivery_item_num"
                  label="已发货数量"
                  width="180"
                />

                <el-table-column label="总支付价(元)">
                  <template slot-scope="scope">
                    <span>{{ scope.row.fee_symbol }}{{ scope.row.total_fee / 100 }}</span>
                  </template>
                </el-table-column>
                <template v-if="deliveryForm.delivery_type == 'sep'">
                  <el-table-column
                    label="发货数量"
                    width="200"
                  >
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
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click.native="handleCancel">
            取消
          </el-button>
          <el-button
            type="primary"
            @click="submitDeliveryAction"
          >
            确定
          </el-button>
        </div>
      </el-dialog>
      <!-- 取消订单退款审核-开始 -->
      <el-dialog
        title="取消订单退款审核"
        :visible.sync="cancelVisible"
        :before-close="handleCancelOrderCancel"
        width="57%"
      >
        <template>
          <el-row :gutter="100">
            <el-col :span="24">
              <span class="grid-content">订单号:{{ cancelData.order_id }}</span>
            </el-col>
            <el-col :span="24">
              <span v-if="cancelData.cancel_from == 'buyer'">取消来源:消费者申请</span>
              <span v-else>取消来源:系统自动取消</span>
            </el-col>
            <el-col :span="24">
              <span>申请时间:{{ cancelData.create_time | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
            </el-col>
            <el-col :span="24">
              <span>退款状态:</span>
              <span v-if="cancelData.refund_status == 'READY'">待审核</span>
              <span v-if="cancelData.refund_status == 'AUDIT_SUCCESS'">审核成功待退款</span>
              <span v-if="cancelData.refund_status == 'SUCCESS'">退款成功</span>
              <span v-if="cancelData.refund_status == 'SHOP_CHECK_FAILS'">商家审核不通过</span>
              <span v-if="cancelData.refund_status == 'CANCEL'">撤销退款</span>
              <span v-if="cancelData.refund_status == 'PROCESSING'">已发起退款等待到账</span>
              <span v-if="cancelData.refund_status == 'FAILS'">退款失败</span>
            </el-col>
            <el-col :span="24">
              <span>处理进度:</span>
              <span v-if="cancelData.progress == '0'">待处理</span>
              <span v-if="cancelData.progress == '1'">已取消</span>
              <span v-if="cancelData.progress == '2'">退款中</span>
              <span v-if="cancelData.progress == '3'">已完成</span>
              <span v-if="cancelData.progress == '4'">已驳回</span>
            </el-col>
            <el-col :span="24">
              <span>退款金额:{{ cancelData.fee_symbol }}{{ cancelData.total_fee / 100 }}</span>
            </el-col>
            <el-col :span="24">
              <span v-if="cancelData.pay_type == 'wxpay'">支付方式:微信支付</span>
            </el-col>
            <el-col :span="24">
              <span>取消原因:{{ cancelData.cancel_reason }}</span>
            </el-col>
          </el-row>
          <el-divider />
          <el-form
            ref="cancelForm"
            :model="cancelForm"
            class=""
            label-width="100px"
          >
            <el-form-item label="处理结果:">
              <el-row>
                <el-col :span="20">
                  <template>
                    <el-radio
                      v-model="cancelForm.check_cancel"
                      label="0"
                    >
                      不同意
                    </el-radio>
                    <el-radio
                      v-model="cancelForm.check_cancel"
                      label="1"
                    >
                      同意
                    </el-radio>
                  </template>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item
              v-if="cancelForm.check_cancel == '0'"
              label="拒绝原因:"
            >
              <el-row>
                <el-col :span="24">
                  <el-input
                    v-model="cancelForm.shop_reject_reason"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入拒绝原因"
                  />
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
        </template>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click.native="handleCancelOrderCancel">
            取消
          </el-button>
          <el-button
            type="primary"
            @click="submitCancelConfirmAction"
          >
            确定
          </el-button>
        </div>
      </el-dialog>
      <!-- 取消订单 -->
      <el-dialog
        title="取消订单"
        :visible.sync="cancelOrderVisible"
        :before-close="handleCancelOrder"
        width="57%"
      >
        <template>
          <el-form
            ref="cancelForm"
            :model="cancelOrderForm"
            class=""
            label-width="100px"
          >
            <el-form-item label="订单号:">
              <el-col :span="20">
                {{ cancelOrderData.orderInfo.order_id }}
              </el-col>
            </el-form-item>
            <el-form-item label="取消原因:">
              <el-row>
                <el-col :span="20">
                  <template>
                    <el-select
                      v-model="cancel_order"
                      filterable
                      placeholder="请选择取消订单原因"
                      @change="cancelReasonSelect"
                    >
                      <el-option
                        v-for="item in order_cancel_reason"
                        :key="item.value"
                        :label="item.name"
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
                      placeholder="请填写取消订单原因"
                    />
                  </template>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
        </template>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click.native="handleCancelOrder">
            取消
          </el-button>
          <el-button
            type="primary"
            @click="submitCancelOrderConfirmAction"
          >
            确定
          </el-button>
        </div>
      </el-dialog>
      <!-- 自提订单核销 -->
      <el-dialog
        title="自提订单核销"
        :visible.sync="writeoffOrderVisible"
        :before-close="handleWriteoffOrder"
        width="57%"
      >
        <template>
          <el-form
            ref="cancelForm"
            :model="writeoffOrderForm"
            class=""
            label-width="100px"
          >
            <el-form-item label="订单号:">
              <el-col :span="20">
                {{ writeoffOrderData.order_id }}
              </el-col>
            </el-form-item>
            <el-form-item label="商品:">
              <el-col
                v-for="item in writeoffOrderData.items"
                :key="item.item_id"
              >
                {{ item.item_name }} {{ item.item_spec_desc }} × {{ item.num }}
              </el-col>
            </el-form-item>
            <el-form-item
              v-if="writeoffOrderData.pickupcode_status"
              label="提货码:"
            >
              <el-input
                v-model="writeoffOrderForm.pickupcode"
                :maxlength="6"
                type="text"
                placeholder="请输入手机6位提货码"
                style="width: 180px"
              />
            </el-form-item>
          </el-form>
        </template>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click.native="handleWriteoffOrder">
            取消
          </el-button>
          <el-button
            type="primary"
            @click="submitWriteoffOrderConfirmAction"
          >
            确定
          </el-button>
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
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click.native="handleWriteoffOrderSucc">
            知道了
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
  cancelOrderConfirm,
  isBind,
  exportInvoice,
  isInvoiced,
  getWriteoff,
  doWriteoff,
  getPickupcode,
  doBusinessReceipt
} from '../../../../api/trade'
import { getSourcesList } from '../../../../api/datacube'
import { handleUploadFile } from '../../../../api/common'
import shopSelect from '@/components/shopSelect'
import store from '@/store'

export default {
  components: {
    shopSelect
  },
  data () {
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
        order_class_exclude: 'drug,pointsmall'
      },
      order_class_array: [
        { name: '全部订单', value: '' },
        { name: '团购订单', value: 'groups' },
        { name: '秒杀订单', value: 'seckill' },
        { name: '社区订单', value: 'community' },
        { name: '导购订单', value: 'shopguide' },
        { name: '跨境订单', value: 'crossborder' },
        { name: '助力订单', value: 'bargain' }
      ],
      cancelOrderInput: false,
      order_cancel_reason: [
        { name: '客户现在不想购买', value: 1 },
        { name: '客户商品价格较贵', value: 2 },
        { name: '客户价格波动', value: 3 },
        { name: '客户商品缺货', value: 4 },
        { name: '客户重复下单', value: 5 },
        { name: '客户订单商品选择有误', value: 6 },
        { name: '客户支付方式选择有误', value: 7 },
        { name: '客户收货信息填写有误', value: 8 },
        { name: '客户发票信息填写有误', value: 9 },
        { name: '客户无法支付订单', value: 10 },
        { name: '客户长时间未付款', value: 11 },
        { name: '客户其他原因', value: 12 }
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
      receipt_type: '',
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
      // 选择发货订单的类型，老订单还是新订单
      selectItemType: '',
      deliveryVisibleNew: false
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted () {
    if (store.getters.login_type === 'distributor') {
      this.is_distributor = true
    }
    if (this.$route.query.tab) {
      this.activeName = this.$route.query.tab
      this.params.order_status = this.$route.query.tab
      this.params.page = 1
    }
    this.params.order_type = this.order_type
    this.getStatus()
    this.getOrders(this.params)
    this.getAllSourcesList()
  },
  methods: {
    onCopy () {
      this.$notify({
        message: '复制成功',
        type: 'success'
      })
    },
    // 切换tab
    handleClick (tab, event) {
      this.activeName = tab.name
      this.params.order_status = tab.name == 'all' ? '' : tab.name
      this.params.page = 1
      this.getParams()
      this.getOrders(this.params)
    },
    storeSearch (val) {
      val && val.shop_id
      this.params.distributor_id = val.shop_id
      this.params.page = 1
      this.getParams()
      this.getOrders(this.params)
    },
    TypeHandle (val) {
      this.params.page = 1
      this.getParams()
      this.getOrders(this.params)
    },
    numberSearch (e) {
      this.params.page = 1
      this.getParams()
      this.getOrders(this.params)
    },
    dateChange (val) {
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
    sourceSearch (item) {
      this.params.source_id = item.source_id
      this.params.page = 1
      this.getParams()
      this.getOrders(this.params)
    },
    handleCurrentChange (page_num) {
      this.loading = false
      this.params.page = page_num
      this.getParams()
      this.getOrders(this.params)
    },
    handleSizeChange (pageSize) {
      this.loading = false
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getParams()
      this.getOrders(this.params)
    },
    getParams () {
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
    dateStrToTimeStamp (str) {
      return Date.parse(new Date(str)) / 1000
    },
    getOrders (filter) {
      this.loading = true
      getOrderList(filter).then((response) => {
        this.list = response.data.data.list
        this.total_count = Number(response.data.data.pager.count)
        this.loading = false
      })
    },
    getStatus () {
      isBind().then((response) => {
        this.IsBind = response.data.data.result
      })
    },
    getAllSourcesList () {
      let params = { page: 1, pageSize: 1000 }
      getSourcesList(params).then((response) => {
        if (response.data.data.list) {
          response.data.data.list.forEach((row) => {
            this.source_list.push({ value: row.sourceName, source_id: row.sourceId })
          })
        }
      })
    },
    querySearch (queryString, cb) {
      var restaurants = this.source_list
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter (queryString) {
      return (restaurant) => {
        return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    deliveryAction (data) {
      // 编辑物料弹框
      let order_id = data.order_id

      this.selectItemType = data.delivery_type
      // this.selectItemType = 'new'
      this.deliveryTitle = '发货'
      getLogisticsList().then((res) => {
        this.dlycorps = res.data.data.list
      })
      getOrderDetail(order_id).then((response) => {
        this.deliveryData = response.data.data
        if (this.deliveryData.orderInfo.cancel_status == 'WAIT_PROCESS') {
          this.$message.error('客户已经申请退款，请先处理退款操作再决定是否发货!')
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
    confirmCancelOrderAction (order_id) {
      // 已支付订单的取消订单审核
      let params = { order_type: 'normal' }
      getCancelOrderInfo(order_id, params).then((response) => {
        this.cancelData = response.data.data
        this.cancelVisible = true
        console.log(response)
      })
      this.cancelForm.order_id = order_id
    },
    handleCancelOrderCancel () {
      this.cancelVisible = false
      this.cancelForm.order_id = ''
      this.cancelForm.shop_reject_reason = ''
    },
    submitCancelConfirmAction () {
      // 提交取消订单审核结果
      cancelConfirm(this.cancelForm.order_id, this.cancelForm).then((response) => {
        var cancelOrderStatus = response.data.data.refund_status
        if (cancelOrderStatus == 'AUDIT_SUCCESS') {
          this.handleCancelOrderCancel()
          this.$message.success('审核成功!')
          this.getOrders(this.params)
        } else if (cancelOrderStatus == 'SHOP_CHECK_FAILS') {
          this.handleCancelOrderCancel()
          this.$message.success('审核拒绝成功!')
          this.getOrders(this.params)
        } else {
          this.$message.error('审核失败!')
          this.getOrders(this.params)
          return false
        }
      })
    },
    handleCancel () {
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
    submitDeliveryAction () {
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
          this.$message.success('发货成功!')
          this.getOrders(this.params)
        } else {
          this.$message.error('发货失败!')
          return false
        }
      })
    },
    cancelOrderAction (order_id) {
      //取消订单
      let params = { order_type: 'normal' }
      getOrderDetail(order_id).then((response) => {
        this.cancelOrderData = response.data.data
        console.log(this.cancelOrderData)
        if (this.cancelOrderData.orderInfo.cancel_status == 'SUCCESS') {
          this.$message.error('该订单已取消!')
          return false
        }
        this.cancelOrderVisible = true
      })
      this.cancelOrderForm.order_id = order_id
    },
    handleCancelOrder () {
      this.cancel_order = ''
      this.cancelOrderVisible = false
      this.cancelOrderForm.order_id = ''
      this.cancelOrderForm.other_reason = ''
      this.cancelOrderInput = false
    },
    cancelReasonSelect (val) {
      if (val == 12) {
        this.cancelOrderInput = true
      } else {
        this.cancelOrderForm.other_reason = ''
        this.cancelOrderInput = false
      }
      this.cancelOrderForm.cancel_reason = val
    },
    submitCancelOrderConfirmAction () {
      if (this.cancelOrderForm.cancel_reason == 0) {
        this.$message.error('请选择取消原因!')
        return false
      }
      if (this.cancelOrderForm.cancel_reason == 12 && this.cancelOrderForm.other_reason == '') {
        this.$message.error('请输入取消原因!')
        return false
      }
      cancelOrderConfirm(this.cancelOrderForm.order_id, this.cancelOrderForm).then((response) => {
        var cancelOrderStatus = response.data.data.refund_status
        if (cancelOrderStatus == 'WAIT_CHECK') {
          this.handleCancelOrder()
          this.$message.success('取消订单成功!')
          this.getOrders(this.params)
        } else {
          this.$message.success('取消订单失败!')
          this.getOrders(this.params)
          return false
        }
      })
    },
    writeoffOrderAction (order_id) {
      //自提订单核销
      getWriteoff(order_id).then((response) => {
        this.writeoffOrderData = response.data.data
        if (this.writeoffOrderData.ziti_status == 'DONE') {
          this.$message.error('该订单已核销!')
          return false
        }
        this.writeoffOrderVisible = true
      })
      console.log(order_id, 111111)
      this.writeoffOrderForm.order_id = order_id
    },
    handleWriteoffOrder () {
      this.writeoffOrderVisible = false
      this.writeoffOrderForm.order_id = ''
      this.writeoffOrderForm.pickupcode = ''
      this.writeoffOrderInput = false
    },
    submitWriteoffOrderConfirmAction () {
      if (
        this.writeoffOrderData.pickupcode_status == 1 &&
        this.writeoffOrderForm.pickupcode == ''
      ) {
        this.$message.error('请输入提货码!')
        return false
      }
      doWriteoff(this.writeoffOrderForm.order_id, this.writeoffOrderForm).then((response) => {
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
    handleWriteoffOrderSucc () {
      this.writeoffOrderSuccVisible = false
      this.writeoffOrderSucc.msg = ''
      this.getOrders(this.params)
    },
    exportData (type) {
      this.getParams()
      if (type) {
        this.params.type = type
      }
      this.params.page = 1
      if (this.params.order_type != 'normal') {
        this.$message({
          type: 'error',
          message: '暂不支持该类型订单导出'
        })
        return
      }
      orderExport(this.params).then((response) => {
        if (response.data.data.status) {
          this.$message({
            type: 'success',
            message: '已加入执行队列，请在设置-导出列表中下载'
          })
          return
        } else if (response.data.data.url) {
          this.downloadUrl = response.data.data.url
          this.downloadName = response.data.data.filename
          this.downloadView = true
        } else {
          this.$message({
            type: 'error',
            message: '无内容可导出 或 执行失败，请检查重试'
          })
          return
        }
      })
    },
    exportInvoice () {
      this.getParams()
      ;(this.params.type = 'normal'),
        exportInvoice(this.params).then((response) => {
          if (response.data.data.status) {
            this.$message({
              type: 'success',
              message: '已加入执行队列，请在设置-导出列表中下载'
            })
            return
          } else if (response.data.data.url) {
            this.downloadUrl = response.data.data.url
            this.downloadName = response.data.data.filename
            this.downloadView = true
          } else {
            this.$message({
              type: 'error',
              message: '无内容可导出 或 执行失败，请检查重试'
            })
            return
          }
        })
    },
    IsInvoiced (row, status) {
      if (!row.invoice) {
        this.$message({
          type: 'info',
          message: '此订单无发票信息'
        })
        return
      }
      this.$confirm('确定更新该订单开票状态？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
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
                  message: '已更新开票状态'
                })
                this.getOrders(this.params)
              } else {
                this.$message({
                  type: 'error',
                  message: '更新开票状态失败'
                })
              }
            })
          }
          done()
        }
      })
    },
    uploadHandleChange (file, fileList) {
      let params = { isUploadFile: true, file_type: 'normal_orders', file: file.raw }
      handleUploadFile(params).then((response) => {
        this.$message({
          type: 'success',
          message: '上传成功，等待处理'
        })
      })
    },
    businessReceiptAction (row) {
      this.$confirm('请在接单前确认商品当前库存', '接单提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          doBusinessReceipt(row.order_id).then((response) => {
            this.$message({
              message: '接单成功',
              type: 'success',
              duration: 2 * 1000
            }),
              this.getOrders(this.params)
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          }),
            this.getOrders(this.params)
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
.invoice {
  cursor: pointer;
}
</style>
