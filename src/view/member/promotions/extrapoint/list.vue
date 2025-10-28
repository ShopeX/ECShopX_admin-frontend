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
  <SpRouterView>
    <SpPage>
      <el-row :gutter="20">
        <el-col :span="4">
          <el-input v-model="params.title" placeholder="活动名称">
            <el-button slot="append" icon="el-icon-search" @click="dataSearch" />
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-date-picker
            v-model="create_time"
            type="daterange"
            value-format="yyyy/MM/dd"
            placeholder="添加时间筛选"
            style="width: 100%"
            @change="dateChange"
          />
        </el-col>
        <el-col :span="4">
          <el-button type="primary" icon="plus" @click="addActivityData"> 添加活动 </el-button>
        </el-col>
      </el-row>
      <el-table v-loading="loading" :data="activityLists" :height="wheight - 150">
        <el-table-column prop="activity_id" label="ID" width="50" />
        <el-table-column label="活动名称" width="150">
          <template slot-scope="scope"> {{ scope.row.title }}<br /> </template>
        </el-table-column>
        <el-table-column label="活动时间">
          <template slot-scope="scope">
            {{ scope.row.begin_time }} <span class="text-muted">~</span> {{ scope.row.end_time }}
            <span class="text-muted" />
          </template>
        </el-table-column>
        <el-table-column prop="status" label="活动状态" width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.activity_status == 'ready'">待开始</span>
            <span v-else-if="scope.row.activity_status == 'processing'">进行中</span>
            <span v-else-if="scope.row.activity_status == 'end'">已结束</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.activity_status !== 'end' && scope.row.activity_status != 'invalid'"
              type="text"
              @click="editCommunityAction(scope.$index, scope.row)"
            >
              编辑活动
            </el-button>
            <el-button
              v-if="scope.row.activity_status == 'processing'"
              type="text"
              @click="updateStatusCommunityAction(scope.row)"
            >
              终止活动
            </el-button>
            <el-button
              v-if="scope.row.activity_status == 'end'"
              type="text"
              @click="viewDetail(scope.row)"
            >
              查看活动
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
    </SpPage>
  </SpRouterView>
</template>
<script>
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import { getExtrapointList, extrapointUpdateStatus } from '../../../../api/promotions'
export default {
  provide() {
    return {
      refresh: this.refresh
    }
  },
  props: ['getStatus'],
  data() {
    return {
      create_time: '',
      activeName: 'first',
      activityLists: [],
      loading: false,
      total_count: 0,
      params: {
        page: 1,
        pageSize: 20,
        status: '',
        activity_name: '',
        time_start_begin: '',
        time_start_end: ''
      },
      communityVisible: false,
      couponVisible: false,
      goodsVisible: false,
      goodsList: [],
      goodsCount: 0,
      goodsPageSize: 10,
      goodsPage: 1,
      nowActivity: ''
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  watch: {
    getStatus(val) {
      if (val) {
        this.getList(this.params)
      }
    }
  },
  mounted() {
    if (this.$route.query.status) {
      this.params.status = this.$route.query.status
    }
    this.getList(this.params)
  },
  methods: {
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getList(this.params)
    },
    addActivityData() {
      // 添加物料弹框
      this.$router.push({
        path: this.matchRoutePath('templ')
      })
    },
    editCommunityAction(index, row) {
      // 编辑物料弹框
      this.$router.push({ path: this.matchRoutePath('editor/') + row.activity_id })
    },
    dataSearch() {
      this.params.begin_time = ''
      this.params.end_time = ''
      this.create_time = ''
      this.params.page = 1
      this.getList(this.params)
    },
    getList(params) {
      this.loading = true
      getExtrapointList(params).then((response) => {
        this.activityLists = response.data.data.list
        this.total_count = response.data.data.total_count
        this.loading = false
      })
    },
    updateStatusCommunityAction(row) {
      console.log(row, 1)
      var msg = '此操作将永久终止该活动, 是否继续?'
      this.$confirm(msg, '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            extrapointUpdateStatus({ activity_id: row.activity_id }).then((response) => {
              this.getList()
              this.$message({
                message: '修改活动状态成功',
                type: 'success',
                duration: 5 * 1000
              })
            })
          }
          done()
        }
      })
    },
    viewDetail(row) {
      this.$router.push({
        path: this.matchRoutePath('editor/') + row.activity_id,
        query: { isnodata: true }
      })
    },
    dateChange(val) {
      this.params.status = ''
      if (val && val.length > 0) {
        this.params.begin_time = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
        this.params.end_time = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
      } else {
        this.params.begin_time = ''
        this.params.end_time = ''
      }
      this.params.page = 1
      this.getList(this.params)
    },
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    viewCouponList(ids) {
      this.couponVisible = true
    },
    handleCancel() {
      this.communityVisible = false
      this.couponVisible = false
      this.goodsVisible = false
    },
    updateActivityData(params) {
      updateActivityItemData(params).then((res) => {})
    },
    editItemPrice(row) {
      let form = {
        id: row.id,
        item_id: row.item_id,
        activity_price: row.activity_price,
        vip_price: row.vip_price,
        svip_price: row.svip_price,
        activity_store: row.activity_store,
        points: row.points
      }
      this.updateActivityData(form)
    },
    refresh() {
      this.getList(this.params)
    }
  }
}
</script>
