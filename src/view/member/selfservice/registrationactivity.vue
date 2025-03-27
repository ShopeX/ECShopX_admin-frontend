<template>
  <SpRouterView>
    <SpPlatformTip h5 app alipay />
    <div class="action-container">
      <el-button type="primary" icon="iconfont icon-xinzengcaozuo-01" @click="addElement">
        活动添加
      </el-button>
    </div>

    <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onReset">
      <SpFilterFormItem prop="field_title" label="活动名称:">
        <el-input v-model="params.field_title" placeholder="活动名称" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="status" label="状态:">
        <el-select v-model="params.status" placeholder="状态">
          <el-option
            v-for="(item, index) in statusOption"
            :key="index"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </SpFilterFormItem>
      <SpFilterFormItem prop="create_time" label="时间:">
        <el-date-picker
          v-model="params.create_time"
          type="daterange"
          value-format="yyyy/MM/dd"
          placeholder="根据添加时间筛选"
        />
      </SpFilterFormItem>
      <SpFilterFormItem prop="distributor" label="店铺名称:">
        <el-autocomplete
          v-model="params.distributor.name"
          :fetch-suggestions="queryStoreSearch"
          placeholder="请输入店铺名称"
          @select="handleSelectStore"
        />
      </SpFilterFormItem>
    </SpFilterForm>

    <el-table v-loading="loading" border :data="tableList" style="width: 100%">
      <el-table-column prop="activity_id" label="编号" width="100" />
      <el-table-column prop="activity_name" label="活动名称" width="200" />
      <el-table-column label="是否核销" width="120">
        <template slot-scope="scope">
          {{ scope.row.is_offline_verify ? '是' : '否'}}
        </template>
      </el-table-column>
      <el-table-column prop="gift_points" label="获取积分" width="120" />
      <el-table-column label="进白名单" width="120">
        <template slot-scope="scope">
          {{ scope.row.is_white_list ? '是' : '否'}}
        </template>
      </el-table-column>
      <el-table-column label="活动时间" width="300">
        <template slot-scope="scope">
          {{ scope.row.start_date }} ~ {{ scope.row.end_date }}
        </template>
      </el-table-column>
      <el-table-column label="报名人数" width="120">
        <template slot-scope="scope">
          {{ scope.row.total_join_num || 0 }}
        </template>
      </el-table-column>
      <el-table-column prop="status_name" label="状态" width="120" />
      <el-table-column prop="distributor_name" label="店铺" width="120" />
      <el-table-column label="操作" fixed="right" :width="IS_DISTRIBUTOR() ? 150: 250">
        <template slot-scope="scope">
          <el-button v-if="(scope.row.status === 'ongoing' || scope.row.status === 'waiting') && !IS_DISTRIBUTOR()" type="text" @click="onOperationChange(scope.row, 'edit')">编辑</el-button>
          <el-button v-if="scope.row.status === 'end' || IS_DISTRIBUTOR()" type="text" @click="onOperationChange(scope.row, 'detail')">查看</el-button>
          <el-button v-if="scope.row.status === 'waiting' && !IS_DISTRIBUTOR()" type="text" @click="onStopChange(scope.row)">终止</el-button>
          <!-- <el-button v-if="scope.row.status === 'ongoing' && !IS_DISTRIBUTOR()" type="text" @click="onShowChange(scope.row)">企业</el-button> -->
          <el-button type="text" @click="onOperationChange(scope.row, 'record')">报名记录</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="content-center content-top-padded">
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
    <EnterpriseDialog :visible.sync="dialogVisible" @closeDialog="closeDialog"/>
  </SpRouterView>
