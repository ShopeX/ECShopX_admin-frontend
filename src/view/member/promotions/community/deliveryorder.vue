<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
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
            :placeholder="$t('2e7c4418.4b8cb9')"
            style="width: 100%"
            @change="dateChange"
          />
        </el-col>
        <el-col :md="4" :lg="4">
          <el-input
            v-model="params.activity_name"
            clearable
            :placeholder="$t('2e7c4418.39834b')"
            style="width: 100%"
            @change="getList"
          />
        </el-col>
        <el-col :md="4" :lg="4">
          <el-input
            v-model="params.shop_number"
            clearable
            :placeholder="$t('2e7c4418.3833a5')"
            style="width: 100%"
            @change="getList"
          />
        </el-col>
        <el-col :md="4" :lg="4">
          <el-input
            v-model="params.site_number"
            clearable
            :placeholder="$t('2e7c4418.dfa7e2')"
            style="width: 100%"
            @change="getList"
          />
        </el-col>
        <el-col :md="4" :lg="4">
          <el-button type="primary" @click="batchDeliveryordeStatus('SHIPPED')">
            {{ $t('2e7c4418.425991') }}
          </el-button>
        </el-col>
        <el-col :md="12" :lg="10">
          <el-button type="primary" @click="exportData"> {{ $t('2e7c4418.f2718e') }} </el-button>
          <el-button type="primary" @click="exportDeliveryorderInfo">
            {{ $t('2e7c4418.e01ce3') }}
          </el-button>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane :label="$t('2e7c4418.a8b0c2')" name="all" />
        <el-tab-pane :label="$t('2e7c4418.d8476e')" name="PENDING" />
        <el-tab-pane :label="$t('2e7c4418.4933ca')" name="SHIPPED" />
        <el-tab-pane :label="$t('2e7c4418.f87f48')" name="DONE" />
        <el-tab-pane :label="$t('2e7c4418.f41799')" name="BADDONE" />

        <el-table
          v-loading="loading"
          :data="list"
          border
          :height="wheight - 220"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" align="center" :label="$t('2e7c4418.66eeac')" />
          <el-table-column prop="delivery_bn" :label="$t('2e7c4418.51767c')" min-width="120" />
          <el-table-column prop="status" :label="$t('2e7c4418.3fea7c')" min-width="140">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === 'PENDING'" type="info">
                {{ $t('2e7c4418.d8476e') }}
              </el-tag>
              <el-tag v-if="scope.row.status === 'SHIPPED'" type="primary">
                {{ $t('2e7c4418.4933ca') }}
              </el-tag>
              <el-tag v-if="scope.row.status === 'DONE'" type="success">
                {{ $t('2e7c4418.f87f48') }}
              </el-tag>
              <el-tag v-if="scope.row.status === 'BADDONE'" type="danger">
                {{ $t('2e7c4418.5dc3f1') }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="activity_name" :label="$t('2e7c4418.39834b')" min-width="160" />
          <el-table-column prop="community_name" :label="$t('2e7c4418.d541f8')" min-width="140">
            <template slot-scope="scope">
              <span v-if="scope.row.community_name">{{ scope.row.community_name }}</span>
              <span v-else>{{ $t('2e7c4418.66042f') }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="leader_name" :label="$t('2e7c4418.07e57c')" />
          <el-table-column prop="shop_number" :label="$t('2e7c4418.3833a5')" />
          <el-table-column prop="site_number" :label="$t('2e7c4418.dfa7e2')" />
          <el-table-column :label="$t('2e7c4418.4cf24a')">
            <template slot-scope="scope">
              <span>¥{{ scope.row.total_fee / 100 }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="item_order_num" :label="$t('2e7c4418.fbb493')" />
          <el-table-column prop="item_total_num" :label="$t('2e7c4418.06612d')" />
          <el-table-column prop="created_time" :label="$t('2e7c4418.eca37c')" min-width="160">
            <template slot-scope="scope">
              <span>{{ scope.row.created_time | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            :label="$t('2e7c4418.2b6bc0')"
            min-width="120"
            fixed="left"
          >
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.status == 'PENDING'"
                size="mini"
                type="text"
                @click="shippedHandle(scope.row)"
              >
                {{ $t('2e7c4418.045315') }}
              </el-button>
              <el-button size="mini" type="text" @click="deliveryorderDetail(scope.row)">
                {{ $t('2e7c4418.f26225') }}
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
      <el-dialog
        :title="$t('2e7c4418.95b655')"
        :visible.sync="downloadView"
        :close-on-click-modal="false"
      >
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
        rows.forEach((row) => {
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
      exportDeliveryorderInfo(this.params).then((response) => {
        this.downloadUrl = response.data.data.url
        this.downloadName = response.data.data.filename
        this.downloadView = true
      })
    },
    exportData() {
      if (this.delivery_id) {
        this.params.delivery_id = this.delivery_id
      }
      exportDeliveryorder(this.params).then((response) => {
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
          message: this.$t('2e7c4418.2a558e')
        })
        return false
      }

      let params = {}
      if (this.delivery_id.length > 0) {
        let data = []
        this.delivery_id.forEach((delivery_id) => {
          data.push({ delivery_id: delivery_id })
        })
        params = {
          items: JSON.stringify(data),
          status: status
        }
      }
      batchShippingDeliveryorder(params).then((res) => {
        if (res.data.data.status) {
          this.$message({
            message: this.$t('2e7c4418.33130f'),
            type: 'success',
            duration: 2 * 1000
          })
          this.getList()
        }
      })
    },
    // 发货确认
    shippedHandle(row) {
      this.$confirm(this.$t('2e7c4418.8f2605'), this.$t('2e7c4418.02d981'), {
        confirmButtonText: this.$t('2e7c4418.38cf16'),
        cancelButtonText: this.$t('2e7c4418.625fb2'),
        type: 'warning'
      })
        .then(() => {
          shippingDeliveryorder({ delivery_id: row.delivery_id }).then((response) => {
            this.$message({
              type: 'success',
              message: this.$t('2e7c4418.43d829')
            })
            this.getList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('2e7c4418.c34281')
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
      getDeliveryOrderList(this.params).then((response) => {
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
