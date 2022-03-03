<template>
  <div>
    <el-row
      class="filter-header"
      :gutter="20"
    >
      <el-col>
        <el-select
          v-model="shopId"
          @change="shopHandle"
        >
          <el-option
            v-for="item in shopListData"
            :key="item.wxShopId"
            :label="item.storeName"
            :value="item.wxShopId"
          />
        </el-select>
        <el-input
          v-model="identifier"
          class="input-m"
          placeholder="服务人员手机号"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="numberSearch"
          />
        </el-input>
        <el-date-picker
          v-model="create_time"
          type="daterange"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="选择日期范围"
          @change="dateChange"
        />
        <export-tip @exportHandle="exportData">
          <el-button type="primary">
            导出
          </el-button>
        </export-tip>
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
      </el-col>
    </el-row>
    <el-dialog
      title="权益核销列表下载"
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
    <el-card>
      <el-table
        v-loading="loading"
        :data="dataList"
      >
        <el-table-column
          prop="shop_name"
          label="门店名称"
          width="150"
        />
        <el-table-column
          prop="attendant"
          label="服务人员"
          width="120"
        />
        <el-table-column
          prop="name"
          label="核销员"
          width="120"
        />
        <el-table-column
          prop="salesperson_mobile"
          label="核销员手机号"
          width="120"
        />
        <el-table-column
          prop="rights_name"
          label="服务项目"
        />
        <el-table-column
          prop="user_name"
          label="会员姓名"
          width="100"
        />
        <el-table-column
          prop="user_mobile"
          label="会员手机号"
          width="120"
        />
        <el-table-column
          prop="user_sex"
          label="会员性别"
          width="80"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.user_sex == '2'">女</span>
            <span v-else-if="scope.row.user_sex == '1'">男</span>
            <span v-else> 未知</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="end_time"
          label="服务时间"
          width="200"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.end_time | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="content-padded content-center"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :current-page.sync="params.page"
        :page-sizes="[10, 20, 50]"
        :total="total_count"
        :page-size="params.pageSize"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getRightsLogList, exportList } from '../../../api/trade'
import { getWxShopsList } from '@/api/shop'
export default {
  data () {
    return {
      shopListData: [],
      loading: false,
      total_count: 0,
      dataList: [],
      shopId: '',
      identifier: '',
      create_time: '',
      date_begin: '',
      date_end: '',
      params: {
        page: 1,
        pageSize: 20
      },
      downloadView: false,
      downloadUrl: '',
      downloadName: ''
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted () {
    this.getParams()
    this.getStoreList()
    if (this.shopId) {
      this.params.shop_id = this.shopId
      this.getDataList(this.params)
    }
  },
  methods: {
    shopHandle (shopId) {
      this.params.shop_id = shopId
      this.params.page = 1
      this.getDataList(this.params)
    },
    numberSearch (e) {
      this.params.page = 1
      this.getParams()
      this.getDataList(this.params)
    },
    dateChange (val) {
      if (val && val.length > 0) {
        this.date_begin = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
        this.date_end = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
      } else {
        this.date_begin = ''
        this.date_end = ''
      }
      this.params.page = 1
      this.getParams()
      this.getDataList(this.params)
    },
    dateStrToTimeStamp (str) {
      return Date.parse(new Date(str)) / 1000
    },
    getParams () {
      this.params.time_start_begin = this.date_begin
      this.params.time_start_end = this.date_end
      this.params.shop_id = this.shopId
      this.params.mobile = this.identifier
    },
    getDataList (filter) {
      this.loading = true
      getRightsLogList(filter).then((response) => {
        this.dataList = response.data.data.list
        this.total_count = response.data.data.total_count
        this.loading = false
      })
    },
    handleCurrentChange (page_num) {
      this.params.page = page_num
      this.getDataList(this.params)
    },
    handleSizeChange (pageSize) {
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getDataList(this.params)
    },
    exportData () {
      this.getParams()
      this.params.page = 1
      exportList(this.params).then((response) => {
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
    getStoreList () {
      this.storeList = []
      this.loading = true
      var shopFilter = { page: 1, pageSize: 500 }
      getWxShopsList(shopFilter).then((response) => {
        this.shopListData = response.data.data.list
        if (this.shopId == '' && this.shopListData[0].wxShopId) {
          this.shopId = this.shopListData[0].wxShopId
          this.shopHandle(this.shopListData[0].wxShopId)
        }
        this.loading = false
      })
    }
  }
}
</script>
