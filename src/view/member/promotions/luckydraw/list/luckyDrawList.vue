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
<template>
  <div>
    <el-table v-loading="loading" :data="luckydrawList" :height="wheight - 240">
      <el-table-column prop="luckydraw_name" label="活动名称" />
      <!--  <el-table-column label="商品类型" width="120">
          <template slot-scope="scope">
              <el-tag  v-if="scope.row.goods_type=='services'" type="success">服务类商品</el-tag>
              <el-tag v-else>实体类商品</el-tag>
          </template>
      </el-table-column> -->
      <el-table-column prop="goods_info.itemName" label="商品名称" />
      <el-table-column label="活动有效期" width="160">
        <template slot-scope="scope">
          {{ scope.row.start_time | datetime }}<br>{{ scope.row.end_time | datetime }}
        </template>
      </el-table-column>
      <el-table-column label="单价(积分/现金)" width="120">
        <template v-if="scope.row.luckydraw_payment == 'cash'" slot-scope="scope">
          <span>{{ cursymbol + scope.row.luckydraw_price / 100 }}元</span>
        </template>
        <template v-if="scope.row.luckydraw_payment == 'point'" slot-scope="scope">
          <span>{{ scope.row.luckydraw_point }} 积分</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.activity_status == 1">未开始</span>
          <span v-else-if="scope.row.activity_status == 2">进行中</span>
          <span v-else>已结束</span>
        </template>
      </el-table-column>
      <el-table-column label="中奖号码" width="120">
        <template slot-scope="scope">
          <el-popover
            v-if="scope.row.lucky_code"
            placement="top-start"
            title="开奖信息"
            width="200"
            trigger="hover"
          >
            <span v-if="scope.row.third_info.name">彩种:{{ scope.row.third_info.name }}</span
            ><br>
            <span v-if="scope.row.third_info.period">期数:{{ scope.row.third_info.period }}</span
            ><br>
            <span v-if="scope.row.third_info.number">号码:{{ scope.row.third_info.number }}</span>
            <el-tag slot="reference" type="danger">
              {{ scope.row.lucky_code }}
            </el-tag>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button
            size="mini"
            icon="edit"
            @click="showLuckyDrawDataAction(scope.$index, scope.row)"
          >
            活动数据
          </el-button>
          <el-button
            v-if="scope.row.activity_status == 1"
            size="mini"
            icon="edit"
            @click="editLuckyDrawAction(scope.$index, scope.row)"
          >
            编辑
          </el-button>
          <el-button
            v-if="scope.row.activity_status == 2"
            size="mini"
            @click="showLuckyDrawAction(scope.$index, scope.row)"
          >
            查看
          </el-button>
          <el-button
            v-if="scope.row.activity_status == 2"
            size="mini"
            @click="finishLuckyDrawAction(scope.$index, scope.row)"
          >
            终止
          </el-button>
          <el-button
            v-if="scope.row.activity_status == 1"
            size="mini"
            type="danger"
            @click="deleteLuckyDrawAction(scope.$index, scope.row)"
          >
            删 除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="total_count > params.pageSize" class="content-center content-top-padded">
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
import { getDefaultCurrency } from '../../../../../api/company'
import {
  getLuckyDrawList,
  finishLuckyDrawActivity,
  deleteLuckyDrawActivity
} from '../../../../../api/promotions'

export default {
  props: ['view'],
  data() {
    return {
      loading: false,
      luckydrawList: [],
      total_count: 0,
      params: {
        view: 0,
        page: 1,
        pageSize: 20,
        keywords: ''
      },
      currency: {},
      cursymbol: '￥'
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted() {
    this.params.view = this.view
    this.getLuckyDrawList()
    //this.getCurrencyInfo()
  },
  methods: {
    handleCurrentChange(pageNum) {
      this.params.page = pageNum
      this.getLuckyDrawList()
    },
    getLuckyDrawList() {
      this.loading = true
      getLuckyDrawList(this.params)
        .then(response => {
          this.luckydrawList = response.data.data.list
          this.total_count = response.data.data.total_count
          this.loading = false
        })
        .catch(error => {
          this.loading = false
          this.$message({
            type: 'error',
            message: '获取活动列表失败'
          })
        })
    },
    showLuckyDrawDataAction(index, row) {
      this.$router.push({ path: '/member/marketing/luckydraw/team/' + row.luckydraw_id })
    },
    showLuckyDrawAction(index, row) {
      this.$router.push({
        path: '/member/marketing/luckydraw/add/' + row.luckydraw_id,
        query: { show: '1' }
      })
    },
    editLuckyDrawAction(index, row) {
      this.$router.push({ path: '/member/marketing/luckydraw/add/' + row.luckydraw_id })
    },
    finishLuckyDrawAction(index, row) {
      this.$confirm('此操作将终止该活动, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          finishLuckyDrawActivity(row.luckydraw_id).then(res => {
            this.getLuckyDrawList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    deleteLuckyDrawAction(index, row) {
      this.$confirm('此操作将删除该活动, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteLuckyDrawActivity(row.luckydraw_id).then(res => {
            this.getLuckyDrawList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    getCurrencyInfo() {
      getDefaultCurrency().then(res => {
        this.currency = res.data.data
        this.cursymbol = this.currency.symbol
      })
    }
  }
}
</script>

<style scoped></style>
