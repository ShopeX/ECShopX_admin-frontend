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
<style scoped lang="scss">
.sp-filter-form {
  margin-bottom: 16px;
}
</style>

<template>
  <SpPage>
    <template v-if="$route.path.indexOf('editor') === -1">
      <SpPlatformTip v-if="!VERSION_SHUYUN()" h5 app pc alipay />

      <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onReset">
        <SpFilterFormItem prop="name" label="活动名称:">
          <el-input v-model="params.name" placeholder="活动名称" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="create_time" label="时间:">
          <el-date-picker
            v-model="params.create_time"
            type="daterange"
            value-format="yyyy/MM/dd"
            placeholder="添加时间筛选"
          />
        </SpFilterFormItem>
      </SpFilterForm>

      <div class="action-container">
        <el-button type="primary" icon="iconfont icon-xinzengcaozuo-01" @click="addActivityData">
          添加活动
        </el-button>
      </div>

      <el-tabs v-model="params.status" type="card" @tab-click="handleTabClick">
        <el-tab-pane
          v-for="(item, index) in tabList"
          :key="index"
          :label="item.name"
          :name="item.activeName"
        >
          <el-table v-loading="loading" border :data="tableList" :height="wheight - 200">
            <el-table-column prop="seckill_id" label="ID" width="80" />
            <el-table-column prop="activity_name" label="活动名称" min-width="180" />
            <el-table-column prop="created_date" label="创建时间" min-width="150" />
            <el-table-column label="活动时间" min-width="150">
              <template slot-scope="scope">
                <div>{{ scope.row.activity_start_date }}</div>
                <div>~</div>
                <div>{{ scope.row.activity_end_date }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" min-width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.status == 'waiting'">待开始</span>
                <span v-else-if="scope.row.status == 'in_the_notice'">预告中</span>
                <span v-else-if="scope.row.status == 'in_sale'">进行中</span>
                <span v-else-if="scope.row.status == 'it_has_ended'">已结束</span>
                <span v-else-if="scope.row.status == 'close'">已终止</span>
              </template>
            </el-table-column>
            <el-table-column min-width="70" prop="source_name" label="店铺" />
            <el-table-column label="操作" width="250">
              <template slot-scope="scope">
                <a v-show="false" ref="download" :href="downloadUrl" :download="downloadfilename" />
                <template v-if="scope.row.edit_btn == 'Y'">
                  <el-button
                    v-if="editActionVisible(scope.row)"
                    type="text"
                    @click="editAction(scope.$index, scope.row)"
                  >
                    编辑活动
                  </el-button>
                </template>
                <el-button
                  v-if="editActionVisible(scope.row)"
                  type="text"
                  @click="updateStatusCommunityAction(scope.row)"
                >
                  终止活动
                </el-button>
                <el-button
                  v-if="scope.row.status == 'it_has_ended'"
                  type="text"
                  @click="editAction(scope.$index, scope.row)"
                >
                  查看活动
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div v-if="page.total > page.pageSize" class="content-center content-top-padded">
            <el-pagination
              background
              layout="total, sizes, prev, pager, next, jumper"
              :current-page.sync="page.pageIndex"
              :page-sizes="[10, 20, 50]"
              :total="page.total"
              :page-size="page.pageSize"
              @current-change="onCurrentChange"
              @size-change="onSizeChange"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </template>

    <el-dialog title="活动支持店铺列表" :visible.sync="dialogVisible" width="50%">
      <el-table v-loading="loading" :data="distributors.distributor_info" :height="wheight - 500">
        <el-table-column prop="name" label="店铺名称" min-width="180" />
        <el-table-column prop="address" label="地址" min-width="180" />
        <el-table-column label="操作" width="250">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="uploadActionWxaCode(scope.$index, distributors, scope.row.distributor_id)"
            >
              下载小程序码
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <router-view />
  </SpPage>
</template>
<script>
import { mapGetters } from 'vuex'
import { getDefaultCurrency } from '@/api/company'
import { seckillActivityUpdateStatus, seckillActivityWxcode } from '@/api/promotions'
import { pageMixin } from '@/mixins'
export default {
  mixins: [pageMixin],
  provide() {
    return {
      refresh: this.refresh
    }
  },
  props: ['getStatus'],
  data() {
    const initialParams = {
      create_time: [],
      status: 'all',
      name: undefined,
      seckill_type: 'limited_time_sale'
    }

    return {
      initialParams,
      params: {
        ...initialParams
      },
      downloadfilename: '',
      downloadUrl: '',
      loading: false,
      communityVisible: false,
      couponVisible: false,
      goodsVisible: false,
      goodsList: [],
      goodsCount: 0,
      distributors: [],
      goodsPageSize: 10,
      goodsPage: 1,
      nowActivity: '',
      cursymbol: '',
      dialogVisible: false,
      currency: {},
      tabList: [
        { name: '全部', activeName: 'all' },
        { name: '未开始', activeName: 'waiting' },
        { name: '预告中', activeName: 'in_the_notice' },
        { name: '售卖中', activeName: 'in_sale' },
        { name: '已结束', activeName: 'it_has_ended' }
      ]
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  watch: {
    getStatus(val) {
      if (val) {
        this.fetchList()
      }
    }
  },
  mounted() {
    this.fetchList()
    this.getCurrencyInfo()
  },
  methods: {
    editActionVisible({ status, source_id }) {
      if (status !== 'it_has_ended') {
        if (this.IS_ADMIN() && source_id == '0') {
          return true
        }
        if (this.IS_DISTRIBUTOR()) {
          return true
        }
      }
      return false
    },
    getParams() {
      const time = {}
      const create_time = this.params.create_time
      if (create_time && create_time.length > 0) {
        time.start_time = this.dateStrToTimeStamp(create_time[0] + ' 00:00:00')
        time.end_time = this.dateStrToTimeStamp(create_time[1] + ' 23:59:59')
      }
      let params = {
        ...this.params,
        status: this.params.status === 'all' ? undefined : this.params.status,
        create_time: [],
        ...time
      }
      return params
    },

    onSearch() {
      this.page.pageIndex = 1
      this.$nextTick(() => {
        this.fetchList()
      })
    },
    onReset() {
      this.params = { ...this.initialParams }
      this.onSearch()
    },
    async fetchList() {
      this.loading = true
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        ...this.getParams()
      }
      const { list, total_count } = await this.$api.promotions.seckillActivityGetList(params)
      this.tableList = list
      this.page.total = total_count
      this.loading = false

      this.loading = false
    },
    uploadActionWxaCode(index, row, distributor_id = 0) {
      var params = { seckill_type: row.seckill_type, seckill_id: row.seckill_id }
      if (distributor_id) {
        params.distributor_id = distributor_id
      } else if (row.distributor_id === null) {
        params.distributor_id = 0
      } else if (row.distributor_id.length === 1) {
        params.distributor_id = row.distributor_id[0]
      } else if (row.distributor_id.length > 1) {
        this.distributors = row
        this.dialogVisible = true
        return
      }

      this.downloadfilename = row.activity_name + '.jpg'
      seckillActivityWxcode(params).then(res => {
        this.downloadUrl = res.data.data.code
        setTimeout(() => {
          this.$refs.download.click()
        }, 200)
      })
    },
    handleTabClick(tab, event) {
      this.onSearch()
    },
    addActivityData() {
      // 添加物料弹框
      this.$router.push({ path: this.matchRoutePath('editor') })
    },
    editAction(index, row) {
      // 编辑物料弹框
      this.$router.push({ path: this.matchRoutePath('editor/') + row.seckill_id })
    },
    updateStatusCommunityAction(row) {
      var msg = '此操作将永久终止该活动, 是否继续?'
      this.$confirm(msg, '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            seckillActivityUpdateStatus({ seckill_id: row.seckill_id }).then(response => {
              this.fetchList()
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
    dateChange(val) {
      this.params.status = ''
      if (val && val.length > 0) {
        this.params.start_time = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
        this.params.end_time = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
      } else {
        this.params.start_time = ''
        this.params.end_time = ''
      }
      this.params.page = 1
      this.fetchList()
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
    getCurrencyInfo() {
      getDefaultCurrency().then(res => {
        this.currency = res.data.data
        this.cursymbol = this.currency.symbol
      })
    },
    updateActivityData(params) {
      updateActivityItemData(params).then(res => {})
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
      this.fetchList()
      this.getCurrencyInfo()
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
.icon-search-plus {
  cursor: pointer;
}
.text-muted {
  color: #999;
}
</style>
