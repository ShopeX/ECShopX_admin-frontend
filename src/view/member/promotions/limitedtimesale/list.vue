<template>
  <div>
    <div v-if="$route.path.indexOf('editor') === -1">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-input
            v-model="params.name"
            placeholder="活动名称"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="dataSearch"
            />
          </el-input>
        </el-col>
        <el-col :span="6">
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
          <el-button
            type="primary"
            icon="plus"
            @click="addActivityData"
          >
            添加活动
          </el-button>
        </el-col>
      </el-row>
      <el-tabs
        v-model="activeName"
        type="border-card"
        @tab-click="handleClick"
      >
        <el-tab-pane
          label="全部"
          name="all"
        />
        <el-tab-pane
          label="未开始"
          name="waiting"
        />
        <el-tab-pane
          label="预告中"
          name="in_the_notice"
        />
        <el-tab-pane
          label="售卖中"
          name="in_sale"
        />
        <el-tab-pane
          label="已结束"
          name="it_has_ended"
        />
        <el-table
          v-loading="loading"
          :data="activityLists"
          :height="wheight - 200"
        >
          <el-table-column
            prop="seckill_id"
            label="ID"
            width="80"
          />
          <el-table-column
            prop="activity_name"
            label="活动名称"
            min-width="180"
          />
          <el-table-column
            prop="created_date"
            label="创建时间"
            min-width="150"
          />
          <el-table-column
            label="活动时间"
            min-width="150"
          >
            <template slot-scope="scope">
              <div>{{ scope.row.activity_start_date }}</div>
              <div>~</div>
              <div>{{ scope.row.activity_end_date }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            min-width="100"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.status == 'waiting'">待开始</span>
              <span v-else-if="scope.row.status == 'in_the_notice'">预告中</span>
              <span v-else-if="scope.row.status == 'in_sale'">进行中</span>
              <span v-else-if="scope.row.status == 'it_has_ended'">已结束</span>
              <span v-else-if="scope.row.status == 'close'">已终止</span>
            </template>
          </el-table-column>
          <el-table-column
            min-width="70"
            prop="source_name"
            label="店铺"
          />
          <el-table-column
            label="操作"
            width="250"
          >
            <template slot-scope="scope">
              <a
                v-show="false"
                ref="download"
                :href="downloadUrl"
                :download="downloadfilename"
              />
              <template v-if="scope.row.edit_btn == 'Y'">
                <el-button
                  v-if="scope.row.status !== 'it_has_ended'"
                  type="text"
                  @click="editAction(scope.$index, scope.row)"
                >
                  编辑活动
                </el-button>
              </template>
              <el-button
                v-if="scope.row.status !== 'it_has_ended'"
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
        <div
          v-if="total_count > params.pageSize"
          class="content-center content-top-padded"
        >
          <el-pagination
            background
            layout="total, sizes, prev, pager, next"
            :page-sizes="[10, 20, 50]"
            :current-page.sync="params.page"
            :total="total_count"
            :page-size="params.pageSize"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
          />
        </div>
      </el-tabs>
    </div>

    <el-dialog
      title="活动支持店铺列表"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-table
        v-loading="loading"
        :data="distributors.distributor_info"
        :height="wheight - 500"
      >
        <el-table-column
          prop="name"
          label="店铺名称"
          min-width="180"
        />
        <el-table-column
          prop="address"
          label="地址"
          min-width="180"
        />
        <el-table-column
          label="操作"
          width="250"
        >
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
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import { getDefaultCurrency } from '../../../../api/company'
import {
  seckillActivityGetList,
  seckillActivityUpdateStatus,
  getSeckillItemList,
  seckillActivityWxcode
} from '../../../../api/promotions'
export default {
  props: ['getStatus'],
  provide () {
    return {
      refresh: this.refresh
    }
  },
  data () {
    return {
      create_time: '',
      activeName: 'all',
      activityLists: [],
      downloadfilename: '',
      downloadUrl: '',
      loading: false,
      total_count: 0,
      params: {
        page: 1,
        pageSize: 20,
        status: '',
        activity_name: '',
        time_start_begin: '',
        seckill_type: 'limited_time_sale',
        time_start_end: ''
      },
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
      currency: {}
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  watch: {
    getStatus (val) {
      if (val) {
        this.getActivityLists()
      }
    }
  },
  mounted () {
    this.getActivityLists()
    this.getCurrencyInfo()
  },
  methods: {
    uploadActionWxaCode (index, row, distributor_id = 0) {
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
      seckillActivityWxcode(params).then((res) => {
        this.downloadUrl = res.data.data.code
        setTimeout(() => {
          this.$refs.download.click()
        }, 200)
      })
    },
    handleClick (tab, event) {
      this.activeName = tab.name
      this.params.status = tab.name == 'all' ? '' : tab.name
      this.params.page = 1
      this.getActivityLists()
    },
    handleSizeChange (pageSize) {
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getActivityLists()
    },
    handleCurrentChange (page_num) {
      this.params.page = page_num
      this.getActivityLists()
    },
    addActivityData () {
      // 添加物料弹框
      this.$router.push({ path: this.matchHidePage('editor') })
    },
    editAction (index, row) {
      // 编辑物料弹框
      this.$router.push({ path: this.matchHidePage('editor/') + row.seckill_id })
    },
    dataSearch () {
      this.params.start_time = ''
      this.params.end_time = ''
      this.create_time = ''
      this.params.page = 1
      this.getActivityLists()
    },
    getActivityLists () {
      this.loading = true
      seckillActivityGetList(this.params).then((response) => {
        this.activityLists = response.data.data.list
        this.total_count = response.data.data.total_count
        this.loading = false
      })
    },
    updateStatusCommunityAction (row) {
      var msg = '此操作将永久终止该活动, 是否继续?'
      this.$confirm(msg, '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            seckillActivityUpdateStatus({ seckill_id: row.seckill_id }).then((response) => {
              this.getActivityLists()
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
    dateChange (val) {
      this.params.status = ''
      if (val && val.length > 0) {
        this.params.start_time = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
        this.params.end_time = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
      } else {
        this.params.start_time = ''
        this.params.end_time = ''
      }
      this.params.page = 1
      this.getActivityLists()
    },
    dateStrToTimeStamp (str) {
      return Date.parse(new Date(str)) / 1000
    },
    viewCouponList (ids) {
      this.couponVisible = true
    },
    handleCancel () {
      this.communityVisible = false
      this.couponVisible = false
      this.goodsVisible = false
    },
    getCurrencyInfo () {
      getDefaultCurrency().then((res) => {
        this.currency = res.data.data
        this.cursymbol = this.currency.symbol
      })
    },
    updateActivityData (params) {
      updateActivityItemData(params).then((res) => {})
    },
    editItemPrice (row) {
      let form = {
        'id': row.id,
        'item_id': row.item_id,
        'activity_price': row.activity_price,
        'vip_price': row.vip_price,
        'svip_price': row.svip_price,
        'activity_store': row.activity_store,
        'points': row.points
      }
      this.updateActivityData(form)
    },
    refresh () {
      this.getActivityLists()
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
