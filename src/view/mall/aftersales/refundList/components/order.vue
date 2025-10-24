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
<style scoped lang="scss">
.sp-filter-form {
  margin-bottom: 16px;
}
</style>

<template>
  <div class="page-body">
    <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onReset">
      <SpFilterFormItem prop="distributor" label="店铺名称:">
        <el-autocomplete
          v-model="params.distributor.name"
          :fetch-suggestions="queryStoreSearch"
          placeholder="请输入店铺名称"
          @select="handleSelectStore"
        />
      </SpFilterFormItem>
      <SpFilterFormItem prop="refund_bn" label="退款单号:">
        <el-input v-model="params.refund_bn" placeholder="退款单号" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="order_id" label="订单号:">
        <el-input v-model="params.order_id" placeholder="订单号" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="mobile" label="手机号:">
        <el-input v-model="params.mobile" placeholder="手机号" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="refund_type" label="退款类型:">
        <el-select v-model="params.refund_type" placeholder="退款类型">
          <el-option
            v-for="(item, index) in refundTypeList"
            :key="index"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </SpFilterFormItem>
      <SpFilterFormItem prop="refund_channel" label="退款方式:">
        <el-select v-model="params.refund_channel" placeholder="退款方式">
          <el-option
            v-for="(item, index) in refundChannelList"
            :key="index"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </SpFilterFormItem>
      <SpFilterFormItem prop="refund_status" label="退款状态:">
        <el-select v-model="params.refund_status" placeholder="退款状态">
          <el-option
            v-for="(item, index) in refundsStatusList"
            :key="index"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </SpFilterFormItem>
      <SpFilterFormItem prop="create_time" label="日期范围:">
        <el-date-picker
          v-model="params.create_time"
          type="daterange"
          value-format="yyyy/MM/dd"
          placeholder="选择日期范围"
        />
      </SpFilterFormItem>
    </SpFilterForm>

    <div class="action-container">
      <el-button type="primary" plain @click="exportData"> 导出 </el-button>
    </div>

    <el-form ref="form" label-width="100px">
      <el-table v-loading="loading" border :data="tableList" element-loading-text="数据加载中">
        <el-table-column prop="refund_bn" min-width="220" label="退款单号">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.refund_type == '0'" effect="plain" type="warning" size="mini">
              售后
            </el-tag>
            <el-tag v-else-if="scope.row.refund_type == '1'" effect="plain" size="mini">
              售前
            </el-tag>
            <el-tag
              v-else-if="scope.row.refund_type == '2'"
              effect="plain"
              type="danger"
              size="mini"
            >
              拒单
            </el-tag>
            <div>
              <router-link
                target="_blank"
                :to="{
                  path: matchRoutePath('detail'),
                  query: { refund_bn: scope.row.refund_bn }
                }"
              >
                {{ scope.row.refund_bn }}
              </router-link>
              <el-tooltip effect="dark" content="复制" placement="top-start">
                <i
                  v-clipboard:copy="scope.row.refund_bn"
                  v-clipboard:success="onCopySuccess"
                  class="el-icon-document-copy"
                />
              </el-tooltip>
            </div>
            <div v-if="scope.row.distributor_id !== '0'" class="order-store">
              <el-tooltip effect="dark" content="店铺名" placement="top-start">
                <i class="el-icon-office-building" />
              </el-tooltip>
              {{ scope.row.distributor_info.name }}
            </div>
            <div class="order-time">
              <el-tooltip effect="dark" content="退款申请时间" placement="top-start">
                <i class="el-icon-time" />
              </el-tooltip>
              {{ scope.row.create_time | datetime('YYYY-MM-DD HH:mm:ss') }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="aftersales_bn" width="180" label="售后单号">
          <template slot-scope="scope">
            <div>
              <router-link
                target="_blank"
                :to="{
                  path:
                    (`${$store.getters.login_type}` == 'distributor' &&
                      '/shopadmin/order/aftersaleslist/detail') ||
                    (`${$store.getters.login_type}` == 'merchant' &&
                      '/merchant/order/aftersaleslist/detail') ||
                    '/order/aftersales/aftersaleslist/detail',

                  query: { aftersales_bn: scope.row.aftersales_bn }
                }"
              >
                {{ scope.row.aftersales_bn }}
              </router-link>
              <el-tooltip
                v-if="scope.row.aftersales_bn"
                effect="dark"
                content="复制"
                placement="top-start"
              >
                <i
                  v-clipboard:copy="scope.row.aftersales_bn"
                  v-clipboard:success="onCopySuccess"
                  class="el-icon-document-copy"
                />
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column min-width="200" label="订单号">
          <template slot-scope="scope">
            <div>
              <router-link
                target="_blank"
                :to="{
                  path:
                    (`${$store.getters.login_type}` == 'distributor' &&
                      '/shopadmin/order/order-manage/order-list/detail') ||
                    (`${$store.getters.login_type}` == 'merchant' &&
                      '/merchant/order/order-manage/order-list/detail') ||
                    '/order/order-manage/order-list/detail',
                  query: { orderId: scope.row.order_id }
                }"
              >
                {{ scope.row.order_id }}
              </router-link>
              <el-tooltip effect="dark" content="复制" placement="top-start">
                <i
                  v-clipboard:copy="scope.row.order_id"
                  v-clipboard:success="onCopySuccess"
                  class="el-icon-document-copy"
                />
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column min-width="200" label="支付方式">
          <template slot-scope="scope">
            <span v-if="scope.row.pay_type == 'wxpay' || scope.row.pay_type == 'adapay'"
              >微信支付</span
            >
            <span v-if="scope.row.pay_type == 'wxpayapp'">微信APP支付</span>
            <span v-if="scope.row.pay_type == 'wxpayh5'">微信H5支付</span>
            <span v-if="scope.row.pay_type == 'wxpaypc'">微信POS支付</span>
            <span v-if="scope.row.pay_type == 'wxpaypos'">微信PC支付</span>
            <span v-if="scope.row.pay_type == 'alipayapp'">支付宝APP支付</span>
            <span v-if="scope.row.pay_type == 'alipay'">支付宝支付</span>
            <span v-if="scope.row.pay_type == 'alipayh5'">支付宝H5支付</span>
            <span v-if="scope.row.pay_type == 'alipaypos'">支付宝POS支付</span>
            <span v-if="scope.row.pay_type == 'deposit'">余额支付</span>
            <span v-if="scope.row.pay_type == 'ebuy'">EBUY支付</span>
            <span v-if="scope.row.pay_type == 'point'">积分支付</span>
            <span v-if="scope.row.pay_type == 'pos'">POS银行卡支付</span>
            <span v-if="scope.row.pay_type == 'hfpay'">汇付支付</span>
            <span v-if="scope.row.pay_type == 'chinaums'">微信支付-银联</span>
            <span v-if="scope.row.pay_type == 'offline_pay'">线下转账</span>
          </template>
        </el-table-column>
        <el-table-column width="180" label="退款金额">
          <template slot-scope="scope">
            <div class="order-num mark">
              <span class="cur">{{ scope.row.cur_fee_symbol }}</span
              >{{ scope.row.refund_fee / 100 }}
            </div>
            <div v-if="scope.row.refund_point" class="order-num mark">
              {{ scope.row.refund_point }}积分
            </div>
            <div v-if="scope.row.refund_success_time" class="order-time">
              <el-tooltip effect="dark" content="退款完成时间" placement="top-start">
                <i class="el-icon-time" />
              </el-tooltip>
              {{ scope.row.refund_success_time | datetime('YYYY-MM-DD HH:mm:ss') }}
            </div>
          </template>
        </el-table-column>
        <el-table-column width="180" label="退运费">
          <template slot-scope="scope"> ￥{{ scope.row.freight / 100 }} </template>
        </el-table-column>

        <!-- 退款方式 -->
        <el-table-column prop="refund_channel" width="80" label="退款方式">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.refund_channel == 'offline'" size="mini"> 线下退款 </el-tag>
            <el-tag v-if="scope.row.refund_channel == 'original'" type="success" size="mini">
              原路返回
            </el-tag>
          </template>
        </el-table-column>
        <!-- 退款状态 -->
        <el-table-column prop="refund_status" width="100" label="退款状态">
          <template slot-scope="scope">
            <!-- 订单状态 -->
            <el-tag v-if="scope.row.refund_status == 'READY'" size="mini" type="info">
              未审核
            </el-tag>
            <el-tag
              v-else-if="scope.row.refund_status == 'AUDIT_SUCCESS'"
              size="mini"
              type="success"
            >
              审核成功待退款
            </el-tag>
            <el-tag v-else-if="scope.row.refund_status == 'SUCCESS'" size="mini" type="success">
              退款成功
            </el-tag>
            <el-tag v-else-if="scope.row.refund_status == 'REFUSE'" size="mini" type="danger">
              退款驳回
            </el-tag>
            <el-tag v-else-if="scope.row.refund_status == 'CANCEL'" size="mini" type="info">
              撤销退款
            </el-tag>
            <el-tag v-else-if="scope.row.refund_status == 'PROCESSING'" size="mini" type="success">
              已发起退款等待到账
            </el-tag>
            <el-tag v-else-if="scope.row.refund_status == 'CHANGE'" size="mini" type="danger">
              退款异常
            </el-tag>
            <el-tag v-if="scope.row.refund_status == 'REFUNDCLOSE'" type="info" size="mini">
              退款关闭
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <router-link
              :to="{
                path: matchRoutePath('detail'),
                query: { refund_bn: scope.row.refund_bn }
              }"
            >
              详情
            </router-link>
            <el-button
              v-if="
                scope.row.refund_status == 'AUDIT_SUCCESS' && scope.row.refund_channel == 'offline'
              "
              style="color: #459ae9"
              type="text"
              @click="() => handleRefund(scope.row)"
            >
              确认退款
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="page.total > page.pageSize" class="mt-4 text-right">
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
    </el-form>

    <SpDialog
      ref="refundDialogRef"
      v-model="refundDialog"
      :title="`退款【订单：${refundForm.order_id}】`"
      :confirm-status="refundLoading"
      :form="refundForm"
      :form-list="refundFormList"
      @onSubmit="onrefundSubmit"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { exportRefundList } from '@/api/aftersales'
