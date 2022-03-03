<template>
  <div>
    <div v-if="$route.path.indexOf('detail') === -1">
      <el-row
        class="filter-header"
        :gutter="20"
      >
        <el-col>
          <el-date-picker
            v-model="create_time"
            type="daterange"
            value-format="yyyy/MM/dd"
            placeholder="选择日期范围"
            @change="dateChange"
          />
          <el-input
            v-model="identifier"
            class="input-m"
            placeholder="手机号/订单号"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="numberSearch"
            />
          </el-input>
          <el-select
            v-model="order_class"
            placeholder="请选择订单类型"
            @change="TypeHandle"
          >
            <el-option
              v-for="(item, index) in order_class_array"
              :key="index"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
          <el-autocomplete
            v-model="source_name"
            class="inline-input"
            :fetch-suggestions="querySearch"
            placeholder="请输入来源"
            @select="sourceSearch"
          />
          <el-select
            v-model="distributor_id"
            placeholder="请选择店铺"
            @change="distributorSelectHandle"
          >
            <el-option
              v-for="(item, index) in distributorList"
              :key="index"
              :label="item.name"
              :value="item.distributor_id"
            />
          </el-select>
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
          label="待发货"
          name="notship"
        />
        <el-tab-pane
          label="已完成"
          name="done"
        />
        <el-tab-pane
          label="未支付"
          name="notpay"
        />
        <el-tab-pane
          label="已取消"
          name="cancel"
        />
        <el-table
          v-loading="loading"
          :data="list"
          style="width: 100%"
          :height="wheight - 190"
          element-loading-text="数据加载中"
        >
          <el-table-column
            prop="order_id"
            width="280"
            label="订单号"
          >
            <template slot-scope="scope">
              <div class="order-num">
                {{ scope.row.order_id }}
                <el-tooltip
                  effect="dark"
                  content="复制"
                  placement="top-start"
                >
                  <i
                    v-clipboard:copy="scope.row.order_id"
                    v-clipboard:success="onCopy"
                    class="el-icon-document-copy"
                  />
                </el-tooltip>
              </div>
              <div
                v-if="scope.row.distributor_name"
                class="order-store"
              >
                <el-tooltip
                  effect="dark"
                  content="店铺名"
                  placement="top-start"
                >
                  <i class="el-icon-office-building" />
                </el-tooltip>
                {{ scope.row.distributor_name }}
              </div>
              <div class="order-time">
                <el-tooltip
                  effect="dark"
                  content="下单时间"
                  placement="top-start"
                >
                  <i class="el-icon-time" />
                </el-tooltip>
                {{ scope.row.create_time | datetime('YYYY-MM-DD HH:mm:ss') }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            width="80"
            label="运费"
          >
            <template slot-scope="scope">
              <span class="cur">{{ scope.row.fee_symbol }}</span>{{ scope.row.freight_fee / 100 }}
            </template>
          </el-table-column>
          <!--
          <el-table-column width="70" label="商品金额">
            <template slot-scope="scope">
              {{scope.row.fee_symbol}}{{scope.row.item_fee / 100}}
            </template>
          </el-table-column>
          -->
          <el-table-column
            prop="total_fee"
            width="100"
            label="订单金额"
          >
            <template slot-scope="scope">
              <span class="cur">{{ scope.row.fee_symbol }}</span>{{ scope.row.total_fee / 100 }}
            </template>
          </el-table-column>
          <el-table-column
            prop="mobile"
            width="160"
            label="联系手机"
          >
            <template slot-scope="scope">
              <i class="el-icon-mobile" />
              {{ scope.row.mobile }}
              <el-tooltip
                v-if="datapass_block == 0"
                effect="dark"
                content="复制"
                placement="top-start"
              >
                <i
                  v-clipboard:copy="scope.row.mobile"
                  v-clipboard:success="onCopy"
                  class="el-icon-document-copy"
                />
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            width="90"
            label="类型"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.order_class == 'normal'">普通订单</span>
              <span v-if="scope.row.order_class == 'groups'">团购订单</span>
              <span v-if="scope.row.order_class == 'seckill'">秒杀订单</span>
            </template>
          </el-table-column>
          <!--
          <el-table-column prop="is_distribution" label="是否分销">
            <template slot-scope="scope">
              <span v-if="scope.row.is_distribution == 1"> 是 </span>
              <span v-else> - </span>
            </template>
          </el-table-column>
          -->
          <el-table-column
            width="140"
            label="状态"
          >
            <template slot-scope="scope">
              <!-- 订单状态 -->
              <el-tag
                v-if="scope.row.order_status == 'PAYED'"
                type="success"
                size="mini"
              >
                已支付
              </el-tag>
              <el-tag
                v-if="scope.row.order_status == 'NOTPAY'"
                size="mini"
              >
                未支付
              </el-tag>
              <el-tag
                v-if="scope.row.order_status == 'CANCEL'"
                type="danger"
                size="mini"
              >
                已取消
              </el-tag>
              <el-tag
                v-if="scope.row.order_status == 'WAIT_BUYER_CONFIRM'"
                type="danger"
                size="mini"
              >
                待收货
              </el-tag>
              <template v-if="scope.row.order_status != 'CANCEL'">
                <!-- 发货状态 -->
                <el-tag
                  v-if="scope.row.delivery_status == 'DONE'"
                  type="success"
                  size="mini"
                >
                  已发货
                </el-tag>
                <el-tag
                  v-else-if="scope.row.delivery_status == 'PARTAIL'"
                  type="danger"
                  size="mini"
                >
                  部分发货
                </el-tag>
                <el-tag
                  v-else-if="scope.row.ziti_status == 'PENDING'"
                  type="danger"
                  size="mini"
                >
                  待自提
                </el-tag>
                <el-tag
                  v-else-if="scope.row.ziti_status == 'DONE'"
                  type="danger"
                  size="mini"
                >
                  已自提
                </el-tag>
                <el-tag
                  v-else
                  size="mini"
                >
                  待发货
                </el-tag>
              </template>
            </template>
          </el-table-column>
          <el-table-column
            prop="source_name"
            label="来源"
          />
          <el-table-column
            width="90"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button type="text">
                <router-link
                  :to="{
                    path: matchHidePage('detail'),
                    query: { orderId: scope.row.order_id, resource: '/mall/trade/normalorders' }
                  }"
                >
                  详情
                </router-link>
              </el-button>
              <el-button
                v-if="
                  scope.row.receipt_type == 'logistics' &&
                    scope.row.order_status == 'PAYED' &&
                    scope.row.delivery_status != 'DONE'
                "
                type="text"
                @click="deliveryAction(scope.row.order_id)"
              >
                发货
              </el-button>
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
      </el-tabs>

      <!-- 发货-开始 -->
      <el-dialog
        :title="deliveryTitle"
        :visible.sync="deliveryVisible"
        :before-close="handleCancel"
      >
        <template>
          <el-form
            ref="deliveryForm"
            :model="deliveryForm"
            class="demo-ruleForm"
            label-width="90px"
          >
            <el-form-item label="订单号">
              <el-col :span="20">
                {{ deliveryData.orderInfo.order_id }}
              </el-col>
            </el-form-item>
            <el-form-item label="商品信息">
              <el-col :span="30">
                <el-table
                  :data="deliveryData.orderInfo.items"
                  style="width: 100%"
                >
                  <el-table-column
                    prop="item_name"
                    label="商品名"
                    width="180"
                  />
                  <el-table-column
                    prop="num"
                    label="数量"
                    width="180"
                  />
                  <el-table-column label="总价(元)">
                    <template slot-scope="scope">
                      <span>￥{{ scope.row.total_fee / 100 }}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-form-item>
            <el-form-item label="快递公司">
              <el-col>
                <el-select
                  v-model="deliveryForm.delivery_corp"
                  filterable
                  placeholder="请选择快递公司，可搜索"
                >
                  <el-option
                    v-for="item in dlycorps"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="快递单号">
              <el-col
                :span="14"
              >
                <el-input
                  v-model="deliveryForm.delivery_code"
                  :maxlength="20"
                  placeholder="物流公司单号"
                />
              </el-col>
            </el-form-item>
          </el-form>
        </template>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click.native="handleCancel">
            取消
          </el-button>
          <el-button
            type="primary"
            @click="submitDeliveryAction"
          >
            确定
          </el-button>
        </div>
      </el-dialog>
    </div>
    <router-view />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getOrderList, getOrderDetail, delivery } from '../../../api/trade'
