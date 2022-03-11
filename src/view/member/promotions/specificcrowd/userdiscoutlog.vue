<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="1">
        <el-button
          size="mini"
          type="primary"
          @click.native="handleCancel"
        >
          返回
        </el-button>
      </el-col>
      <el-col :span="6">
        <el-input
          v-model="params.order_id"
          size="mini"
          clearable
          placeholder="订单号"
        >
          <el-button
            slot="append"
            size="mini"
            icon="el-icon-search"
            @click="searchClick"
          />
        </el-input>
      </el-col>
      <el-col :span="6">
        <el-input
          v-model="params.mobile"
          size="mini"
          clearable
          placeholder="手机号"
        >
          <el-button
            slot="append"
            size="mini"
            icon="el-icon-search"
            @click="searchClick"
          />
        </el-input>
      </el-col>
      <el-col :span="6">
        <el-date-picker
          v-model="datedata"
          size="mini"
          clearable
          type="daterange"
          value-format="yyyy/MM/dd"
          placeholder="选择日期范围"
          style="width: 100%"
          @change="dateChange"
        />
      </el-col>
    </el-row>
    <el-table
      v-loading="loading"
      :data="dataList"
      :height="wheight - 150"
    >
      <el-table-column
        prop="order_id"
        label="订单号"
        width="150"
      />
      <el-table-column
        prop="user_mobile"
        label="会员手机号"
        width="120"
      />
      <el-table-column
        prop="specific_name"
        label="针对人群"
        width="120"
      />
      <el-table-column
        prop="discount_fee"
        label="优惠金额"
        width="120"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.discount_fee / 100 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="action_type"
        label="增/减"
        width="200"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.action_type == 'plus'">+</span>
          <span v-else-if="scope.row.action_type == 'less'">-(订单已取消或已退款)</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="created"
        label="创建时间"
        width="100"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.created | formatTimestamp }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="content-padded content-center">
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
import { specificcrowddiscountList } from '@/api/promotions'
export default {
  data () {
    return {
      loading: false,
      total_count: 0,
      dataList: [],
      identifier: '',
      create_time: '',
      datedata: '',
      date_end: '',
      params: {
        page: 1,
        pageSize: 20,
        order_id: '',
        mobile: ''
      }
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted () {
    this.params.activity_id = this.$route.params.id
    this.getDataList(this.params)
  },
  methods: {
    searchClick (e) {
      this.params.page = 1
      this.getDataList(this.params)
    },
    dateChange (val) {
      if (val && val.length > 0) {
        this.params.time_start_begin = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
        this.params.time_start_end = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
      } else {
        this.params.time_start_begin = ''
        this.params.time_start_end = ''
      }
      this.params.page = 1
      this.getDataList(this.params)
    },
    dateStrToTimeStamp (str) {
      return Date.parse(new Date(str)) / 1000
    },
    getDataList (filter) {
      this.loading = true
      specificcrowddiscountList(filter).then((response) => {
        this.dataList = response.data.data.list
        this.total_count = response.data.data.total_count
        this.loading = false
      })
    },
    handleCurrentChange (val) {
      this.params.page = val
      this.getDataList(this.params)
    },
    handleCancel: function () {
      this.$router.go(-1)
    }
  }
}
</script>
