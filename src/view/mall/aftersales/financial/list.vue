<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <div v-if="$route.path.indexOf('detail') === -1">
      <el-row class="filter-header" :gutter="20">
        <el-col>
          <el-date-picker
            v-model="create_time"
            class="input-m"
            type="daterange"
            value-format="yyyy/MM/dd"
            :placeholder="$t('2f57554b.4b8cb9')"
            @change="dateChange"
          />
          <el-input v-model="identifier" class="input-m" :placeholder="$t('2f57554b.1e8dc2')">
            <el-button slot="append" icon="el-icon-search" @click="search" />
          </el-input>
          <el-input v-model="aftersales_bn" class="input-m" :placeholder="$t('2f57554b.d34f24')">
            <el-button slot="append" icon="el-icon-search" @click="search2" />
          </el-input>
          <el-button type="primary" @click="exportData"> {{ $t('2f57554b.55405e') }} </el-button>
          <el-popover
            placement="top-start"
            width="200"
            trigger="hover"
            :content="$t('2f57554b.676480')"
          >
            <i slot="reference" class="el-icon-question" />
          </el-popover>
        </el-col>
      </el-row>
      <el-card>
        <el-table v-loading="loading" :data="list" :element-loading-text="$t('2f57554b.f09b12')">
          <el-table-column prop="create_time" width="220" :label="$t('2f57554b.d1b93f')">
            <template slot-scope="scope">
              <div class="order-num">
                {{ scope.row.aftersales_bn }}
                <el-tooltip effect="dark" :content="$t('2f57554b.79d3ab')" placement="top-start">
                  <i
                    v-clipboard:copy="scope.row.aftersales_bn"
                    v-clipboard:success="onCopy"
                    class="el-icon-document-copy"
                  />
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column min-width="300" :label="$t('2f57554b.4c117f')">
            <template slot-scope="scope">
              <div class="order-num">
                {{ scope.row.order_id }}
                <el-tooltip effect="dark" :content="$t('2f57554b.79d3ab')" placement="top-start">
                  <i
                    v-clipboard:copy="scope.row.order_id"
                    v-clipboard:success="onCopy"
                    class="el-icon-document-copy"
                  />
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column min-width="80" :label="$t('2f57554b.a0cd4c')">
            <template slot-scope="scope">
              <span>￥{{ scope.row.refund_fee / 100 }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="100" :label="$t('2f57554b.220bc2')">
            <template slot-scope="scope">
              <span>{{ scope.row.reason }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="300" :label="$t('2f57554b.6c13e2')">
            <template slot-scope="scope">
              <span>{{ scope.row.description }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="mt-4 text-right">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :current-page.sync="params.page"
            :page-sizes="[10, 20, 50]"
            :total="total_count"
            :page-size="params.pageSize"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
          />
        </div>
      </el-card>
    </div>
    <router-view />
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
      aftersales_bn: ''
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted() {
    this.getAftersalesList(this.params)
  },
  methods: {
    onCopy() {
      this.$notify.success({
        message: this.$t('2f57554b.20a495'),
        showClose: true
      })
    },
    search(e) {
      this.params.page = 1
      this.getParams()
      this.getAftersalesList(this.params)
    },
    search2() {
      this.params.page = 1
      this.params.time_start_begin = this.time_start_begin
      this.params.time_start_end = this.time_start_end
      this.params.aftersales_bn = this.aftersales_bn
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
      this.params.aftersales_bn = ''
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
            message: this.$t('2f57554b.3e1ddd')
          })
          this.$export_open('aftersale_record_count')
          return
        } else if (response.data.data.url) {
          this.downloadUrl = response.data.data.url
          this.downloadName = response.data.data.filename
          this.downloadView = true
        } else {
          this.$message({
            type: 'error',
            message: this.$t('2f57554b.bfd8d5')
          })
        }
      })
    }
  }
}
</script>
