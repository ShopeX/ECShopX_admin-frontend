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
    <div v-if="$route.path.indexOf('detail') === -1">
      <div class="content-bottom-padded" />
      <el-row :gutter="20">
        <el-col :md="8" :lg="6">
          <el-date-picker
            v-model="created_time"
            type="daterange"
            value-format="yyyy/MM/dd"
            placeholder="选择日期范围"
            style="width: 100%"
            @change="dateChange"
          />
        </el-col>
        <el-col :md="4" :lg="4">
          <el-input
            v-model="params.activity_name"
            clearable
            placeholder="活动名称"
            style="width: 100%"
            @change="getList"
          />
        </el-col>
        <el-col :md="4" :lg="4">
          <el-input
            v-model="params.shop_number"
            clearable
            placeholder="店号"
            style="width: 100%"
            @change="getList"
          />
        </el-col>
        <el-col :md="4" :lg="4">
          <el-input
            v-model="params.site_number"
            clearable
            placeholder="站点号"
            style="width: 100%"
            @change="getList"
          />
        </el-col>
        <el-col :md="4" :lg="4">
          <el-button type="primary" @click="batchDeliveryordeStatus('SHIPPED')">
            批量发货
          </el-button>
        </el-col>
        <el-col :md="12" :lg="10">
          <el-button type="primary" @click="exportData"> 导出配送单 </el-button>
          <el-button type="primary" @click="exportDeliveryorderInfo"> 导出收货单 </el-button>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="全部" name="all" />
        <el-tab-pane label="待发货" name="PENDING" />
        <el-tab-pane label="待收货" name="SHIPPED" />
        <el-tab-pane label="已送达" name="DONE" />
        <el-tab-pane label="有报损" name="BADDONE" />

        <el-table
          v-loading="loading"
          :data="list"
          border
          :height="wheight - 220"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" align="center" label="全选" />
          <el-table-column prop="delivery_bn" label="批次号" min-width="120" />
          <el-table-column prop="status" label="状态" min-width="140">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === 'PENDING'" type="info"> 待发货 </el-tag>
              <el-tag v-if="scope.row.status === 'SHIPPED'" type="primary"> 待收货 </el-tag>
              <el-tag v-if="scope.row.status === 'DONE'" type="success"> 已送达 </el-tag>
              <el-tag v-if="scope.row.status === 'BADDONE'" type="danger"> 已送达，有报损 </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="activity_name" label="活动名称" min-width="160" />
          <el-table-column prop="community_name" label="社区名称" min-width="140">
            <template slot-scope="scope">
              <span v-if="scope.row.community_name">{{ scope.row.community_name }}</span>
              <span v-else>未知社区</span>
            </template>
          </el-table-column>
          <el-table-column prop="leader_name" label="团长姓名" />
          <el-table-column prop="shop_number" label="店号" />
          <el-table-column prop="site_number" label="站点号" />
          <el-table-column label="金额">
            <template slot-scope="scope">
              <span>¥{{ scope.row.total_fee / 100 }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="item_order_num" label="订单数" />
          <el-table-column prop="item_total_num" label="商品数量" />
          <el-table-column prop="created_time" label="创建时间" min-width="160">
            <template slot-scope="scope">
              <span>{{ scope.row.created_time | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="操作" min-width="120" fixed="right">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.status == 'PENDING'"
                size="mini"
                type="text"
                @click="shippedHandle(scope.row)"
              >
                发货
              </el-button>
              <el-button size="mini" type="text" @click="deliveryorderDetail(scope.row)">
                详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="total_count > params.pageSize" class="content-center content-top-padded">
          <el-pagination
            layout="prev, pager, next"
            background
            :current-page.sync="params.page"
            :total="total_count"
            :page-size="params.pageSize"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-tabs>
      <el-dialog title="配送单下载" :visible.sync="downloadView" :close-on-click-modal="false">
        <template v-if="downloadUrl">
          <a :href="downloadUrl" download>{{ downloadName }}</a>
        </template>
      </el-dialog>
    </div>
    <router-view />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import {
  getDeliveryOrderList,
  shippingDeliveryorder,
  batchShippingDeliveryorder,
  exportDeliveryorder,
  exportDeliveryorderInfo
} from '../../../../api/community'
export default {
  data() {
    return {
      created_time: '',
      activeName: 'all',
      list: [],
      delivery_id: [],
      loading: false,
      total_count: 0,
      params: {
        page: 1,
        pageSize: 20,
        status: ''
      },
      downloadView: false,
      downloadUrl: '',
      downloadName: ''
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted() {
    this.getList()
  },
  methods: {
    handleClick(tab, event) {
      this.activeName = tab.name
      this.params.page = 1
      if (this.activeName == 'all') {
        this.params.status = ''
      } else {
        this.params.status = tab.name
      }
      this.getList()
    },
    deliveryorderDetail(row) {
      this.$router.push({ path: this.matchRoutePath('detail/') + row.delivery_id })
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
      this.getList()
    },
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    handleSelectionChange(rows) {
      this.delivery_id = []
      if (rows) {
        rows.forEach(row => {
          if (row) {
            this.delivery_id.push(row.delivery_id)
          }
        })
      }
    },
    exportDeliveryorderInfo() {
      if (this.delivery_id) {
        this.params.delivery_id = this.delivery_id
      }
      exportDeliveryorderInfo(this.params).then(response => {
        this.downloadUrl = response.data.data.url
        this.downloadName = response.data.data.filename
        this.downloadView = true
      })
    },
    exportData() {
      if (this.delivery_id) {
        this.params.delivery_id = this.delivery_id
      }
      exportDeliveryorder(this.params).then(response => {
        this.downloadUrl = response.data.data.url
        this.downloadName = response.data.data.filename
        this.downloadView = true
      })
    },
    // 批量确认
    batchDeliveryordeStatus(status) {
      if (this.delivery_id.length === 0) {
        this.$message({
          type: 'error',
          message: '请选择至少一个配送单'
        })
        return false
      }

      let params = {}
      if (this.delivery_id.length > 0) {
        let data = []
        this.delivery_id.forEach(delivery_id => {
          data.push({ delivery_id: delivery_id })
        })
        params = {
          items: JSON.stringify(data),
          status: status
        }
      }
      batchShippingDeliveryorder(params).then(res => {
        if (res.data.data.status) {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 2 * 1000
          })
          this.getList()
        }
      })
    },
    // 发货确认
    shippedHandle(row) {
      this.$confirm('是否确认已发货?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          shippingDeliveryorder({ delivery_id: row.delivery_id }).then(response => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.getList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getList()
    },
    dataSearch() {
      this.params.page = 1
      this.getList()
    },
    getList() {
      this.loading = true
      getDeliveryOrderList(this.params).then(response => {
        this.list = response.data.data.list
        this.total_count = response.data.data.total_count
        this.loading = false
      })
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
</style>