</template>
<script>
import mixin, { pageMixin } from '@/mixins'
import { IS_DISTRIBUTOR } from '@/utils'
import { regActivityInvalid } from '@/api/selfhelpform'
import EnterpriseDialog from './components/enterpriseDialog'
export default {
  mixins: [mixin, pageMixin],
  provide() {
    return {
      refresh: this.fetchList
    }
  },
  components: {
    EnterpriseDialog
  },
  data() {
    const initialParams = {
      field_title: undefined,
      status: '',
      create_time: [],
      distributor_id: '',
      distributor: {
        id: undefined,
        name: undefined
      }
    }
    return {
      initialParams,
      params: {
        ...initialParams
      },
      loading: false,
      statusOption: [
        { name: '全部', value: '' },
        { name: '待开始', value: 'waiting' },
        { name: '进行中', value: 'ongoing' },
        { name: '已结束', value: 'end' }
      ],
      shopList: [],
      dialogData: {},
      dialogVisible: false
    }
  },
  watch: {
  },
  mounted() {
    this.fetchList()
    this.getStoreList()
  },
  methods: {
    addElement() {
      // 添加商品
      this.$router.push({ path: this.matchHidePage('editor') })
    },
    onSearch() {
      this.page.pageIndex = 1
      this.$nextTick(() => {
        this.fetchList()
      })
    },
    onReset() {
      this.params = { ...this.initialParams }
      this.params = {
        ...this.params,
        distributor: {
          id: undefined,
          name: undefined
        }
      }
      this.onSearch()
    },
    getParams() {
      const time = {}
      const create_time = this.params.create_time
      if (create_time.length) {
        time.start_time = this.dateStrToTimeStamp(create_time[0] + ' 00:00:00')
        time.end_time = this.dateStrToTimeStamp(create_time[1] + ' 00:00:00')
      }
      let params = {
        ...this.params,
        create_time: [],
        ...time
      }
      delete params.distributor
      return params
    },
    async fetchList() {
      this.loading = true
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        ...this.getParams()
      }
      const { list, total_count } = await this.$api.selfhelpform.regActivityList(params)
      this.tableList = list
      this.page.total = total_count
      this.loading = false
    },
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    queryStoreSearch(queryString, cb) {
      var restaurants = this.shopList
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    handleSelectStore(storeItem) {
      this.params.distributor_id = storeItem.distributor_id
      this.params.distributor.id = storeItem.distributor_id
    },
    async getStoreList() {
      let params = { page: 1, pageSize: 500 }
      const { list } = await this.$api.marketing.getDistributorList(params)
      if (list) {
        list.forEach((row) => {
          this.shopList.push({ 'value': row.name, 'distributor_id': row.distributor_id })
        })
      }
    },
    onOperationChange (row, type) {
      if (type == 'edit') {
        this.$router.push({ path: this.matchHidePage('editor'), query: { id: row.activity_id, type: 'edit'} })
      } else if (type == 'detail') {
        this.$router.push({ path: this.matchHidePage('editor'), query: { id: row.activity_id, type: 'detail'} })
      } else if (type == 'record') {
        this.$router.push({ path: `${this.IS_DISTRIBUTOR() ? '/shopadmin' : ''}/marketing/marketing/apply/Registrationrecord`, query: { id: row.activity_id} })
      }
    },
    onStopChange(row) {
      var msg = '此操作将永久终止该活动, 是否继续?'
      this.$confirm(msg, '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            regActivityInvalid({ activity_id: row.activity_id }).then((res) => {
                this.fetchList()
                this.$message({
                  message: '修改活动状态成功',
                  type: 'success',
                  duration: 5 * 1000
                })
              }
            )
          }
          done()
        }
      })
    },
    onShowChange (row) {
      this.dialogData = row
      this.closeDialog(true)
    },
    closeDialog (visible) {
      this.dialogVisible = visible
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

  img {
    width: 90%;
  }
}

.sp-filter-form {
  margin-bottom: 16px;
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

  img {
    width: 90%;
  }
}

.row-bg {
  padding: 10px 20px;
  background-color: #f9fafc;
}

.service-label .el-checkbox:first-child {
  margin-left: 15px;
}

.service-label .el-input:first-child {
  margin-left: 15px;
}

.grid-detail {
  max-height: 300px;
  overflow-y: scroll;
  margin-bottom: 20px;
}

.el-carousel {
  width: 375px;
}
</style>
<style lang="scss">
.grid-detail {
  table,
  .detail-content-wrap,
  .detail-content-item {
    width: 100% !important;
  }

  img {
    width: 100%;
  }
}

.grid-attribute {
  table {
    width: 100% !important;
  }
}
</style>
