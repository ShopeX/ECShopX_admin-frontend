<template>
  <div>
    <div v-if="$route.path.indexOf('detail') === -1">
      <el-row class="filter-header" :gutter="20">
        <el-col>
          <el-select
            v-model="distributor_id"
            clearable
            @change="distributorSelectHandle"
            placeholder="请选择店铺"
          >
            <el-option
              v-for="(item, index) in distributorList"
              :key="index"
              :label="item.name"
              :value="item.distributor_id"
            >
            </el-option>
          </el-select>
          <el-input class="input-m" placeholder="退款单号" v-model="refund_bn">
            <el-button slot="append" icon="el-icon-search" @click="refundBnSearch"></el-button>
          </el-input>
          <el-input class="input-m" placeholder="订单号" v-model="order_id">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
          <el-input class="input-m" placeholder="手机号" v-model="mobile">
            <el-button slot="append" icon="el-icon-search" @click="mobileSearch"></el-button>
          </el-input>
          <el-select
            v-model="refund_type"
            @change="refundTypeSelectHandle"
            placeholder="请选择退款类型"
          >
            <el-option
              v-for="(item, index) in refundTypeList"
              :key="index"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select
            v-model="refund_channel"
            @change="refundChannelSelectHandle"
            placeholder="请选择退款方式"
          >
            <el-option
              v-for="(item, index) in refundChannelList"
              :key="index"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select
            v-model="refund_status"
            @change="refundsStatusSelectHandle"
            placeholder="请选择退款状态"
          >
            <el-option
              v-for="(item, index) in refundsStatusList"
              :key="index"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-date-picker
            v-model="create_time"
            type="daterange"
            value-format="yyyy/MM/dd"
            placeholder="选择日期范围"
            @change="dateChange"
          ></el-date-picker>
          <export-tip @exportHandle='exportData'>
            <el-button type="primary">导出</el-button>
          </export-tip>
          <el-popover
            placement="top-start"
            width="200"
            trigger="hover"
            content="导出任务会以队列执行，点击导出后，请至‘设置-导出列表’页面中查看及下载数据"
          >
            <i class="el-icon-question" slot="reference"></i>
          </el-popover>
        </el-col>
      </el-row>
      <el-card>
        <el-table :data="list" v-loading="loading" element-loading-text="数据加载中">
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
                  :to="{ path: matchHidePage('detail'), query: { refund_bn: scope.row.refund_bn } }"
                  >{{ scope.row.refund_bn }}</router-link
                >
                <el-tooltip effect="dark" content="复制" placement="top-start">
                  <i
                    v-clipboard:copy="scope.row.refund_bn"
                    v-clipboard:success="onCopy"
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
                    path: '/order/entitytrade/aftersaleslist/detail',
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
                    v-clipboard:success="onCopy"
                    class="el-icon-document-copy"
                  ></i>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="tradeId" min-width="180" label="交易单号">
            <template slot-scope="scope">
              <div>
                {{scope.row.tradeInfo.tradeId}}
                <el-tooltip effect="dark" content="复制" placement="top-start">
                  <i v-clipboard:copy="scope.row.tradeInfo.tradeId" v-clipboard:success="onCopy" class="el-icon-document-copy"></i>
                </el-tooltip>
              </div>
            </template>
          </el-table-column> -->
          <el-table-column min-width="200" label="订单号">
            <template slot-scope="scope">
              <div>
                <router-link
                  target="_blank"
                  :to="{
                    path: '/order/entitytrade/tradenormalorders/detail',
                    query: { orderId: scope.row.order_id }
                  }"
                  >{{ scope.row.order_id }}</router-link
                >
                <el-tooltip effect="dark" content="复制" placement="top-start">
                  <i
                    v-clipboard:copy="scope.row.order_id"
                    v-clipboard:success="onCopy"
                    class="el-icon-document-copy"
                  ></i>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column min-width="200" label="支付方式">
            <template slot-scope="scope">
              <span v-if="scope.row.pay_type =='wxpay'|| scope.row.pay_type =='adapay'">微信支付</span>
              <span v-if="scope.row.pay_type =='wxpayapp'">微信APP支付</span>
              <span v-if="scope.row.pay_type =='wxpayh5'">微信H5支付</span>
              <span v-if="scope.row.pay_type =='wxpaypc'">微信POS支付</span>
              <span v-if="scope.row.pay_type =='wxpaypos'">微信PC支付</span>
              <span v-if="scope.row.pay_type =='alipayapp'">支付宝APP支付</span>
              <span v-if="scope.row.pay_type =='alipay'">支付宝支付</span>
              <span v-if="scope.row.pay_type =='alipayh5'">支付宝H5支付</span>
              <span v-if="scope.row.pay_type =='alipaypos'">支付宝POS支付</span>
              <span v-if="scope.row.pay_type =='deposit'">余额支付</span>
              <span v-if="scope.row.pay_type =='ebuy'">EBUY支付</span>
              <span v-if="scope.row.pay_type =='point'">积分支付</span>
              <span v-if="scope.row.pay_type =='pos'">POS银行卡支付</span>
              <span v-if="scope.row.pay_type =='hfpay'">汇付支付</span>
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

          <!-- <el-table-column width="100" label="退款数据">
            <template slot-scope="scope">
              <el-popover placement="left" trigger="click" @show="getRefundOrderInfo(scope.row)">
                <div v-loading="refundloading">
                  <pre>{{ refundOrderInfo }}</pre>
                </div>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="mini">查看数据</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column> -->

          <!-- 退款状态 -->
          <el-table-column prop="refund_status" width="100" label="退款状态">
            <template slot-scope="scope">
              <!-- 订单状态 -->
              <el-tag
                v-if="scope.row.refund_status == 'READY'"
                size="mini"
                type="info"
                effect="plain"
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
                :to="{ path: matchHidePage('detail'), query: { refund_bn: scope.row.refund_bn } }"
                >详情</router-link
              >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="content-padded content-center"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page.sync="params.page"
          :page-sizes="[10, 20, 50]"
          :total="total_count"
          :page-size="params.pageSize"
        >
        </el-pagination>
      </el-card>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getDistributorList } from '../../../api/marketing'