import mixin, { pageMixin } from '@/mixins'
export default {
  mixins: [mixin, pageMixin],
  data() {
    const initialParams = {
      distributor: {
        id: undefined,
        name: undefined
      },
      create_time: '',
      refund_bn: undefined,
      order_id: undefined,
      mobile: undefined,
      refund_type: undefined,
      refund_channel: undefined,
      refund_status: undefined
    }
    return {
      initialParams,
      params: {
        ...initialParams
      },
      loading: false,
      shopList: [],
      refundTypeList: [
        { name: '全部', value: '' },
        { name: '售后', value: '0' },
        { name: '售前', value: '1' },
        { name: '拒单', value: '2' }
      ],
      refundChannelList: [
        { name: '线下退款', value: 'offline' },
        { name: '原路返回', value: 'original' }
      ],
      refundsStatusList: [
        { name: '全部', value: '' },
        { name: '未审核', value: 'READY' },
        { name: '审核成功待退款', value: 'AUDIT_SUCCESS' },
        { name: '退款成功', value: 'SUCCESS' },
        { name: '退款驳回', value: 'REFUSE' },
        { name: '撤销退款', value: 'CANCEL' },
        { name: '已发起退款等待到账', value: 'PROCESSING' },
        { name: '退款异常', value: 'CHANGE' },
        { name: '退款关闭', value: 'REFUNDCLOSE' }
      ],
      refundDialog: false,
      refundLoading: false,
      refundForm: {
        refund_bn: '',
        bank_account_name: '',
        bank_account_no: '',
        bank_name: '',
        refund_account_name: '',
        refund_account_bank: '',
        refund_account_no: '',
        pay_type: '',
        order_id: '',
        refund_fee: ''
      },
      refundFormList: [
        {
          label: '退款方式',
          key: 'pay_type',
          type: 'radio',
          required: true,
          options: [{ label: 'offline_pay', name: '线下转账' }]
        },
        {
          label: '收款人户名',
          key: 'bank_account_name',
          type: 'input',
          required: true,
          message: '请输入收款人户名'
        },
        {
          label: '收款银行账号',
          key: 'bank_account_no',
          type: 'input',
          required: true,
          message: '请输入银行账号'
        },
        {
          label: '开户银行',
          key: 'bank_name',
          type: 'input',
          required: true,
          message: '请输入开户银行'
        },
        {
          label: '退款人户名',
          key: 'refund_account_name',
          type: 'input',
          required: true,
          message: '请输入退款人户名'
        },
        {
          label: '退款银行账号',
          key: 'refund_account_bank',
          type: 'input',
          required: true,
          message: '请输入退款银行账号'
        },
        {
          label: '退款开户银行',
          key: 'refund_account_no',
          type: 'input',
          required: true,
          message: '请输入退款开户银行'
        },
        {
          label: '退款金额',
          key: 'refund_fee',
          type: 'input',
          disabled: true
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  watch: {
    $route(to, from) {},
    'params.distributor': {
      handler: function (val) {
        if (!val.name && val.id) {
          this.params.distributor = {
            id: undefined,
            name: undefined
          }
        }
      },
      deep: true
    }
  },
  mounted() {
    //获取店铺
    this.getDistributorList()
    this.fetchList()
  },
  methods: {
    handleSelectStore(storeItem) {
      this.params.distributor.id = storeItem.distributor_id
    },
    dateTransfer(val) {
      let time_start_begin = undefined
      let time_start_end = undefined
      if (val.length > 0) {
        time_start_begin = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
        time_start_end = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
      }
      return {
        time_start_begin,
        time_start_end
      }
    },
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    getParams() {
      let params = {
        distributor_id: this.params.distributor.id || undefined,
        ...this.dateTransfer(this.params.create_time),
        refund_bn: this.params.refund_bn || undefined,
        order_id: this.params.order_id || undefined,
        refund_type: this.params.refund_type || undefined,
        mobile: this.params.mobile || undefined,
        refund_channel: this.params.refund_channel || undefined,
        refund_status: this.params.refund_status || undefined
      }
      return params
    },
    onSearch() {
      this.page.pageIndex = 1
      this.$nextTick(() => {
        this.fetchList()
      })
    },
    onReset() {
      this.params = { ...this.initialParams }
      this.params = {
        ...this.params,
        distributor: {
          id: undefined,
          name: undefined
        }
      }
      this.onSearch()
    },
    async fetchList() {
      this.loading = true
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        ...this.getParams()
      }
      const { list, total_count } = await this.$api.aftersales.getRefundsList(params)
      this.tableList = list
      this.page.total = total_count
      this.loading = false
    },
    createFilter(queryString) {
      return restaurant => {
        return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    queryStoreSearch(queryString, cb) {
      var restaurants = this.shopList
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    async exportData() {
      const { status, url, filename } = await exportRefundList({
        ...this.getParams()
      })
      if (status) {
        this.$message({
          type: 'success',
          message: '已加入执行队列，请在设置-导出列表中下载'
        })
        this.$export_open('refund_record_count')
        return
      } else if (url) {
        this.downloadUrl = url
        this.downloadName = filename
        this.downloadView = true
      } else {
        this.$message({
          type: 'error',
          message: '没有相关数据可导出'
        })
      }
    },
    async handleRefund({ order_id, refund_bn, refund_fee }) {
      const { bank_account_name, bank_account_no, bank_name } =
        await this.$api.aftersales.getOfflineInfo({ order_id })
      this.refundForm = {
        order_id,
        refund_bn,
        bank_account_name: '',
        bank_account_no: '',
        bank_name: '',
        refund_account_name: bank_account_name,
        refund_account_bank: bank_account_no,
        refund_account_no: bank_name,
        pay_type: 'offline_pay',
        refund_fee: refund_fee / 100
      }
      this.refundDialog = true
    },
    async onrefundSubmit() {
      this.refundLoading = true
      try {
        await this.$api.aftersales.refundOffline({ ...this.refundForm })
        this.refundLoading = false
        this.refundDialog = false
        this.fetchList()
      } catch (error) {
        this.refundLoading = false
      }
    },
    async getDistributorList() {
      var params = { page: 1, pageSize: 500 }
      const { list } = await this.$api.marketing.getDistributorList(params)
      if (list) {
        list.forEach(row => {
          this.shopList.push({ value: row.name, distributor_id: row.distributor_id })
        })
      }
    }
  }
}
</script>
