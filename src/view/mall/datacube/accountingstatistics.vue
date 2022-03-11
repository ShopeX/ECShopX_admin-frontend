<!-- * @description 分账统计 -->
<template>
  <div>
    <div v-if="$route.path.indexOf('_detail') === -1">
      <el-card v-if="loginType === 'distributor'">
        <el-row style="marginbottom: 0px">
          <el-col
            :span="5"
            class="admin-total-num-box"
          >
            <p class="admin-total-num-top-fonts">
              ¥ {{ totalList.income }}
            </p>
            <p class="admin-total-num-bot-fonts">
              店铺总计收入(不含退款)
              <el-popover
                placement="bottom"
                width="200"
                trigger="hover"
                content="分账金额统计(不含退款)"
              >
                <i
                  slot="reference"
                  class="el-icon-question"
                  style="color: #c1c1c1; font-size: 16px"
                />
              </el-popover>
            </p>
          </el-col>
          <el-col
            :span="5"
            class="admin-total-num-box"
          >
            <p class="admin-total-num-top-fonts">
              ¥ {{ totalList.refund }}
            </p>
            <p class="admin-total-num-bot-fonts">
              店铺总退款金额
              <el-popover
                placement="bottom"
                width="220"
                trigger="hover"
                content="店铺总退款金额(已退款成功)"
              >
                <i
                  slot="reference"
                  class="el-icon-question"
                  style="color: #c1c1c1; font-size: 16px"
                />
              </el-popover>
            </p>
          </el-col>
          <el-col
            :span="5"
            class="admin-total-num-box"
          >
            <p class="admin-total-num-top-fonts">
              ¥ {{ totalList.unsettled_funds }}
            </p>
            <p class="admin-total-num-bot-fonts">
              店铺未结算金额
              <el-popover
                placement="bottom"
                width="420"
                trigger="hover"
                content="订单未过售后期进行分账的金额(不含全额退款成功及退款中)"
              >
                <i
                  slot="reference"
                  class="el-icon-question"
                  style="color: #c1c1c1; font-size: 16px"
                />
              </el-popover>
            </p>
          </el-col>
          <el-col
            :span="5"
            class="admin-total-num-box"
          >
            <p class="admin-total-num-top-fonts">
              ¥ {{ totalList.settlement_funds }}
            </p>
            <p class="admin-total-num-bot-fonts">
              店铺已结算金额
              <el-popover
                placement="bottom"
                width="230"
                trigger="hover"
                content="已进行分账且成功金额的总额"
              >
                <i
                  slot="reference"
                  class="el-icon-question"
                  style="color: #c1c1c1; font-size: 16px"
                />
              </el-popover>
            </p>
          </el-col>
          <el-col
            :span="4"
            class="admin-total-num-box"
          >
            <p class="admin-total-num-top-fonts">
              ¥ {{ totalList.withdrawal_balance }}
            </p>
            <p class="admin-total-num-bot-fonts">
              当前可提现余额
              <el-popover
                placement="bottom"
                width="200"
                trigger="hover"
                content="汇付店铺账户中当前余额"
              >
                <i
                  slot="reference"
                  class="el-icon-question"
                  style="color: #c1c1c1; font-size: 16px"
                />
              </el-popover>
            </p>
          </el-col>
        </el-row>
      </el-card>
      <el-card>
        <el-form
          :model="formData"
          label-width="100px"
        >
          <el-row style="marginbottom: 0px">
            <el-col :span="12">
              <el-form-item label="选择日期范围">
                <el-date-picker
                  v-model="rangeData"
                  type="daterange"
                  alue-format="yyyy-MM-dd"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  style="width: 100%"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd"
                  :clearable="false"
                  size="small"
                  @change="dateChange"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="结算状态">
                <el-select
                  v-model="formData.profitsharing_status"
                  style="width: 100%"
                  size="small"
                >
                  <el-option
                    v-for="item in profitOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="订单编号">
                <el-input
                  v-model="formData.order_id"
                  size="small"
                  placeholder="请输入订单编号"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="支付类型">
                <el-select
                  v-model="formData.app_pay_type"
                  size="small"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in payOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              v-if="loginType !== 'distributor'"
              :span="12"
            >
              <el-form-item label="选择店铺">
                <shop-select
                  ref="shopSelect"
                  size="small"
                  distributors
                  :perform-init="performInit"
                  :shop-id-default="formData.distributor_id"
                  @update="storeSearch"
                  @performInitChange="performInitChange"
                />
              </el-form-item>
            </el-col>
            <!-- <el-col :span="6">
              <el-form-item label="订单状态">
                <el-select size='small' v-model="formData.order_status" style="width: 100%;">
                  <el-option
                    v-for="item in statusOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col> -->
            <el-col
              v-if="loginType === 'distributor'"
              :span="4"
              :push="14"
              style="margin-left: 10px"
            >
              <div class="flex-right">
                <el-button
                  size="small"
                  @click="handleReset"
                >
                  重置
                </el-button>
                <el-button
                  size="small"
                  type="primary"
                  @click="getCompanyDataList"
                >
                  搜索
                </el-button>
              </div>
            </el-col>
          </el-row>
          <el-row
            v-if="loginType !== 'distributor'"
            :gutter="20"
          >
            <el-col
              :span="4"
              :push="20"
            >
              <div class="flex-right">
                <el-button
                  size="small"
                  @click="handleReset"
                >
                  重置
                </el-button>
                <el-button
                  size="small"
                  type="primary"
                  @click="getCompanyDataList"
                >
                  搜索
                </el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <el-card>
        <el-row style="marginbottom: 0px">
          <el-col
            :span="3"
            class="total-num-box"
          >
            <p class="total-num-top-fonts">
              {{ allAccountList.order_count }}
            </p>
            <p class="total-num-bot-fonts">
              交易总笔数
            </p>
          </el-col>
          <el-col
            :span="3"
            class="total-num-box"
          >
            <p class="total-num-top-fonts">
              ¥ {{ allAccountList.order_total_fee }}
            </p>
            <p class="total-num-bot-fonts">
              总计交易金额(含退款)
            </p>
          </el-col>
          <el-col
            :span="3"
            class="total-num-box"
          >
            <p class="total-num-top-fonts">
              {{ allAccountList.order_refund_count }}
            </p>
            <p class="total-num-bot-fonts">
              已退款总笔数
            </p>
          </el-col>
          <el-col
            :span="3"
            class="total-num-box"
          >
            <p class="total-num-top-fonts">
              ¥ {{ allAccountList.order_refund_total_fee }}
            </p>
            <p class="total-num-bot-fonts">
              退款总金额(退款成功)
            </p>
          </el-col>
          <el-col
            :span="3"
            class="total-num-box"
          >
            <p class="total-num-top-fonts">
              {{ allAccountList.order_refunding_count }}
            </p>
            <p class="total-num-bot-fonts">
              在退总笔数
            </p>
          </el-col>
          <el-col
            :span="3"
            class="total-num-box"
          >
            <p class="total-num-top-fonts">
              ¥ {{ allAccountList.order_refunding_total_fee }}
            </p>
            <p class="total-num-bot-fonts">
              在退总金额(退款中)
            </p>
          </el-col>
          <el-col
            :span="3"
            class="total-num-box"
          >
            <p class="total-num-top-fonts">
              ¥ {{ allAccountList.order_profit_sharing_charge }}
            </p>
            <p class="total-num-bot-fonts">
              已结算手续费总额
            </p>
          </el-col>
          <el-col
            :span="3"
            class="total-num-box"
          >
            <p class="total-num-top-fonts">
              ¥ {{ allAccountList.order_un_profit_sharing_charge }}
            </p>
            <p class="total-num-bot-fonts">
              未结算手续费总额
              <el-popover
                v-if="loginType !== 'distributor'"
                placement="left"
                width="500"
                trigger="hover"
              >
                <div class="popover-box">
                  <h3>根据上面筛选条件进行统计</h3>
                  <h3>交易总笔数</h3>
                  <p>当前筛选条件下交易总笔数</p>
                  <h3>总计交易金额</h3>
                  <p>当前筛选条件下交易金额(包含所有退款状态)</p>
                  <h3>已退总笔数</h3>
                  <p>当前筛选条件下退款成功笔数(多笔部分退款按退款成功次数记录)</p>
                  <h3>退款总金额(退款成功)</h3>
                  <p>仅记录当前筛选条件下退款成功总金额</p>
                  <h3>在退总笔数</h3>
                  <p>当前筛选条件下退款中总笔数</p>
                  <h3>在退总金额(退款中)</h3>
                  <p>当前筛选条件下退款中总金额</p>
                  <h3>未结算手续费总额</h3>
                  <p>当前筛选条件下未结算状态中手续费总额</p>
                  <h3>已结算手续费总额</h3>
                  <p>当前筛选条件下已结算状态中手续费总额</p>
                </div>
                <i
                  slot="reference"
                  class="el-icon-question"
                  style="color: #c1c1c1; font-size: 16px"
                />
              </el-popover>
            </p>
          </el-col>
        </el-row>
      </el-card>
      <el-card>
        <el-row
          type="flex"
          justify="end"
        >
          <el-button
            size="small"
            type="primary"
            @click="onExportExcel()"
          >
            导出
          </el-button>
        </el-row>
        <el-table
          v-loading="loading"
          :data="tableDataList"
          stripe
          border
          style="width: 100%"
        >
          <el-table-column
            prop="create_time"
            label="日期"
            width="180"
          />
          <el-table-column
            prop="order_id"
            label="订单号"
            width="180"
          />
          <el-table-column
            v-if="loginType === 'distributor'"
            prop="app_pay_type_desc"
            label="支付类型"
            width="150"
          />
          <el-table-column
            prop="profitsharing_status"
            label="结算状态"
          >
            <template slot-scope="scope">
              {{
                scope.row.profitsharing_status === '1' || scope.row.profitsharing_status === 1
                  ? '未结算'
                  : '已结算'
              }}
            </template>
          </el-table-column>
          <el-table-column
            label="交易金额(含退款)"
            width="170"
          >
            <template
              slot-scope="scope"
            >
              <p style="color: #67c23a">
                ￥{{ (scope.row.total_fee / 100).toFixed(2) }}
              </p>
            </template>
          </el-table-column>
          <el-table-column
            label="平台手续费(含退款)"
            width="170"
          >
            <template slot-scope="scope">
              ￥{{ (scope.row.charge / 100).toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="loginType !== 'distributor'"
            prop="distributor_name"
            label="店铺名称"
            width="180"
          />
          <el-table-column
            label="退款金额"
            width="160"
          >
            <template
              slot-scope="scope"
            >
              <p style="color: #d9001b">
                ￥{{ (scope.row.refund_fee / 100).toFixed(2) }}
              </p>
            </template>
          </el-table-column>
          <el-table-column
            prop="order_status"
            label="订单状态"
          >
            <template slot-scope="scope">
              {{
                (scope.row.order_status === 'refunding' && '退款中') ||
                  (scope.row.order_status === 'pay' && '支付成功  ') ||
                  (scope.row.order_status === 'refundsuccess' && '退款成功') ||
                  (scope.row.order_status === 'refundfail' && '退款失败') ||
                  (scope.row.order_status === 'NOTPAY' && '未支付') ||
                  (scope.row.order_status === 'PART_PAYMENT' && '部分付款') ||
                  (scope.row.order_status === 'WAIT_GROUPS_SUCCESS' && '等待拼团成功') ||
                  (scope.row.order_status === 'PAYED' && '已支付') ||
                  (scope.row.order_status === 'CANCEL' && '已取消') ||
                  (scope.row.order_status === 'WAIT_BUYER_CONFIRM' && '待用户收货')
              }}
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="100"
          >
            <template slot-scope="scope">
              <router-link
                :to="{ path: matchHidePage('detail'), query: { orderId: scope.row.order_id } }"
              >
                详情
              </router-link>
            </template>
          </el-table-column>
        </el-table>
        <div class="content-padded content-center">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :current-page="params.page"
            :page-sizes="[10, 20, 50]"
            :total="dataSource.total_count"
            :page-size="params.page_size"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
    </div>
    <router-view />
  </div>
</template>
<script>
import { GetAccountStatisList, onOrderExportData } from '@/api/datacube'
import { getStoreAccount } from '@/api/fenzhang'
import shopSelect from '@/components/shopSelect2'
import moment from 'moment'
export default {
  components: {
    shopSelect
  },
  data () {
    return {
      dateRange: [],
      loginType: this.$store.getters.login_type,
      rangeData: '',
      loading: true,
      performInit: false,
      dataSource: {
        total_count: 0,
        loading: false
      },
      params: {
        page: 1,
        page_size: 10
      },
      formData: {
        start_date: '',
        end_date: '',
        profitsharing_status: 0,
        order_id: '',
        app_pay_type: '',
        distributor_id: '',
        order_status: ''
      },
      profitOptions: [
        // 结算状态
        { label: '全部', value: 0 },
        { label: '已结算', value: 2 },
        { label: '未结算', value: 1 }
      ],
      payOptions: [
        // 支付类型
        { label: '全部', value: '' },
        { label: '微信正扫', value: '01' },
        { label: '支付宝正扫', value: '02' },
        { label: '银联正扫', value: '03' },
        { label: '微信公众号', value: '05' },
        { label: '支付宝小程序/生活号', value: '06' },
        { label: '微信小程序', value: '07' },
        { label: '微信正扫(直连)', value: '08' },
        { label: '微信app支付(直连)', value: '09' },
        { label: '银联app支付', value: '10' },
        { label: 'apple支付', value: '11' },
        { label: '微信H5支付(直连)', value: '12' },
        { label: '支付宝app支付(直连)', value: '13' }
      ],
      statusOption: [
        // 订单状态
        { label: '全部', value: '' },
        { label: '退款中', value: 'refunding' },
        { label: '支付成功', value: 'pay' },
        { label: '退款成功', value: 'refundsuccess' },
        { label: '退款失败', value: 'refundfail' }
      ],
      tableDataList: [],
      allAccountList: {},
      totalList: {},
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          if (minDate && !maxDate) this.dateRange[0] = minDate
          if (maxDate) this.dateRange[1] = maxDate
        },
        disabledDate: (time) => {
          if (this.dateRange) {
            let currentTime = this.dateRange[0]
            let threeMonths = 60 * 60 * 1000 * 24 * 90
            if (currentTime) {
              return (
                time.getTime() > currentTime.getTime() + threeMonths ||
                time.getTime() < currentTime.getTime() - threeMonths
              )
            }
          }
        },
        shortcuts: [
          {
            text: '最近一个月',
            onClick (picker) {
              const start_date = new Date()
              const end_date = new Date()
              start_date.setTime(start_date.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start_date, end_date])
            }
          },
          {
            text: '最近三个月',
            onClick (picker) {
              const start_date = new Date()
              const end_date = new Date()
              start_date.setTime(start_date.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start_date, end_date])
            }
          }
        ]
      }
    }
  },
  mounted () {
    this.initDate()
    this.getCompanyDataList()
  },
  methods: {
    getCompanyDataList () {
      // 搜索
      this.dataSource.loading = true
      GetAccountStatisList({ ...this.formData, ...this.params })
        .then((res) => {
          this.tableDataList = res.data.data.list.data
          this.allAccountList = res.data.data.total
          let total = res.data.data.list.total_count
          this.dataSource = {
            total_count: Number(total),
            loading: false
          }
          if (this.loginType === 'distributor') {
            getStoreAccount({ ...this.formData, ...this.params }).then((res) => {
              this.totalList = res.data.data.totle
            })
          }
          this.loading = false
        })
        .catch((error) => {
          this.$message({
            type: 'error',
            message: '获取统计信息出错'
          })
        })
    },
    performInitChange () {
      this.performInit = false
    },
    handleReset () {
      this.formData = {
        start_date: '',
        end_date: '',
        profitsharing_status: 0,
        order_id: '',
        app_pay_type: '',
        distributor_id: '',
        order_status: ''
      }
      this.performInit = true
      this.initDate()
    },
    dateChange (val) {
      if (val) {
        this.formData.start_date = val[0]
        this.formData.end_date = val[1]
      }
    },
    storeSearch (val) {
      this.formData.distributor_id = val.shop_id
    },
    handleSizeChange (pageSize) {
      this.params.page = 1
      this.params.page_size = pageSize
      this.getCompanyDataList()
    },
    handleCurrentChange (page_num) {
      this.params.page = page_num
      this.getCompanyDataList()
    },
    onExportExcel () {
      // 表格导出
      onOrderExportData(this.formData).then((response) => {
        const { status, url, filename } = response.data.data
        if (status) {
          this.$message({
            type: 'success',
            message: '已加入执行队列，请在设置-导出列表中下载'
          })
          return
        } else {
          this.$message({
            type: 'error',
            message: '无内容可导出 或 执行失败，请检查重试'
          })
          return
        }
      })
    },
    initDate () {
      // 初始化日期
      var start = new Date()
      var end = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      this.rangeData = [start, end]
      this.formData.start_date = moment(start).format('YYYY-MM-DD')
      this.formData.end_date = moment(end).format('YYYY-MM-DD')
    }
  }
}
</script>

<style lang="scss" scoped>
.admin-total-num-box {
  border-radius: 0px;
  border-right: 1px solid #ccc;
  p {
    text-align: center;
  }
}
.admin-total-num-box:last-child {
  border-right: none;
}
.admin-total-num-top-fonts {
  font-weight: bold;
  font-size: 22px;
}
.admin-total-num-bot-fonts {
  margin-top: 10px;
  font-size: 16px;
}
.total-num-box {
  padding: 5px 0px;
  p {
    text-align: center;
  }
}
.total-num-top-fonts {
  font-size: 22px;
  font-weight: bold;
}
.total-num-bot-fonts {
  font-size: 14px;
  margin-top: 10px;
}
.popover-box {
  padding: 10px 0px;
  h3 {
    color: #000;
    font-weight: bold;
    margin-top: 12px;
  }
  h3:first-child {
    margin-top: 0px;
  }
}
</style>
