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
        <el-input placeholder="退款单号" v-model="params.refund_bn"> </el-input>
      </SpFilterFormItem>
      <SpFilterFormItem prop="order_id" label="订单号:">
        <el-input placeholder="订单号" v-model="params.order_id"></el-input>
      </SpFilterFormItem>
      <SpFilterFormItem prop="mobile" label="手机号:">
        <el-input placeholder="手机号" v-model="params.mobile"></el-input>
      </SpFilterFormItem>
      <SpFilterFormItem prop="refund_type" label="退款类型:">
        <el-select v-model="params.refund_type" placeholder="退款类型">
          <el-option
            v-for="(item, index) in refundTypeList"
            :key="index"
            :label="item.name"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </SpFilterFormItem>
      <SpFilterFormItem prop="refund_channel" label="退款方式:">
        <el-select v-model="params.refund_channel" placeholder="退款方式">
          <el-option
            v-for="(item, index) in refundChannelList"
            :key="index"
            :label="item.name"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </SpFilterFormItem>
      <SpFilterFormItem prop="refund_status" label="退款状态:">
        <el-select v-model="params.refund_status" placeholder="退款状态">
          <el-option
            v-for="(item, index) in refundsStatusList"
            :key="index"
            :label="item.name"
            :value="item.value"
          >
          </el-option>
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
      <export-tip @exportHandle="exportData">
        <el-button type="primary" plain>导出</el-button>
      </export-tip>
    </div>

    <el-form ref="form" label-width="100px">
      <el-table border :data="tableList" v-loading="loading" element-loading-text="数据加载中">
        <el-table-column prop="refund_bn" min-width="220" label="退款单号">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.refund_type == '0'" effect="plain" type="warning" size="mini"
              >售后</el-tag
            >
            <el-tag v-else-if="scope.row.refund_type == '1'" effect="plain" size="mini"
              >售前</el-tag
            >
            <el-tag
              v-else-if="scope.row.refund_type == '2'"
              effect="plain"
              type="danger"
              size="mini"
              >拒单</el-tag
            >
            <div>
              <router-link
                target="_blank"
                :to="{
                  path: matchHidePage('detail'),
                  query: { refund_bn: scope.row.refund_bn }
                }"
                >{{ scope.row.refund_bn }}</router-link
              >
              <el-tooltip effect="dark" content="复制" placement="top-start">
                <i
                  v-clipboard:copy="scope.row.refund_bn"
                  v-clipboard:success="onCopySuccess"
                  class="el-icon-document-copy"
                ></i>
              </el-tooltip>
            </div>
            <div class="order-time">
              <el-tooltip effect="dark" content="退款申请时间" placement="top-start">
                <i class="el-icon-time"></i>
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
                    (`${$store.getters.login_type}` == 'merchant' &&
                      '/merchant/order/aftersaleslist/detail') ||
                    '/order/entitytrade/aftersaleslist/detail',

                  query: { aftersales_bn: scope.row.aftersales_bn }
                }"
                >{{ scope.row.aftersales_bn }}</router-link
              >
              <el-tooltip
                effect="dark"
                content="复制"
                placement="top-start"
                v-if="scope.row.aftersales_bn"
              >
                <i
                  v-clipboard:copy="scope.row.aftersales_bn"
                  v-clipboard:success="onCopySuccess"
                  class="el-icon-document-copy"
                ></i>
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
                    (`${$store.getters.login_type}` == 'merchant' &&
                      '/merchant/order/tradenormalorders/detail') ||
                    '/order/entitytrade/tradenormalorders/detail',
                  query: { orderId: scope.row.order_id }
                }"
                >{{ scope.row.order_id }}</router-link
              >
              <el-tooltip effect="dark" content="复制" placement="top-start">
                <i
                  v-clipboard:copy="scope.row.order_id"
                  v-clipboard:success="onCopySuccess"
                  class="el-icon-document-copy"
                ></i>
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
          </template>
        </el-table-column>
        <el-table-column width="180" label="退款金额">
          <template slot-scope="scope">
            <div class="order-num mark">
              <span class="cur">{{ scope.row.cur_fee_symbol }}</span
              >{{ scope.row.refund_fee / 100 }}
            </div>
            <div class="order-num mark" v-if="scope.row.refund_point">
              {{ scope.row.refund_point }}积分
            </div>
            <div class="order-time" v-if="scope.row.refund_success_time">
              <el-tooltip effect="dark" content="退款完成时间" placement="top-start">
                <i class="el-icon-time"></i>
              </el-tooltip>
              {{ scope.row.refund_success_time | datetime('YYYY-MM-DD HH:mm:ss') }}
            </div>
          </template>
        </el-table-column>

        <!-- 退款方式 -->
        <el-table-column prop="refund_channel" width="80" label="退款方式">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.refund_channel == 'offline'" size="mini">线下退款</el-tag>
            <el-tag v-if="scope.row.refund_channel == 'original'" type="success" size="mini"
              >原路返回</el-tag
            >
          </template>
        </el-table-column>
        <!-- 退款状态 -->
        <el-table-column prop="refund_status" width="100" label="退款状态">
          <template slot-scope="scope">
            <!-- 订单状态 -->
            <el-tag v-if="scope.row.refund_status == 'READY'" size="mini" type="info" effect="plain"
              >未审核</el-tag
            >
            <el-tag
              v-else-if="scope.row.refund_status == 'AUDIT_SUCCESS'"
              size="mini"
              type="success"
              effect="plain"
              >审核成功待退款</el-tag
            >
            <el-tag
              v-else-if="scope.row.refund_status == 'SUCCESS'"
              size="mini"
              type="success"
              effect="dark"
              >退款成功</el-tag
            >
            <el-tag
              v-else-if="scope.row.refund_status == 'REFUSE'"
              size="mini"
              type="danger"
              effect="dark"
              >退款驳回</el-tag
            >
            <el-tag
              v-else-if="scope.row.refund_status == 'CANCEL'"
              size="mini"
              type="info"
              effect="dark"
              >撤销退款</el-tag
            >
            <el-tag
              v-else-if="scope.row.refund_status == 'PROCESSING'"
              size="mini"
              type="success"
              effect="light"
              >已发起退款等待到账</el-tag
            >
            <el-tag
              v-else-if="scope.row.refund_status == 'CHANGE'"
              size="mini"
              type="danger"
              effect="light"
              >退款异常</el-tag
            >
            <el-tag v-if="scope.row.refund_status == 'REFUNDCLOSE'" type="info" size="mini"
              >退款关闭</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <router-link
              :to="{
                path: matchHidePage('detail'),
                query: { refund_bn: scope.row.refund_bn }
              }"
              >详情</router-link
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="content-padded content-center"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :current-page.sync="page.pageIndex"
        :page-sizes="[10, 20, 50]"
        :total="page.total"
        :page-size="page.pageSize"
       
      >
      </el-pagination>
    </el-form>
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
      shopList:[],
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
      ] 
    }
  },
  computed: {
    ...mapGetters(['wheight'])
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
      this.params={
        ...this.params,
        distributor:{
          id:undefined,
          name:undefined
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
      return (restaurant) => {
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
    async getDistributorList() {
      var params = { page: 1, pageSize: 500 }
      const { list } = await this.$api.marketing.getDistributorList(params)
     if (list) {
        list.forEach((row) => {
          this.shopList.push({ 'value': row.name, 'distributor_id': row.distributor_id })
        })
      }
    }
  },
  mounted() {
    //获取店铺
    this.getDistributorList()
    this.fetchList()
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
  }
}
</script>