import { getRefundsList, exportRefundList } from '../../../api/aftersales'
import { getRefundOrderInfo } from '../../../api/trade'
export default {
  data() {
    return {
      refundloading: true,
      refundOrderInfo: '',
      currentShop: '',
      loading: false,
      create_time: '',
      params: {
        page: 1,
        pageSize: 20
      },
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
      refund_type: '',
      refund_channel: '',
      refund_status: '',
      aftersales_bn: '',
      refund_bn: '',
      mobile: '',
      time_start_begin: '',
      time_start_end: '',
      total_count: 0,
      list: [],
      order_id: '',
      wxShopsList: [],
      distributor_id: '',
      distributorList: []
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  methods: {
    getRefundOrderInfo(row) {
      this.refundloading = true
      this.refundOrderInfo = ''
      getRefundOrderInfo(row.refund_bn, row.pay_type).then((response) => {
        this.refundOrderInfo = response.data.data
        this.refundloading = false
      })
    },
    onCopy() {
      this.$notify.success({
        message: '复制成功',
        showClose: true
      })
    },
    refundTypeSelectHandle() {
      this.params.refund_type = this.refund_type
      this.params.page = 1
      this.getParams()
      this.getRefundsList(this.params)
    },
    refundChannelSelectHandle() {
      this.params.refund_channel = this.refund_channel
      this.params.page = 1
      this.getParams()
      this.getRefundsList(this.params)
    },
    refundsStatusSelectHandle() {
      this.params.refund_status = this.refund_status
      this.params.page = 1
      this.getParams()
      this.getRefundsList(this.params)
    },
    search(e) {
      this.params.page = 1
      this.getParams()
      this.getRefundsList(this.params)
    },
    refundBnSearch() {
      this.getParams()
      this.getRefundsList(this.params)
    },
    mobileSearch() {
      this.getParams()
      this.getRefundsList(this.params)
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
      this.getRefundsList(this.params)
    },
    handleCurrentChange(val) {
      this.params.page = val
      this.loading = false
      this.getParams()
      this.getRefundsList(this.params)
    },
    handleSizeChange(pageSize) {
      this.loading = false
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getParams()
      this.getRefundsList(this.params)
    },
    getParams() {
      this.params.time_start_begin = this.time_start_begin
      this.params.time_start_end = this.time_start_end
      this.params.order_type = this.order_type
      this.params.aftersales_bn = this.aftersales_bn
      this.params.refund_bn = this.refund_bn
      this.params.order_id = this.order_id
      this.params.mobile = this.mobile
    },
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    getRefundsList(filter) {
      this.loading = true
      getRefundsList(filter).then((response) => {
        this.list = response.data.data.list
        this.total_count = Number(response.data.data.total_count)
        this.loading = false
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
    queryStoreSearch(queryString, cb) {
      var restaurants = this.wxShopsList
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    storeSearch(item) {
      this.params.distributor_id = item.distributor_id
      this.params.page = 1
      this.getParams()
      this.getRefundsList(this.params)
    },
    exportData() {
      this.getParams()
      this.params.page = 1
      exportRefundList(this.params).then((response) => {
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
            message: '没有相关数据可导出'
          })
        }
      })
    },
    distributorSelectHandle() {
      this.params.distributor_id = this.distributor_id
      this.getParams()
      this.params.page = 1
      this.getRefundsList(this.params)
    },
    getDistributor() {
      var params = { page: 1, pageSize: 500 }
      getDistributorList(params).then((response) => {
        if (response.data.data.list) {
          this.distributorList = response.data.data.list
        }
      })
    }
  },
  mounted() {
    this.getDistributor()
    this.getRefundsList(this.params)
  }
}
</script>
