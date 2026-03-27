<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane
        v-for="item in order_status_list"
        :key="item.value"
        :label="item.name"
        :name="item.value"
      />
      <el-table
        v-loading="loading"
        :data="list"
        :element-loading-text="$t('37f26730.f09b12')"
        :size="size"
      >
        <el-table-column width="200" prop="order_id" :label="$t('37f26730.a6d10d')">
          <template slot-scope="scope">
            <div class="order-num">
              {{ scope.row.order_id }}
              <el-tooltip effect="dark" :content="$t('37f26730.79d3ab')" placement="top-start">
                <i
                  v-clipboard:copy="scope.row.order_id"
                  v-clipboard:success="onCopy"
                  class="el-icon-document-copy"
                />
              </el-tooltip>
            </div>
            <div v-if="scope.row.distributor_id !== '0'" class="order-store">
              <el-tooltip effect="dark" :content="$t('37f26730.8a0cc2')" placement="top-start">
                <i class="el-icon-office-building" />
              </el-tooltip>
              {{ scope.row.distributor_name }}
            </div>
            <div class="order-time">
              <el-tooltip effect="dark" :content="$t('37f26730.2240cc')" placement="top-start">
                <i class="el-icon-time" />
              </el-tooltip>
              {{ scope.row.create_time | datetime('YYYY-MM-DD HH:mm:ss') }}
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="total_fee" width="115" :label="$t('37f26730.d194d2')">
          <template slot-scope="scope">
            {{ (scope.row.total_fee / 100).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column width="90" :label="$t('37f26730.4dd437')">
          <template slot-scope="scope">
            {{ scope.row.freight_fee / 100 }}
          </template>
        </el-table-column>
        <el-table-column prop="mobile" width="120" :label="$t('37f26730.a32da1')">
          <template slot-scope="scope">
            <template v-if="!scope.row.user_delete && $store.getters.login_type !== 'merchant'">
              <router-link
                target="_blank"
                :to="{
                  path: `${
                    $store.getters.login_type != 'distributor'
                      ? '/member/member/memberlist/detail'
                      : '/shopadmin/member/member/detail'
                  }`,
                  query: { user_id: scope.row.user_id }
                }"
              >
                {{ scope.row.mobile }}
              </router-link>
              <el-tooltip
                v-if="dataPass == 0"
                effect="dark"
                :content="$t('37f26730.79d3ab')"
                placement="top-start"
              >
                <i
                  v-clipboard:copy="scope.row.mobile"
                  v-clipboard:success="onCopy"
                  class="el-icon-document-copy"
                />
              </el-tooltip>
            </template>
            <template v-else slot-scope="scope">
              <span>{{ scope.row.mobile }}</span>
              <el-tooltip
                v-if="dataPass == 0"
                effect="dark"
                :content="$t('37f26730.79d3ab')"
                placement="top-start"
              >
                <i
                  v-clipboard:copy="scope.row.mobile"
                  v-clipboard:success="onCopy"
                  class="el-icon-document-copy"
                />
              </el-tooltip>
            </template>
          </template>
        </el-table-column>
        <template v-if="$store.getters.login_type != 'merchant'">
          <el-table-column v-if="!isMicorMall" width="90" :label="$t('37f26730.5cd56b')">
            <template slot-scope="scope">
              <span v-if="scope.row.order_class == 'normal'">
                <span v-if="scope.row.type == '1'">{{ $t('37f26730.443aa4') }}</span>
                <span v-else>{{ $t('37f26730.e7978e') }}</span>
              </span>
              <span v-if="scope.row.order_class == 'groups'">{{ $t('37f26730.9b251e') }}</span>
              <span v-if="scope.row.order_class == 'seckill'">{{ $t('37f26730.ee8bc9') }}</span>
              <span v-if="scope.row.order_class == 'community'">{{ $t('37f26730.1ad244') }}</span>
              <span v-if="scope.row.order_class == 'shopguide'">{{ $t('37f26730.7762db') }}</span>
              <span v-if="scope.row.order_class == 'bargain'">{{ $t('37f26730.94b1e6') }}</span>
              <span v-if="scope.row.order_class == 'excard'">{{ $t('37f26730.8e09cc') }}</span>
            </template>
          </el-table-column>
        </template>
        <el-table-column width="100" prop="order_status" :label="$t('37f26730.86f6cf')">
          <template slot-scope="scope">
            <template v-if="scope.row.receipt_type == 'dada'">
              <span v-if="scope.row.order_status == 'NOTPAY'">{{ $t('37f26730.9246fe') }}</span>
              <span v-if="scope.row.order_status == 'NOTPAY'">{{ $t('37f26730.9246fe') }}</span>
              <span v-if="scope.row.order_status_des == 'CANCEL'">{{ $t('37f26730.2111cc') }}</span>
              <span v-if="scope.row.order_status_des == 'CLOSED'">{{
                scope.row.order_status_msg
              }}</span>
              <span v-if="scope.row.order_status == 'DONE'">{{ $t('37f26730.fad522') }}</span>
              <template
                v-if="
                  scope.row.order_status != 'CANCEL' &&
                  scope.row.order_status != 'REFUND_SUCCESS' &&
                  scope.row.order_status != 'WAIT_GROUPS_SUCCESS'
                "
              >
                <span v-if="scope.row.cancel_status == 'WAIT_PROCESS'">{{
                  $t('37f26730.57a640')
                }}</span>
              </template>
              <span v-if="scope.row.pay_status == 'PAYED' && scope.row.dada.dada_status == '0'">{{
                $t('37f26730.10afb8')
              }}</span>
              <span v-if="scope.row.pay_status == 'PAYED' && scope.row.dada.dada_status == '1'">{{
                $t('37f26730.47eacd')
              }}</span>
              <span v-if="scope.row.pay_status == 'PAYED' && scope.row.dada.dada_status == '2'">{{
                $t('37f26730.186671')
              }}</span>
              <span v-if="scope.row.pay_status == 'PAYED' && scope.row.dada.dada_status == '100'">{{
                $t('37f26730.b5b1a5')
              }}</span>
              <span v-if="scope.row.pay_status == 'PAYED' && scope.row.dada.dada_status == '3'">{{
                $t('37f26730.739c91')
              }}</span>
              <span v-if="scope.row.pay_status == 'PAYED' && scope.row.dada.dada_status == '9'">{{
                $t('37f26730.ed23e1')
              }}</span>
              <span v-if="scope.row.pay_status == 'PAYED' && scope.row.dada.dada_status == '10'">{{
                $t('37f26730.a40b85')
              }}</span>
            </template>
            <template v-if="scope.row.receipt_type != 'dada'">
              <span v-if="scope.row.order_status == 'PAYED'">{{ $t('37f26730.8d02a5') }}</span>
              <span v-if="scope.row.order_status == 'NOTPAY'">{{ $t('37f26730.608afd') }}</span>
              <span v-if="scope.row.order_status_des == 'CANCEL'">{{ $t('37f26730.2111cc') }}</span>
              <span v-if="scope.row.order_status_des == 'CLOSED'">{{
                scope.row.order_status_msg
              }}</span>
              <span v-if="scope.row.order_status == 'WAIT_BUYER_CONFIRM'">{{
                $t('37f26730.4933ca')
              }}</span>
              <span v-if="scope.row.order_status == 'REFUND_SUCCESS'">{{
                $t('37f26730.e85018')
              }}</span>
              <span v-if="scope.row.order_status == 'WAIT_GROUPS_SUCCESS'">{{
                $t('37f26730.425a40')
              }}</span>
              <span v-if="scope.row.order_status == 'DONE'">{{ $t('37f26730.fad522') }}</span>
              <template
                v-if="
                  scope.row.order_status != 'CANCEL' &&
                  scope.row.order_status != 'REFUND_SUCCESS' &&
                  scope.row.order_status != 'WAIT_GROUPS_SUCCESS'
                "
              >
                <span v-if="scope.row.cancel_status == 'WAIT_PROCESS'">{{
                  $t('37f26730.57a640')
                }}</span>
                <span v-if="scope.row.delivery_status == 'PARTAIL'">{{
                  $t('37f26730.5296ac')
                }}</span>
                <span
                  v-if="scope.row.receipt_type == 'ziti' && scope.row.ziti_status == 'PENDING'"
                  >{{ $t('37f26730.25d532') }}</span
                >
                <span
                  v-if="
                    scope.row.receipt_type == 'logistics' && scope.row.delivery_status == 'PENDING'
                  "
                  >{{ $t('37f26730.d8476e') }}</span
                >
              </template>
            </template>
          </template>
        </el-table-column>
        <el-table-column width="80" :label="$t('37f26730.edfe4c')">
          <template slot-scope="scope">
            <span v-if="scope.row.receipt_type == 'logistics'">{{ $t('37f26730.249bfe') }}</span>
            <span v-if="scope.row.receipt_type == 'ziti'">{{ $t('37f26730.b30d27') }}</span>
            <span v-if="scope.row.receipt_type == 'dada'">{{ $t('37f26730.583dcd') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="$store.getters.login_type != 'merchant'"
          width="120"
          :label="$t('37f26730.1517c7')"
        >
          <template slot-scope="scope">
            <template v-if="scope.row.type == 1">
              <span v-if="scope.row.audit_status == 'approved'">{{ $t('37f26730.871a30') }}</span>
              <span v-if="scope.row.audit_status == 'processing'">{{ $t('37f26730.b720a6') }}</span>
              <span v-if="scope.row.audit_status == 'rejected'">{{ $t('37f26730.fe3661') }}</span>
            </template>
            <template v-else> - </template>
          </template>
        </el-table-column>

        <el-table-column prop="source_name" :label="$t('37f26730.26ca20')" />

        <!-- <el-table-column
          width="120"
          label="快递公司"
          prop="delivery_corp"
        ></el-table-column> -->

        <el-table-column width="200" :label="$t('37f26730.2b6bc0')">
          <template slot-scope="scope">
            <el-button type="text">
              <router-link
                :to="{
                  path: matchRoutePath('detail'),
                  query: { orderId: scope.row.order_id, resource: $route.path }
                }"
              >
                {{ $t('37f26730.f26225') }}
              </router-link>
            </el-button>
            <!-- 非同城配的取消订单按钮 -->
            <template
              v-if="scope.row.distributor_id == '0' || $store.getters.login_type == 'distributor'"
            >
              <el-button
                v-if="
                  (VERSION_STANDARD() || is_distributor || scope.row.distributor_id == 0) &&
                  scope.row.receipt_type != 'dada' &&
                  scope.row.cancel_status == 'NO_APPLY_CANCEL' &&
                  (scope.row.order_status == 'NOTPAY' || scope.row.order_status == 'PAYED') &&
                  scope.row.ziti_status != 'DONE'
                "
                type="text"
                :size="size"
                @click="cancelOrderAction(scope.row.order_id)"
              >
                {{ $t('37f26730.b21b5e') }}
              </el-button>
              <el-button
                v-if="
                  (VERSION_STANDARD() || is_distributor || scope.row.distributor_id == 0) &&
                  scope.row.receipt_type == 'dada' &&
                  scope.row.cancel_status == 'NO_APPLY_CANCEL' &&
                  (scope.row.order_status == 'NOTPAY' || scope.row.order_status == 'PAYED') &&
                  scope.row.ziti_status != 'DONE' &&
                  (scope.row.dada.dada_status == '0' || scope.row.dada.dada_status == '1')
                "
                type="text"
                :size="size"
                @click="cancelOrderAction(scope.row.order_id)"
              >
                {{ $t('37f26730.b21b5e') }}
              </el-button>
              <el-button type="text">
                <router-link
                  :to="{
                    path: matchRoutePath('process'),
                    query: { orderId: scope.row.order_id, resource: $route.path }
                  }"
                >
                  {{ $t('37f26730.456d29') }}
                </router-link>
              </el-button>
              <el-button
                v-if="
                  (VERSION_STANDARD() || is_distributor || scope.row.distributor_id == 0) &&
                  scope.row.order_status == 'PAYED' &&
                  scope.row.receipt_type == 'ziti' &&
                  scope.row.ziti_status == 'PENDING'
                "
                :size="size"
                type="text"
                @click="writeoffOrderAction(scope.row.order_id)"
              >
                {{ $t('37f26730.e7d31e') }}
              </el-button>
              <el-button
                v-if="
                  (VERSION_STANDARD() || is_distributor || scope.row.distributor_id == 0) &&
                  scope.row.receipt_type == 'dada' &&
                  (scope.row.cancel_status == 'NO_APPLY_CANCEL' ||
                    scope.row.cancel_status == 'FAILS') &&
                  scope.row.order_status == 'PAYED' &&
                  scope.row.delivery_status != 'DONE' &&
                  scope.row.dada.dada_status == '0'
                "
                type="text"
                :size="size"
                @click="businessReceiptAction(scope.row)"
              >
                {{ $t('37f26730.7d4577') }}
              </el-button>

              <el-button
                v-if="
                  (VERSION_STANDARD() || is_distributor || scope.row.distributor_id == 0) &&
                  scope.row.receipt_type == 'dada' &&
                  scope.row.pay_status == 'PAYED' &&
                  scope.row.dada.dada_status == '9'
                "
                type="text"
                :size="size"
                @click="confirmBack(scope.row)"
              >
                {{ $t('37f26730.f1557d') }}
              </el-button>

              <template
                v-if="
                  !IsBind && (VERSION_STANDARD() || is_distributor || scope.row.distributor_id == 0)
                "
              >
                <el-button
                  v-if="
                    (scope.row.receipt_type == 'logistics' || scope.row.is_logistics) &&
                    scope.row.receipt_type != 'dada' &&
                    scope.row.order_status == 'PAYED' &&
                    scope.row.delivery_status != 'DONE' &&
                    scope.row.receipt_type != 'ziti'
                  "
                  type="text"
                  :size="size"
                  @click="deliveryAction(scope.row)"
                >
                  {{ $t('37f26730.045315') }}
                </el-button>

                <el-button
                  v-if="
                    scope.row.cancel_status == 'WAIT_PROCESS' && scope.row.order_status == 'PAYED'
                  "
                  :size="size"
                  type="text"
                  @click="confirmCancelOrderAction(scope.row.order_id)"
                >
                  {{ $t('37f26730.44c198') }}
                </el-button>
              </template>
              <el-button
                v-if="scope.row.is_invoiced == '0' && scope.row.invoice"
                type="text"
                :size="size"
                @click="IsInvoiced(scope.row, 1)"
              >
                {{ $t('37f26730.963609') }}
              </el-button>

              <el-button type="text" :size="size" @click="clickShowRemark(scope.row, 'normalList')">
                {{ $t('37f26730.2432b5') }}
              </el-button>
            </template>
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
    <RemarkModal ref="modalRef" @onDone="handleRemarksDone" />
  </div>
</template>

<script>
import store from '@/store'
import RemarkModal from '@/components/remarkModal'
import remarkMixin from '@/mixins/remarkMixin'
import { mapGetters } from 'vuex'
import {
  isInvoiced,
  getCancelOrderInfo,
  getOrderDetail,
  getLogisticsList,
  isBind,
  doBusinessReceipt,
  confirmBack,
  getWriteoff
} from '@/api/trade'

export default {
  components: {
    RemarkModal
  },
  mixins: [remarkMixin],
  props: ['selectItemType', 'params', 'list', 'total_count', 'loading', 'size', 'dataPass'],
  data() {
    return {
      IsBind: false,
      is_distributor: false,
      activeName: 'all',
      order_status_list: [
        { name: this.$t('37f26730.a8b0c2'), value: 'all' },
        { name: this.$t('37f26730.9246fe'), value: 'notpay' },
        { name: this.$t('37f26730.d8476e'), value: 'notship' },
        { name: this.$t('37f26730.4933ca'), value: 'shipping' },
        { name: this.$t('37f26730.6b715b'), value: 'cancelapply' },
        { name: this.$t('37f26730.25d532'), value: 'ziti' },
        { name: this.$t('37f26730.2111cc'), value: 'cancel' },
        { name: this.$t('37f26730.fad522'), value: 'finish' },
        { name: this.$t('37f26730.1ef6f1'), value: 'dada_0' },
        { name: this.$t('37f26730.f8c921'), value: 'dada_1' },
        { name: this.$t('37f26730.186671'), value: 'dada_2' },
        { name: this.$t('37f26730.b5b1a5'), value: 'dada_100' },
        { name: this.$t('37f26730.739c91'), value: 'dada_3' },
        { name: this.$t('37f26730.ed23e1'), value: 'dada_9' }
      ]
    }
  },
  computed: {
    ...mapGetters(['isMicorMall'])
  },
  mounted() {
    if (store.getters.login_type === 'distributor') {
      this.is_distributor = true
    }
    this.getStatus()
  },
  methods: {
    onCopy() {
      this.$notify({
        message: this.$t('37f26730.20a495'),
        type: 'success'
      })
    },
    getStatus() {
      isBind().then((response) => {
        this.IsBind = response.data.data.result
      })
    },
    writeoffOrderAction(order_id) {
      //自提订单核销
      getWriteoff(order_id).then((response) => {
        let writeoffOrderData = response.data.data
        if (writeoffOrderData.ziti_status == 'DONE') {
          this.$message.error(this.$t('37f26730.c9045d'))
          return false
        }
        this.$emit('onChangeData', 'writeoffOrderData', writeoffOrderData)
        this.$emit('onChangeData', 'writeoffOrderVisible', true)
      })
      this.$emit('onChangeData', 'writeoffOrderForm', { order_id })
    },
    confirmBack(row) {
      this.$confirm(this.$t('37f26730.f1557d'), this.$t('37f26730.df2e45'), {
        confirmButtonText: this.$t('37f26730.38cf16'),
        cancelButtonText: this.$t('37f26730.625fb2'),
        type: 'warning'
      })
        .then(() => {
          confirmBack(row.order_id).then((response) => {
            this.$message({
              message: this.$t('37f26730.2ab3ab'),
              type: 'success',
              duration: 2 * 1000
            }),
              this.$emit('refreshList')
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('37f26730.2111cc')
          })
        })
    },
    businessReceiptAction(row) {
      this.$confirm(this.$t('37f26730.f3e80d'), this.$t('37f26730.c1b226'), {
        confirmButtonText: this.$t('37f26730.38cf16'),
        cancelButtonText: this.$t('37f26730.625fb2'),
        type: 'warning'
      })
        .then(() => {
          doBusinessReceipt(row.order_id).then((response) => {
            this.$message({
              message: this.$t('37f26730.740ca1'),
              type: 'success',
              duration: 2 * 1000
            }),
              this.$emit('refreshList')
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('37f26730.2111cc')
          }),
            this.$emit('refreshList')
        })
    },
    handleCurrentChange(page_num) {
      this.$emit('onChangeData', 'params', { page: page_num })
    },
    handleSizeChange(pageSize) {
      this.$emit('onChangeData', 'params', { pageSize })
    },
    deliveryAction(data) {
      console.log('deliveryAction', data)
      // 编辑物料弹框
      let order_id = data.order_id
      let selectItemType = data.delivery_type
      this.$emit('onChangeData', 'selectItemType', selectItemType)

      getLogisticsList().then((res) => {
        this.dlycorps = res.data.data.list
        this.$emit('onChangeData', 'dlycorps', res.data.data.list)
      })
      getOrderDetail(order_id).then((response) => {
        let deliveryData = response.data.data
        this.$emit('onChangeData', 'deliveryData', deliveryData)
        if (deliveryData.orderInfo.cancel_status == 'WAIT_PROCESS') {
          this.$message.error(this.$t('37f26730.e406db'))
          return false
        }
        if (selectItemType == 'old') {
          this.$emit('onChangeData', 'deliveryVisible', true)
        } else {
          this.$emit('onChangeData', 'deliveryVisibleNew', true)
        }
        if (deliveryData && deliveryData.orderInfo.delivery_status == 'PARTAIL') {
          this.$emit('onChangeData', 'IsDisabled', true)
          this.$emit('onChangeData', 'deliveryInfo', { delivery_type: 'sep' })
        }
      })
      this.$emit('onChangeData', 'deliveryInfo', { order_id })
    },
    handleClick(tab) {
      this.$emit('onChangeData', 'params', {
        order_status: tab.name == 'all' ? '' : tab.name,
        page: 1
      })
      this.activeName = tab.name
    },
    IsInvoiced(row, status) {
      if (!row.invoice) {
        this.$message({
          type: 'info',
          message: this.$t('37f26730.df2bb8')
        })
        return
      }
      this.$confirm(this.$t('37f26730.23d4a7'), this.$t('37f26730.02d981'), {
        cancelButtonText: this.$t('9ebd763b.625fb2'),
        confirmButtonText: this.$t('9ebd763b.38cf16'),
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
                  message: this.$t('37f26730.ee73ff')
                })
                this.$emit('refreshList')
              } else {
                this.$message({
                  type: 'error',
                  message: this.$t('37f26730.34b438')
                })
              }
            })
          }
          done()
        }
      })
    },
    confirmCancelOrderAction(order_id) {
      // 已支付订单的取消订单审核
      let params = { order_type: 'normal' }
      getCancelOrderInfo(order_id, params).then((response) => {
        this.$emit('onChangeData', 'cancelVisible', true)
        this.$emit('onChangeData', 'cancelData', response.data.data)
      })
      this.$emit('onChangeData', 'cancelInfo', { order_id })
    },
    cancelOrderAction(order_id) {
      //取消订单
      getOrderDetail(order_id).then((response) => {
        let cancelOrderData = response.data.data
        if (cancelOrderData.orderInfo.cancel_status == 'SUCCESS') {
          this.$message.error(this.$t('8906cb64.8f8a2c'))
          return false
        }
        this.$emit('onChangeData', 'cancelOrderData', cancelOrderData)
        this.$emit('onChangeData', 'cancelOrderVisible', true)
      })
      this.$emit('onChangeData', 'cancelOrderInfo', { order_id })
    }
  }
}
</script>

<style></style>
