<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input
          v-model="identifier"
          placeholder="服务人员手机号"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="numberSearch"
          />
        </el-input>
      </el-col>
    </el-row>
    <el-table
      v-loading="loading"
      :data="dataList"
      :height="wheight - 150"
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
        width="200"
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
    <div
      v-if="total_count > params.pageSize"
      class="content-padded content-center"
    >
      <el-pagination
        layout="prev, pager, next"
        :current-page.sync="params.page"
        :total="total_count"
        :page-size="params.pageSize"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getRightsLogList } from '../../../api/trade'
export default {
  props: ['userId', 'isLoad'],
  data () {
    return {
      loading: false,
      total_count: 0,
      dataList: [],
      identifier: '',
      create_time: '',
      date_begin: '',
      date_end: '',
      params: {
        page: 1,
        pageSize: 20
      }
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  watch: {
    userId (newVal, oldVal) {
      if (this.isLoad) {
        this.params.user_id = newVal
        this.getParams()
        this.getDataList(this.params)
      }
    },
    isLoad (newVal, oldVal) {
      if (newVal) {
        this.params.user_id = this.userId
        this.getParams()
        this.getDataList(this.params)
      }
    }
  },
  mounted () {
    let param = { page: 1, pageSize: 20 }
    this.params.user_id = this.userId
    this.getParams()
    this.getDataList(this.params)
  },
  methods: {
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
    handleCurrentChange (val) {
      this.params.page = val
      this.getDataList(this.params)
    }
  }
}
</script>
