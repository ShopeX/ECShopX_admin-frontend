<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage class="sp-export-log-page">
    <div class="content-bottom-padded">
      <el-alert type="info" :title="$t('cb7af8ae.d42828')" show-icon>
        <div>{{ $t('cb7af8ae.7de565') }}</div>
      </el-alert>
    </div>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <template v-if="$store.getters.login_type == 'dealer'">
        <el-tab-pane
          v-if="!VERSION_SHUYUN()"
          :label="$t('cb7af8ae.355262')"
          name="adapay_tradedata"
        />
      </template>
      <template v-else-if="$store.getters.login_type == 'merchant'">
        <el-tab-pane :label="$t('cb7af8ae.c7af0d')" name="normal_master_order" />
        <el-tab-pane :label="$t('cb7af8ae.97e27a')" name="normal_order" />
        <el-tab-pane :label="$t('cb7af8ae.12f70e')" name="invoice" />
        <el-tab-pane :label="$t('cb7af8ae.f12320')" name="aftersale_record_count" />
        <el-tab-pane :label="$t('cb7af8ae.c67ce6')" name="tradedata" />
        <el-tab-pane :label="$t('cb7af8ae.523cb3')" name="refund_record_count" />
        <el-tab-pane :label="$t('cb7af8ae.d012d9')" name="goods_data" />
        <el-tab-pane :label="$t('cb7af8ae.f83133')" name="items" />
        <el-tab-pane :label="$t('cb7af8ae.9bb27d')" name="normal_items_tag" />
        <el-tab-pane :label="$t('cb7af8ae.480b38')" name="itemcode" />
        <el-tab-pane v-if="!VERSION_SHUYUN()" :label="$t('cb7af8ae.75a79c')" name="statements" />
        <el-tab-pane
          v-if="!VERSION_SHUYUN()"
          :label="$t('cb7af8ae.f7f2df')"
          name="statement_details"
        />
        <el-tab-pane :label="$t('cb7af8ae.d8defc')" name="popularize" />
        <el-tab-pane :label="$t('cb7af8ae.398e76')" name="popularizeStatic" />
        <el-tab-pane :label="$t('cb7af8ae.41356e')" name="export_luckdraw_log" />
        <el-tab-pane :label="$t('cb7af8ae.7d75ec')" name="popularizeOrder" />
        <el-tab-pane :label="$t('cb7af8ae.03c9b1')" name="delivery_staffdata" />
      </template>

      <template v-else>
        <el-tab-pane :label="$t('cb7af8ae.b8338a')" name="bspay_withdraw" />
        <el-tab-pane :label="$t('cb7af8ae.e9cc0a')" name="member" />
        <!-- <el-tab-pane
          label="服务订单导出"
          name="service_order"
          v-if="!VERSION_IN_PURCHASE()"
        /> -->
        <el-tab-pane :label="$t('cb7af8ae.8045f7')" name="normal_master_order" />
        <el-tab-pane :label="$t('cb7af8ae.b8ffd8')" name="normal_order" />
        <el-tab-pane :label="$t('cb7af8ae.daa8e0')" name="normal_community_order" />
        <el-tab-pane v-if="!VERSION_IN_PURCHASE()" :label="$t('cb7af8ae.3c04c9')" name="invoice" />
        <!-- <el-tab-pane
          v-if="!VERSION_IN_PURCHASE()"
          label="药品需求单"
          name="drug_order"
        /> -->
        <el-tab-pane :label="$t('cb7af8ae.d012d9')" name="goods_data" />
        <el-tab-pane :label="$t('cb7af8ae.f83133')" name="items" />
        <el-tab-pane :label="$t('cb7af8ae.e2ace4')" name="supplier_goods" />
        <el-tab-pane :label="$t('cb7af8ae.41356e')" name="export_luckdraw_log" />
        <!-- <el-tab-pane label="商品标签导出" name="normal_items_tag" /> -->
        <el-tab-pane :label="$t('cb7af8ae.1be670')" name="member_point_logs" />
        <el-tab-pane
          v-if="!VERSION_IN_PURCHASE()"
          :label="$t('cb7af8ae.5f46b0')"
          name="distributor_items"
        />
        <el-tab-pane
          v-if="!VERSION_IN_PURCHASE()"
          :label="$t('cb7af8ae.42ff32')"
          name="pointsmallitems"
        />
        <!-- <el-tab-pane
          label="权益导出"
          name="right"
        /> -->
        <!-- <el-tab-pane
          label="权益核销记录导出"
          name="right_consume"
          v-if="!VERSION_IN_PURCHASE()"
        /> -->
        <el-tab-pane label="交易单导出" name="tradedata" />
        <!-- <el-tab-pane
          label="社区团购-积分提现记录导出"
          name="community_withdraw"
          v-if="!VERSION_IN_PURCHASE()"
        /> -->
        <el-tab-pane
          v-if="!VERSION_IN_PURCHASE()"
          :label="$t('cb7af8ae.972304')"
          name="selform_registration_record"
        />
        <el-tab-pane :label="$t('cb7af8ae.75bfab')" name="aftersale_record_count" />
        <el-tab-pane :label="$t('cb7af8ae.ae300f')" name="refund_record_count" />
        <el-tab-pane
          v-if="!VERSION_SHUYUN()"
          :label="$t('cb7af8ae.3f1191')"
          name="chinaums_division"
        />
        <!-- <el-tab-pane label="推广员业绩" name="popularize" />
        <el-tab-pane label="业绩统计" name="popularizeStatic" />
        <el-tab-pane label="业绩订单" name="popularizeOrder" /> -->
        <!-- <el-tab-pane label="财务售后单导出" name="aftersale_financial" /> -->
        <el-tab-pane
          v-if="!VERSION_SHUYUN()"
          :label="$t('cb7af8ae.d5fc54')"
          name="salesreport_financial"
        />
        <el-tab-pane :label="$t('cb7af8ae.c97d08')" name="hfpay_trade_record" />
        <!-- <el-tab-pane
          label="分账统计导出"
          name="hfpay_order_record"
        /> -->
        <el-tab-pane :label="$t('cb7af8ae.b8338a')" name="hfpay_withdraw_record" />
        <el-tab-pane
          v-if="!VERSION_SHUYUN()"
          :label="$t('cb7af8ae.355262')"
          name="adapay_tradedata"
        />
        <el-tab-pane :label="$t('cb7af8ae.480b38')" name="itemcode" />
        <el-tab-pane v-if="!VERSION_SHUYUN()" :label="$t('cb7af8ae.75a79c')" name="statements" />
        <el-tab-pane
          v-if="!VERSION_SHUYUN()"
          :label="$t('cb7af8ae.f7f2df')"
          name="statement_details"
        />
        <el-tab-pane :label="$t('cb7af8ae.443bfc')" name="bspay_tradedata" />
        <el-tab-pane :label="$t('cb7af8ae.03c9b1')" name="delivery_staffdata" />
        <el-tab-pane v-if="IS_SUPPLIER()" :label="$t('cb7af8ae.c7af0d')" name="supplier_order" />
        <el-tab-pane :label="$t('cb7af8ae.e222a6')" name="offline_payment" />
        <el-tab-pane :label="$t('cb7af8ae.d04e78')" name="employee_purchase_employees" />
        <el-tab-pane :label="$t('cb7af8ae.fa1b9f')" name="distributor_white_list" />
      </template>

      <el-tab-pane :label="$t('cb7af8ae.d8defc')" name="popularize" />
      <el-tab-pane :label="$t('cb7af8ae.398e76')" name="popularizeStatic" />
      <el-tab-pane :label="$t('cb7af8ae.7d75ec')" name="popularizeOrder" />

      <el-table v-loading="loading" :data="exportLogLists" :height="wheight - 220">
        <el-table-column :label="$t('cb7af8ae.2b6bc0')">
          <template slot-scope="scope">
            <el-button type="text" @click.prevent="handleDown(scope.row)">
              {{ $t('cb7af8ae.f26ef9') }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="log_id" label="ID" />
        <el-table-column prop="file_name" :label="$t('cb7af8ae.d2e256')" />
        <el-table-column prop="finish_date" :label="$t('cb7af8ae.475dea')" />
        <el-table-column prop="handle_status" :label="$t('cb7af8ae.21b314')">
          <template slot-scope="scope">
            <span v-if="scope.row.handle_status == 'wait'">{{ $t('cb7af8ae.1e57c1') }}</span>
            <span v-if="scope.row.handle_status == 'finish'">{{ $t('cb7af8ae.7be39b') }}</span>
            <span v-if="scope.row.handle_status == 'processing'">{{ $t('cb7af8ae.5d459d') }}</span>
            <span v-if="scope.row.handle_status == 'fail'">{{ $t('cb7af8ae.1012e0') }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="total_count > params.pageSize" class="content-center content-top-padded">
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
  </SpPage>
</template>
<script>
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import { ExportLogList, ExportLogFileDown } from '../../../api/trade'
export default {
  props: ['getStatus'],
  data() {
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
  mounted() {
    this.activeTabHandler()
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  methods: {
    activeTabHandler() {
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

      // 设置完 activeName 后立即获取导出列表
      this.$nextTick(() => {
        this.getExportLogLists(this.params)
      })
    },
    // 切换tab
    handleClick(tab, event) {
      this.activeName = tab.name
      this.params.page = 1
      this.getExportLogLists(this.params)
    },
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getExportLogLists(this.params)
    },
    dataSearch() {
      this.params.page = 1
      this.getExportLogLists(this.params)
    },
    getExportLogLists(params) {
      this.loading = true
      params.export_type = this.activeName
      ExportLogList(params).then((response) => {
        this.exportLogLists = response.data.data.list
        this.total_count = response.data.data.total_count
        this.loading = false
      })
    },
    dateChange(val) {
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
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    handleDown({ log_id, file_url }) {
      if (this.activeName == 'itemcode' || this.activeName == 'normal_community_order') {
        window.open(file_url)
        return
      }

      ExportLogFileDown({ log_id: log_id }).then((response) => {
        const url = this.genUrl(response.data.data.csv_data, {}) //{}指的是表头，response.data.data.csv_data是后台返回来的数据
        const a = document.createElement('a')
        a.href = url
        a.download = response.data.data.file_name
        a.click()
        window.URL.revokeObjectURL(url)
      })
    },
    genUrl(encoded, options) {
      const dataBlob = new Blob([`\ufeff${encoded}`], { type: 'text/plain;charset=utf-8' }) //返回的格式
      return window.URL.createObjectURL(dataBlob)
    }
  },
  watch: {
    getStatus(val) {
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
