<template>
  <div>
    <div class="content-bottom-padded">
      <el-alert
        type="info"
        title="下载提示"
        show-icon
      >
        <div>已经生成的文件只保留一天，请及时下载</div>
      </el-alert>
    </div>
    <el-tabs
      v-model="activeName"
      type="border-card"
      @tab-click="handleClick"
    >
      <template v-if="$store.getters.login_type == 'dealer'">
        <el-tab-pane
          label="分账导出"
          name="adapay_tradedata"
        />
      </template>
      <template v-else-if="$store.getters.login_type == 'merchant'">
        <el-tab-pane
          label="主订单导出"
          name="normal_master_order"
        />
        <el-tab-pane
          label="子订单导出"
          name="normal_order"
        />
        <el-tab-pane
          label="待开票订单导出"
          name="invoice"
        />
        <el-tab-pane
          label="售后列表导出"
          name="aftersale_record_count"
        />
        <el-tab-pane
          label="交易单导出"
          name="tradedata"
        />
        <el-tab-pane
          label="退款单导出"
          name="refund_record_count"
        />
        <el-tab-pane
          label="商品统计导出"
          name="goods_data"
        />
      </template>
      <template v-else>
        <el-tab-pane
          label="会员导出"
          name="member"
        />
        <el-tab-pane
          label="服务订单导出"
          name="service_order"
        />
        <el-tab-pane
          label="实体主订单导出"
          name="normal_master_order"
        />
        <el-tab-pane
          label="实体子订单导出"
          name="normal_order"
        />
        <el-tab-pane
          label="发票信息导出"
          name="invoice"
        />
        <el-tab-pane
          label="药品需求单"
          name="drug_order"
        />
        <el-tab-pane
          label="商品统计导出"
          name="goods_data"
        />
        <el-tab-pane
          label="商品导出"
          name="items"
        />
        <el-tab-pane
          label="商品标签导出"
          name="normal_items_tag"
        />
        <el-tab-pane
          label="店铺商品导出"
          name="distributor_items"
        />
        <el-tab-pane
          label="积分商品导出"
          name="pointsmallitems"
        />
        <el-tab-pane
          label="权益导出"
          name="right"
        />
        <el-tab-pane
          label="权益核销记录导出"
          name="right_consume"
        />
        <el-tab-pane
          label="交易单导出"
          name="tradedata"
        />
        <el-tab-pane
          label="社区团购-积分提现记录导出"
          name="community_withdraw"
        />
        <el-tab-pane
          label="报名导出"
          name="selform_registration_record"
        />
        <el-tab-pane
          label="售后列表导出"
          name="aftersale_record_count"
        />
        <el-tab-pane
          label="退款单列表导出"
          name="refund_record_count"
        />
        <el-tab-pane
          label="推广员业绩导出"
          name="popularize"
        />
        <el-tab-pane
          label="财务售后单导出"
          name="aftersale_financial"
        />
        <el-tab-pane
          label="财务销售报表导出"
          name="salesreport_financial"
        />
        <el-tab-pane
          label="交易统计导出"
          name="hfpay_trade_record"
        />
        <el-tab-pane
          label="分账统计导出"
          name="hfpay_order_record"
        />
        <el-tab-pane
          label="提现记录导出"
          name="hfpay_withdraw_record"
        />
        <el-tab-pane
          label="分账导出"
          name="adapay_tradedata"
        />
        <el-tab-pane
          label="商品码导出"
          name="itemcode"
        />
      </template>

      <el-table
        v-loading="loading"
        :data="exportLogLists"
        :height="wheight - 220"
      >
        <el-table-column
          prop="log_id"
          label="ID"
          width="80"
        />
        <el-table-column
          prop="file_name"
          label="文件名称"
        />
        <el-table-column
          prop="finish_date"
          label="处理完成时间"
          width="160"
        />
        <el-table-column
          prop="handle_status"
          label="处理状态"
          width="80"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.handle_status == 'wait'">等待处理</span>
            <span v-if="scope.row.handle_status == 'finish'">处理完成</span>
            <span v-if="scope.row.handle_status == 'processing'">处理中</span>
            <span v-if="scope.row.handle_status == 'fail'">处理失败</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="150"
          fixed="right"
        >
          <template slot-scope="scope">
            <a
              href=" "
              @click.prevent="handleDown(scope.row)"
            >下载</a>
          </template>
        </el-table-column>
      </el-table>
      <div
        v-if="total_count > params.pageSize"
        class="content-center content-top-padded"
      >
        <el-pagination
          background
          layout="prev, pager, next, total"
          :current-page.sync="params.page"
          :total="total_count"
          :page-size="params.pageSize"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-tabs>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import { ExportLogList, ExportLogFileDown } from '../../../api/trade'
export default {
  props: ['getStatus'],
  data () {
    return {
      // activeName: this.$store.getters.login_type == 'dealer' ? 'adapay_tradedata' : 'member',
      activeName: '',
      create_time: '',
      exportLogLists: [],
      loading: false,
      total_count: 0,
      params: {
        page: 1,
        pageSize: 20,
        export_type: '',
        time_start_begin: '',
        time_start_end: ''
      }
    }
  },
  mounted () {
    this.activeTabHandler()
    this.getExportLogLists(this.params)
  },

  computed: {
    ...mapGetters(['wheight'])
  },
  methods: {
    activeTabHandler () {
      const active = this.$store.getters.login_type
      const { tab } = this.$route.query
      if (tab) {
        this.activeName = tab
      } else {
        if (active == 'dealer') {
          this.activeName = 'adapay_tradedata'
        } else if (active == 'merchant') {
          this.activeName = 'normal_master_order'
        } else {
          this.activeName = 'member'
        }
      }
    },
    // 切换tab
    handleClick (tab, event) {
      this.activeName = tab.name
      this.params.page = 1
      this.getExportLogLists(this.params)
    },
    handleCurrentChange (page_num) {
      this.params.page = page_num
      this.getExportLogLists(this.params)
    },
    dataSearch () {
      this.params.page = 1
      this.getExportLogLists(this.params)
    },
    getExportLogLists (params) {
      this.loading = true
      params.export_type = this.activeName
      ExportLogList(params).then((response) => {
        this.exportLogLists = response.data.data.list
        this.total_count = response.data.data.total_count
        this.loading = false
      })
    },
    dateChange (val) {
      if (val && val.length > 0) {
        this.params.start_time = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
        this.params.end_time = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
      } else {
        this.params.start_time = ''
        this.params.end_time = ''
      }
      this.params.page = 1
      this.getExportLogLists(this.params)
    },
    dateStrToTimeStamp (str) {
      return Date.parse(new Date(str)) / 1000
    },
    handleDown ({ log_id, file_url }) {
      if (this.activeName == 'itemcode') {
        window.open(file_url)
        return
      }

      ExportLogFileDown({ 'log_id': log_id }).then((response) => {
        const url = this.genUrl(response.data.data.csv_data, {}) //{}指的是表头，response.data.data.csv_data是后台返回来的数据
        const a = document.createElement('a')
        a.href = url
        a.download = response.data.data.file_name
        a.click()
        window.URL.revokeObjectURL(url)
      })
    },
    genUrl (encoded, options) {
      const dataBlob = new Blob([`\ufeff${encoded}`], { type: 'text/plain;charset=utf-8' }) //返回的格式
      return window.URL.createObjectURL(dataBlob)
    }
  },
  watch: {
    getStatus (val) {
      if (val) {
        this.getExportLogLists(this.params)
      }
    }
  }
}
</script>
<style scoped lang="scss">
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
  min-height: 10px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.text-muted {
  color: #999;
}
</style>
