<template>
  <div>
    <div v-if="$route.path.indexOf('detail') === -1">
      <el-row class="filter-header" :gutter="20">
        <el-col>
          <el-date-picker
            class="input-m"
            v-model="create_time"
            type="daterange"
            value-format="yyyy/MM/dd"
            placeholder="选择日期范围"
            @change="dateChange"
          ></el-date-picker>
          <el-input class="input-m" placeholder="订单号" v-model="identifier">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
          <el-input class="input-m" placeholder="售后单号" v-model="AfterSalesOrder">
            <el-button slot="append" icon="el-icon-search" @click="search2"></el-button>
          </el-input>
          <export-tip @exportHandle="exportData">
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
          <el-table-column prop="create_time" width="220" label="售后单">
            <template slot-scope="scope">
              <div class="order-num">
                {{ scope.row.aftersales_bn }}
                <el-tooltip effect="dark" content="复制" placement="top-start">
                  <i
                    v-clipboard:copy="scope.row.aftersales_bn"
                    v-clipboard:success="onCopy"
                    class="el-icon-document-copy"
                  ></i>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column min-width="300" label="订单">
            <template slot-scope="scope">
              <div class="order-num">
                {{ scope.row.order_id }}
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
          <el-table-column min-width="80" label="退款金额">
            <template slot-scope="scope">
              <span>￥{{ scope.row.refund_fee / 100 }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="100" label="退款原因">
            <template slot-scope="scope">
              <span>{{ scope.row.reason }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="300" label="售后描述">
            <template slot-scope="scope">
              <span>{{ scope.row.description }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="content-padded content-center">
          <el-pagination
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
        </div>
      </el-card>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getAftersalesList, exportAftersalesFinancialList } from '../../../../api/aftersales'
export default {
  data() {
    return {
      currentShop: '',
      loading: false,
      create_time: '',
      params: {
        page: 1,
        pageSize: 20,
        aftersales_status: 2
      },
      time_start_begin: '',
      time_start_end: '',
      total_count: 0,
      list: [],
      identifier: '',
      AfterSalesOrder: ''
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  methods: {
    onCopy() {
      this.$notify.success({
        message: '复制成功',
        showClose: true
      })
    },
    search(e) {
      this.params.page = 1
      this.getParams()
      this.getAftersalesList(this.params)
    },
    search2(){
      this.params.page = 1
      this.params.time_start_begin = this.time_start_begin
      this.params.time_start_end = this.time_start_end
      this.params.AfterSalesOrder = this.AfterSalesOrder
       this.params.order_id = ''
      this.getAftersalesList(this.params)
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
      this.getAftersalesList(this.params)
    },
    handleCurrentChange(val) {
      this.params.page = val
      this.loading = false
      this.getParams()
      this.getAftersalesList(this.params)
    },
    handleSizeChange(pageSize) {
      this.loading = false
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getParams()
      this.getAftersalesList(this.params)
    },
    getParams() {
      this.params.time_start_begin = this.time_start_begin
      this.params.time_start_end = this.time_start_end
      this.params.order_id = this.identifier
      this.params.AfterSalesOrder = ''
    },
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    getAftersalesList(filter) {
      this.loading = true
      getAftersalesList(filter).then((response) => {
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
    exportData() {
      this.getParams()
      this.params.page = 1
      exportAftersalesFinancialList(this.params).then((response) => {
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
    }
  },
  mounted() {
    this.getAftersalesList(this.params)
  }
}
</script>
