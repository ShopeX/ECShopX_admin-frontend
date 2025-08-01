<template>
  <div>
    <el-tabs v-model="activeName" class="section-white content-padded">
      <el-tab-pane label="订单列表" name="first">
        <el-row class="content-bottom-padded" :gutter="20">
          <el-col v-if="order_type == 'service'" :span="4">
            <shop-select wxshops @update="storeChange" @init="initChange" />
            <!--distributors wxshops 需要哪个api传哪个-->
          </el-col>
          <el-col :span="5">
            <el-date-picker
              v-model="create_time"
              type="daterange"
              value-format="yyyy/MM/dd"
              placeholder="选择日期范围"
              style="width: 100%"
              @change="dateChange"
            />
          </el-col>
          <el-col :span="4">
            <el-input v-model="identifier" placeholder="手机号/订单号">
              <el-button slot="append" icon="el-icon-search" @click="numberSearch" />
            </el-input>
          </el-col>
          <el-col :span="3">
            <el-select
              v-model="order_status"
              placeholder="订单状态"
              style="width: 100%"
              @change="orderStatusSelectHandle"
            >
              <el-option
                v-for="(item, index) in orderStatusList"
                :key="index"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select
              v-model="order_type"
              placeholder="请选择订单类型"
              style="width: 100%"
              @change="TypeHandle"
            >
              <el-option
                v-for="(item, index) in orderType"
                :key="index"
                :label="item.name"
                :value="item.type"
              />
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-autocomplete
              v-model="source_name"
              class="inline-input"
              :fetch-suggestions="querySearch"
              placeholder="请输入来源"
              @select="sourceSearch"
            />
          </el-col>
        </el-row>
        <div>
          <el-table
            v-loading="loading"
            :data="list"
            style="width: 100%"
            element-loading-text="数据加载中"
          >
            <el-table-column prop="create_time" label="创建时间">
              <template slot-scope="scope">
                <span>{{ scope.row.create_time | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="order_id" label="订单号" />
            <el-table-column prop="title" label="标题" />
            <el-table-column prop="total_fee" label="金额">
              <template slot-scope="scope"> ￥{{ scope.row.total_fee / 100 }} </template>
            </el-table-column>
            <el-table-column prop="mobile" label="手机号" />
            <el-table-column prop="order_type" label="类型">
              <template slot-scope="scope">
                <span
                  v-for="(item, index) in orderType"
                  v-if="item.type == scope.row.order_type"
                  :key="index"
                >
                  {{ item.name }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="order_status" label="订单状态">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.order_status == 'DONE'" type="success"> 已完成 </el-tag>
                <el-tag v-else-if="scope.row.order_status == 'NOTPAY'"> 未支付 </el-tag>
                <el-tag v-else-if="scope.row.order_status == 'CLOSED'" type="danger">
                  已取消
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="source_name" label="来源" />
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="small" icon="view" @click="getDetail(scope.row.order_id)">
                  详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-if="total_count > pageSize" class="tc">
          <el-pagination
            layout="prev, pager, next"
            :current-page.sync="currentPage"
            :total="total_count"
            :page-size="pageSize"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { getOrderList } from '../../../../api/trade'
import { getSourcesList } from '../../../../api/datacube'
import shopSelect from '@/components/shopSelect'
export default {
  components: {
    shopSelect
  },
  data() {
    return {
      activeName: 'first',
      loading: false,
      create_time: '',
      params: {},
      orderStatusList: [
        { name: '未支付', value: 'notpay' },
        { name: '已完成', value: 'done' }
      ],
      order_status: '',
      time_start_begin: '',
      time_start_end: '',
      total_count: 0,
      currentPage: 1,
      pageSize: 20,
      order_type: 'service',
      list: [],
      currentShop: '',
      identifier: '',
      source_list: [],
      source_name: '',
      source_id: ''
    }
  },
  mounted() {
    this.params = { page: this.currentPage, pageSize: this.pageSize, order_type: this.order_type }
    this.getOrders(this.params)
    this.getAllSourcesList()
  },
  methods: {
    shopHandle(val) {
      val && val.shop_id
      this.currentShop = val.shop_id
      this.getParams()
      this.getOrders(this.params)
    },
    TypeHandle(val) {
      this.getParams()
      this.getOrders(this.params)
    },
    orderStatusSelectHandle() {
      this.params.page = 1
      this.params.order_status = this.order_status
      this.getOrders(this.params)
    },
    numberSearch(e) {
      this.getParams()
      this.params.page = 1
      this.getOrders(this.params)
    },
    dateChange(val) {
      if (val.length > 0) {
        this.time_start_begin = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
        this.time_start_end = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
      } else {
        this.time_start_begin = ''
        this.time_start_end = ''
      }
      this.getParams()
      this.params.page = 1
      this.getOrders(this.params)
    },
    sourceSearch(item) {
      this.source_id = item.source_id
      // 解决如果在第二页开始来源搜索，页面不跳转到第一页的问题
      this.currentPage = 1
      this.getParams()
      this.getOrders(this.params)
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.loading = false
      this.getParams()
      this.getOrders(this.params)
    },
    getParams() {
      this.params.time_start_begin = this.time_start_begin
      this.params.time_start_end = this.time_start_end
      this.params.order_type = this.order_type
      if (this.order_type == 'service') {
        this.params.shop_id = this.currentShop
      } else if (this.order_type == 'bargain') {
        delete this.params.shop_id
      }
      if (this.identifier.length == 11) {
        this.params.mobile = this.identifier
      } else {
        this.params.mobile = ''
        this.params.order_id = this.identifier
      }
      this.params.source_id = this.source_id
      this.params.page = this.currentPage
      this.params.pageSize = this.pageSize
    },
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    getOrders(filter) {
      this.loading = true
      getOrderList(filter).then(response => {
        this.list = response.data.data.list
        this.total_count = Number(response.data.data.pager.count)
        this.loading = false
      })
    },
    getDetail(orderId) {
      this.$router.push({
        path: '/base/trade/order/detail',
        query: {
          orderId: orderId,
          resource: 'trade'
        }
      })
    },
    getAllSourcesList() {
      let params = { page: 1, pageSize: 1000 }
      getSourcesList(params).then(response => {
        if (response.data.data.list) {
          response.data.data.list.forEach(row => {
            this.source_list.push({ value: row.sourceName, source_id: row.sourceId })
          })
        }
      })
    },
    querySearch(queryString, cb) {
      var restaurants = this.source_list
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return restaurant => {
        return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    }
  }
}
</script>
<style scoped lang="scss">
.el-row {
  margin-bottom: 10px;
  .frm-tips {
    color: #8d8d8d;
  }
}
</style>