import { getSourcesList } from '../../../api/datacube'
import hqbdlycorp from '../../../common/hqbdlycorp.json'
import { getDistributorList } from '../../../api/marketing'

export default {
  data () {
    return {
      activeName: 'all',
      loading: false,
      create_time: '',
      params: {
        page: 1,
        pageSize: 20
      },
      order_class_array: [
        { name: '全部订单', value: '' },
        { name: '团购订单', value: 'groups' },
        { name: '秒杀订单', value: 'seckill' }
      ],
      order_status: '',
      time_start_begin: '',
      time_start_end: '',
      total_count: 0,
      order_type: 'normal',
      order_class: '',
      list: [],
      identifier: '',
      source_list: [],
      source_name: '',
      source_id: '',
      is_distribution: 1,

      deliveryVisible: false,
      deliveryTitle: '',
      deliveryData: {
        orderInfo: {}
      },
      deliveryForm: {
        order_id: '',
        delivery_corp: '',
        delivery_code: ''
      },
      dlycorps: hqbdlycorp,
      distributor_id: '',
      distributorList: [],
      datapass_block: 1
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted () {
    this.getDistributor()
    this.getParams()
    this.getOrders(this.params)
    this.getAllSourcesList()
  },
  methods: {
    onCopy () {
      this.$notify({
        message: '复制成功',
        type: 'success'
      })
    },
    // 切换tab
    handleClick (tab, event) {
      this.activeName = tab.name
      this.params.order_status = tab.name == 'all' ? '' : tab.name
      this.params.page = 1
      this.getParams()
      this.getOrders(this.params)
    },
    orderStatusSelectHandle () {
      this.params.order_status = this.order_status
      this.getParams()
      this.params.page = 1
      this.getOrders(this.params)
    },
    distributorSelectHandle () {
      this.params.distributor_id = this.distributor_id
      this.getParams()
      this.params.page = 1
      this.getOrders(this.params)
    },
    numberSearch (e) {
      this.getParams()
      this.params.page = 1
      this.getOrders(this.params)
    },
    dateChange (val) {
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
    sourceSearch (item) {
      this.params.source_id = item.source_id
      this.getParams()
      this.params.page = 1
      this.getOrders(this.params)
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.loading = false
      this.getParams()
      this.getOrders(this.params)
    },
    TypeHandle (val) {
      this.params.page = 1
      this.getParams()
      this.getOrders(this.params)
    },
    getParams () {
      this.params.time_start_begin = this.time_start_begin
      this.params.time_start_end = this.time_start_end
      this.params.order_type = this.order_type
      this.params.order_class = this.order_class
      this.params.order_class_exclude = 'community'
      this.params.is_distribution = 1 //this.is_distribution
      if (this.identifier.length == 11) {
        this.params.mobile = this.identifier
        this.params.order_id = ''
      } else {
        this.params.mobile = ''
        this.params.order_id = this.identifier
      }
    },
    dateStrToTimeStamp (str) {
      return Date.parse(new Date(str)) / 1000
    },
    getOrders (filter) {
      this.loading = true
      getOrderList(filter).then((response) => {
        this.list = response.data.data.list
        this.total_count = Number(response.data.data.pager.count)
        this.datapass_block = response.data.data.datapass_block
        this.loading = false
      })
    },
    getAllSourcesList () {
      let params = { page: 1, pageSize: 1000 }
      getSourcesList(params).then((response) => {
        if (response.data.data.list) {
          response.data.data.list.forEach((row) => {
            this.source_list.push({ 'value': row.sourceName, 'source_id': row.sourceId })
          })
        }
      })
    },
    querySearch (queryString, cb) {
      var restaurants = this.source_list
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter (queryString) {
      return (restaurant) => {
        return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    deliveryAction (order_id) {
      // 编辑物料弹框
      this.deliveryTitle = '发货'
      this.deliveryVisible = true
      getOrderDetail(order_id).then((response) => {
        this.deliveryData = response.data.data
      })
      this.deliveryForm.order_id = order_id
    },
    handleCancel () {
      this.deliveryVisible = false
      this.deliveryForm.order_id = ''
      this.deliveryForm.delivery_corp = ''
      this.deliveryForm.delivery_code = ''
    },
    submitDeliveryAction () {
      // 提交物料
      delivery(this.deliveryForm).then((response) => {
        if (response.data.data.delivery_status == 'DONE') {
          this.handleCancel()
          this.$message.success('发货成功!')
          this.getOrders(this.params)
        } else {
          this.$message.error('发货失败!')
          return false
        }
      })
    },
    getDistributor () {
      var params = { page: 1, pageSize: 500 }
      getDistributorList(params).then((response) => {
        if (response.data.data.list) {
          this.distributorList = response.data.data.list
        }
      })
    }
  }
}
</script>
