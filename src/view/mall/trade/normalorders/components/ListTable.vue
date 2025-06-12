<template>
  <div>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane
        v-for="item in order_status_list"
        :key="item.value"
        :label="item.name"
        :name="item.value"
      />
      <el-table v-loading="loading" :data="list" element-loading-text="数据加载中" :size="size">
        <el-table-column width="200" prop="order_id" label="订单信息">
          <template slot-scope="scope">
            <div class="order-num">
              {{ scope.row.order_id }}
              <el-tooltip effect="dark" content="复制" placement="top-start">
                <i
                  v-clipboard:copy="scope.row.order_id"
                  v-clipboard:success="onCopy"
                  class="el-icon-document-copy"
                />
              </el-tooltip>
            </div>
            <div v-if="scope.row.distributor_id !== '0'" class="order-store">
              <el-tooltip effect="dark" content="店铺名" placement="top-start">
                <i class="el-icon-office-building" />
              </el-tooltip>
              {{ scope.row.distributor_name }}
            </div>
            <div class="order-time">
              <el-tooltip effect="dark" content="下单时间" placement="top-start">
                <i class="el-icon-time" />
              </el-tooltip>
              {{ scope.row.create_time | datetime('YYYY-MM-DD HH:mm:ss') }}
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="total_fee" width="115" label="订单金额（¥）">
          <template slot-scope="scope">
            {{ (scope.row.total_fee / 100).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column width="90" label="运费（¥）">
          <template slot-scope="scope">
            {{ scope.row.freight_fee / 100 }}
          </template>
        </el-table-column>
        <el-table-column prop="mobile" width="120" label="客户手机号">
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
              <el-tooltip v-if="dataPass == 0" effect="dark" content="复制" placement="top-start">
                <i
                  v-clipboard:copy="scope.row.mobile"
                  v-clipboard:success="onCopy"
                  class="el-icon-document-copy"
                />
              </el-tooltip>
            </template>
            <template v-else slot-scope="scope">
              <span>{{ scope.row.mobile }}</span>
              <el-tooltip v-if="dataPass == 0" effect="dark" content="复制" placement="top-start">
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
          <el-table-column v-if="!isMicorMall" width="90" label="订单类型">
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
              <span v-if="scope.row.order_class == 'excard'">兑换订单</span>
            </template>
          </el-table-column>
        </template>
        <el-table-column width="100" prop="order_status" label="订单状态">
          <template slot-scope="scope">
            <!-- 订单状态 -->
            <template v-if="scope.row.receipt_type == 'dada'">
              <span v-if="scope.row.order_status == 'NOTPAY'">待支付</span>
              <span v-if="scope.row.order_status == 'NOTPAY'">待支付</span>
              <span v-if="scope.row.order_status_des == 'CANCEL'">已取消</span>
              <span v-if="scope.row.order_status_des == 'CLOSED'">{{
                scope.row.order_status_msg
              }}</span>
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
              </template>
              <span v-if="scope.row.pay_status == 'PAYED' && scope.row.dada.dada_status == '0'"
                >商家待接单</span
              >
              <span v-if="scope.row.pay_status == 'PAYED' && scope.row.dada.dada_status == '1'"
                >骑士待接单</span
              >
              <span v-if="scope.row.pay_status == 'PAYED' && scope.row.dada.dada_status == '2'"
                >待取货</span
              >
              <span v-if="scope.row.pay_status == 'PAYED' && scope.row.dada.dada_status == '100'"
                >骑士到店</span
              >
              <span v-if="scope.row.pay_status == 'PAYED' && scope.row.dada.dada_status == '3'"
                >配送中</span
              >
              <span v-if="scope.row.pay_status == 'PAYED' && scope.row.dada.dada_status == '9'"
                >未妥投</span
              >
              <span v-if="scope.row.pay_status == 'PAYED' && scope.row.dada.dada_status == '10'"
                >妥投异常</span
              >
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
                <span v-if="scope.row.receipt_type == 'ziti' && scope.row.ziti_status == 'PENDING'"
                  >待自提</span
                >
                <span
                  v-if="
                    scope.row.receipt_type == 'logistics' && scope.row.delivery_status == 'PENDING'
                  "
                  >待发货</span
                >
              </template>
            </template>
          </template>
        </el-table-column>
        <el-table-column width="80" label="配送方式">
          <template slot-scope="scope">
            <span v-if="scope.row.receipt_type == 'logistics'">普通快递</span>
            <span v-if="scope.row.receipt_type == 'ziti'">自提</span>
            <span v-if="scope.row.receipt_type == 'dada'">同城配</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="$store.getters.login_type != 'merchant'"
          width="120"
          label="海关审批状态"
        >
          <template slot-scope="scope">
            <template v-if="scope.row.type == 1">
              <span v-if="scope.row.audit_status == 'approved'">审核通过</span>
              <span v-if="scope.row.audit_status == 'processing'">审核中</span>
              <span v-if="scope.row.audit_status == 'rejected'">审核失败</span>
            </template>
            <template v-else> - </template>
          </template>
        </el-table-column>

        <el-table-column prop="source_name" label="来源" />

        <!-- <el-table-column
          width="120"
          label="快递公司"
          prop="delivery_corp"
        ></el-table-column> -->

        <el-table-column width="200" label="操作">
          <template slot-scope="scope">
            <el-button type="text">
              <router-link
                :to="{
                  path: matchRoutePath('detail'),
                  query: { orderId: scope.row.order_id, resource: $route.path }
                }"
              >
                详情
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
                取消订单
              </el-button>
              <!-- 同城配的取消订单按钮 -->
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
                取消订单
              </el-button>
              <el-button type="text">
                <router-link
                  :to="{
                    path: matchRoutePath('process'),
                    query: { orderId: scope.row.order_id, resource: $route.path }
                  }"
                >
                  日志
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
                核销
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
                接单
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
                确认退回
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
                  发货
                </el-button>

                <el-button
                  v-if="
                    scope.row.cancel_status == 'WAIT_PROCESS' && scope.row.order_status == 'PAYED'
                  "
                  :size="size"
                  type="text"
                  @click="confirmCancelOrderAction(scope.row.order_id)"
                >
                  退款
                </el-button>
              </template>
              <el-button
                v-if="scope.row.is_invoiced == '0' && scope.row.invoice"
                type="text"
                :size="size"
                @click="IsInvoiced(scope.row, 1)"
              >
                待开票
              </el-button>

              <el-button type="text" :size="size" @click="clickShowRemark(scope.row, 'normalList')">
                备注
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
        { name: '全部', value: 'all' },
        { name: '待支付', value: 'notpay' },
        { name: '待发货', value: 'notship' },
        { name: '待收货', value: 'shipping' },
        { name: '待退款', value: 'cancelapply' },
        { name: '待自提', value: 'ziti' },
        { name: '已取消', value: 'cancel' },
        { name: '已完成', value: 'finish' },
        { name: '待接单', value: 'dada_0' },
        { name: '待骑士接单', value: 'dada_1' },
        { name: '待取货', value: 'dada_2' },
        { name: '骑士到店', value: 'dada_100' },
        { name: '配送中', value: 'dada_3' },
        { name: '未妥投', value: 'dada_9' }
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
        message: '复制成功',
        type: 'success'
      })
    },
    getStatus() {
      isBind().then(response => {
        this.IsBind = response.data.data.result
      })
    },
    writeoffOrderAction(order_id) {
      //自提订单核销
      getWriteoff(order_id).then(response => {
        let writeoffOrderData = response.data.data
        if (writeoffOrderData.ziti_status == 'DONE') {
          this.$message.error('该订单已核销!')
          return false
        }
        this.$emit('onChangeData', 'writeoffOrderData', writeoffOrderData)
        this.$emit('onChangeData', 'writeoffOrderVisible', true)
      })
      this.$emit('onChangeData', 'writeoffOrderForm', { order_id })
    },
    confirmBack(row) {
      this.$confirm('确认退回', '确认退回提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          confirmBack(row.order_id).then(response => {
            this.$message({
              message: '退回成功',
              type: 'success',
              duration: 2 * 1000
            }),
              this.$emit('refreshList')
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    businessReceiptAction(row) {
      this.$confirm('请在接单前确认商品当前库存', '接单提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          doBusinessReceipt(row.order_id).then(response => {
            this.$message({
              message: '接单成功',
              type: 'success',
              duration: 2 * 1000
            }),
              this.$emit('refreshList')
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
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

      getLogisticsList().then(res => {
        this.dlycorps = res.data.data.list
        this.$emit('onChangeData', 'dlycorps', res.data.data.list)
      })
      getOrderDetail(order_id).then(response => {
        let deliveryData = response.data.data
        this.$emit('onChangeData', 'deliveryData', deliveryData)
        if (deliveryData.orderInfo.cancel_status == 'WAIT_PROCESS') {
          this.$message.error('客户已经申请退款，请先处理退款操作再决定是否发货!')
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
            isInvoiced(params).then(response => {
              if (response.data.data.success) {
                this.$message({
                  type: 'success',
                  message: '已更新开票状态'
                })
                this.$emit('refreshList')
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
    confirmCancelOrderAction(order_id) {
      // 已支付订单的取消订单审核
      let params = { order_type: 'normal' }
      getCancelOrderInfo(order_id, params).then(response => {
        this.$emit('onChangeData', 'cancelVisible', true)
        this.$emit('onChangeData', 'cancelData', response.data.data)
      })
      this.$emit('onChangeData', 'cancelInfo', { order_id })
    },
    cancelOrderAction(order_id) {
      //取消订单
      getOrderDetail(order_id).then(response => {
        let cancelOrderData = response.data.data
        if (cancelOrderData.orderInfo.cancel_status == 'SUCCESS') {
          this.$message.error('该订单已取消!')
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
