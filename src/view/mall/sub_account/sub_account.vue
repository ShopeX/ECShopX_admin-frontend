<template>
  <div class="zyk_adapay_account">
    <el-form
      v-if="$route.path.indexOf('detail') === -1"
      ref="ruleForm"
      :model="form"
      class="demo-ruleForm"
      label-width="100px"
    >
      <el-card
        class="box-card"
        shadow="never"
      >
        <div
          slot="header"
          class="clearfix"
        >
          <span>交易单</span>
        </div>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item
              label="订单号"
              prop="order_id"
            >
              <el-input v-model="form.order_id" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="交易流水号"
              prop="trade_id"
            >
              <el-input v-model="form.trade_id" />
            </el-form-item>
          </el-col>
          <el-col
            v-if="$store.getters.login_type != 'distributor'"
            :span="8"
          >
            <el-form-item
              label="店铺名称"
              prop="distributor_name"
            >
              <el-input v-model="form.distributor_name" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="支付方式"
              prop="pay_type"
            >
              <el-select
                v-model="form.pay_type"
                style="width: 100%"
              >
                <el-option
                  label="微信小程序支付"
                  value="wx_lite"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="交易状态"
              prop="status"
            >
              <el-select
                v-model="form.status"
                style="width: 100%"
              >
                <el-option
                  label="支付完成"
                  value="SUCCESS"
                />
                <el-option
                  label="部分退款"
                  value="PARTIAL_REFUND"
                />
                <el-option
                  label="全额退款"
                  value="FULL_REFUND"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="分账状态"
              prop="adapay_div_status"
            >
              <el-select
                v-model="form.adapay_div_status"
                style="width: 100%"
              >
                <el-option
                  label="未分账"
                  value="NOTDIV"
                />
                <el-option
                  label="已分账"
                  value="DIVED"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col
            v-if="$store.getters.login_type == 'admin'"
            :span="8"
          >
            <el-form-item
              label="手续费扣费方式"
              prop="adapay_fee_mode"
            >
              <el-select
                v-model="form.adapay_fee_mode"
                style="width: 100%"
              >
                <el-option
                  label="内扣"
                  value="I"
                />
                <el-option
                  label="外扣"
                  value="O"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="时间范围"
              prop="time"
            >
              <el-date-picker
                v-model="form.time"
                value-format="timestamp"
                style="width: 100%"
                type="daterange"
                :default-time="['00:00:00', '23:59:59']"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="timeHandle"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item style="text-align: right">
          <el-button
            type="primary"
            size="medium"
            @click="queryHandle"
          >
            查询
          </el-button>
          <el-button
            type="info"
            size="medium"
            @click="resetForm('ruleForm')"
          >
            清空
          </el-button>
        </el-form-item>
        <el-row
          :gutter="20"
          class="group"
        >
          <el-col
            v-if="$store.getters.login_type != 'distributor'"
            :span="6"
            class="item"
          >
            <p class="title">
              订单总额
            </p>
            <p class="money">
              ￥ {{ (total.totalFee / 100) | formatNumMoney }}
            </p>
          </el-col>
          <el-col
            :span="6"
            class="item"
          >
            <p class="title">
              交易总额
            </p>
            <p class="money">
              ￥ {{ (total.payFee / 100) | formatNumMoney }}
            </p>
          </el-col>
          <el-col
            v-if="$store.getters.login_type == 'distributor'"
            :span="6"
            class="item"
          >
            <p class="title">
              支付总额
            </p>
            <p class="money">
              ￥ {{ (total.totalFee / 100) | formatNumMoney }}
            </p>
          </el-col>
          <el-col
            :span="6"
            class="item"
          >
            <p class="title">
              分账总额
            </p>
            <p class="money">
              ￥ {{ (total.divFee / 100) | formatNumMoney }}
            </p>
          </el-col>
          <el-col
            v-if="$store.getters.login_type == 'normal' || $store.getters.login_type == 'admin'"
            :span="6"
            class="item"
          >
            <p class="title">
              手续费总额
            </p>
            <p class="money">
              ￥ {{ (total.adapayFee / 100) | formatNumMoney }}
            </p>
          </el-col>
        </el-row>
        <!-- tablelist -->
        <div class="tablelist">
          <el-row style="text-align: right">
            <export-tip @exportHandle="exportFile">
              <el-button
                type="primary"
                size="medium"
              >
                导出文件
              </el-button>
            </export-tip>
          </el-row>
          <el-table
            v-loading="loading"
            :data="list"
            style="width: 100%"
          >
            <el-table-column
              label="订单号"
              prop="orderId"
            />
            <template v-if="$store.getters.login_type != 'distributor'">
              <el-table-column
                label="商铺名称"
                prop="distributor_name"
              />
            </template>
            <template>
              <el-table-column
                label="交易流水号"
                prop="tradeId"
              />
              <el-table-column label="支付方式">
                <template slot-scope="scope">
                  <span v-if="scope.row.payChannel == 'wx_lite'">微信小程序支付</span>
                </template>
              </el-table-column>
            </template>

            <el-table-column
              v-if="$store.getters.login_type != 'distributor'"
              label="订单金额"
            >
              <template slot-scope="scope">
                <span>{{ (scope.row.totalFee / 100) | formatNumMoney }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-if="$store.getters.login_type == 'distributor'"
              label="交易金额"
            >
              <template slot-scope="scope">
                <span>{{ (scope.row.totalFee / 100) | formatNumMoney }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="交易状态"
              prop="tradeState"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.tradeState == 'SUCCESS'">支付完成</span>
                <span v-else-if="scope.row.tradeState == 'PARTIAL_REFUND'">部分退款</span>
                <span v-else-if="scope.row.tradeState == 'FULL_REFUND'">全额退款</span>
                <!-- <span v-else-if="scope.row.tradeState =='CLOSED'">已关闭</span>
                  <span v-else-if="scope.row.tradeState =='REVOKED'">已撤销</span>
                  <span v-else-if="scope.row.tradeState =='PAYERROR'">支付失败</span> -->
              </template>
            </el-table-column>
            <el-table-column label="退款金额">
              <template slot-scope="scope">
                <span>{{ (scope.row.refundedFee / 100) | formatNumMoney }}</span>
              </template>
            </el-table-column>
            <el-table-column label="是否分账">
              <template slot-scope="scope">
                <span v-if="scope.row.adapayDivStatus == 'NOTDIV'">未分账</span>
                <span v-else-if="scope.row.adapayDivStatus == 'DIVED'">已分账</span>
              </template>
            </el-table-column>
            <template v-if="$store.getters.login_type == 'admin'">
              <el-table-column
                label="手续费扣费方式"
                prop="adapayFeeMode"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.adapayFeeMode == 'I'">内扣</span>
                  <span v-else-if="scope.row.adapayFeeMode == 'O'">外扣</span>
                  <span v-else>-</span>
                </template>
              </el-table-column>

              <el-table-column label="手续费">
                <template slot-scope="scope">
                  <span>{{ (scope.row.adapayFee / 100) | formatNumMoney }}</span>
                </template>
              </el-table-column>
            </template>
            <el-table-column label="分账金额">
              <template slot-scope="scope">
                <span>{{ (scope.row.divFee / 100) | formatNumMoney }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="创建日期"
              prop="timeStart"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.timeStart | formatTimestamp }}</span>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="100"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="goDetail(scope.row.tradeId)"
                >
                  查看
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination
              background
              :current-page="params.page"
              :page-sizes="[10, 20, 30]"
              :page-size="100"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total_count"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </el-card>
    </el-form>
    <router-view />
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        order_id: '', //订单号
        trade_id: '', // 交易流水号
        pay_type: '', //支付方式
        status: '', // 订单状态
        adapay_div_status: '', //分账状态,
        distributor_name: '', // 收款方 （店铺名称）
        adapay_fee_mode: '', //手续费扣费方式
        time: ''
      },
      params: {
        page: 1,
        pageSize: 10
      },
      loading: true,
      total_count: 0,
      total: {
        totalFee: '', //订单总额
        payFee: '', //交易总额
        divFee: '', // 分账总额
        adapayFee: '' // 手续费总额
      },
      list: [],
      // list:{
      //   orderId:'',//订单号，
      //   distributor_name:'',//商铺名称
      //   totalFee:'',//订单金额
      //   tradeState:'',// 交易状态
      //   refundedFee:'',//退款金额
      //   adapay_div_status:'',//是否分账
      //   adapayFeeMode:'', //手续费扣费方式
      //   adapayFee:'',//手续费
      //   divFee:'',//分账金额
      //   timeStart:'', //创建日期
      //   tradeId:'',// 交易流水号
      //   payType:'',// 支付方式
      // },
      time: {
        time_start_begin: '',
        time_start_end: ''
      }
    }
  },
  mounted () {
    this.getSub_account()
  },

  methods: {
    goDetail (id) {
      const path = this.$route.matched[0].path.match(/\/\w+/g)
      if (path[0] == '/shopadmin') {
        this.$router.push({
          path: `/shopadmin/order/adapay_trades/detail/${id}`
        })
      } else if (path[0] == '/dealer') {
        this.$router.push({
          path: `/dealer/trades/adapay_trades/detail/${id}`
        })
      } else {
        this.$router.push({
          path: `/order/adapay_trades/detail/${id}`
        })
      }
    },
    async getSub_account () {
      this.loading = true
      const { list, total, total_count } = await this.$api.adapay.subAccount({
        ...this.form,
        ...this.params,
        ...this.time
      })
      this.total = total
      this.list = list
      this.total_count = total_count
      this.loading = false
    },
    handleCurrentChange (page) {
      console.log(page)
      this.params.page = page
      this.getSub_account()
    },
    handleSizeChange (pageSize) {
      this.params.pageSize = pageSize
      this.getSub_account()
    },
    timeHandle (val) {
      this.time.time_start_begin = val[0]
      this.time.time_start_end = val[1]
    },
    queryHandle () {
      this.params = {
        page: 1,
        pageSize: 10
      }
      this.getSub_account()
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.form.pay_type = ''
      this.form.status = ''
    },
    async exportFile () {
      const { status } = await this.$api.adapay.exportFileList({
        ...this.form,
        ...this.params,
        ...this.time
      })
      if (status) {
        this.$message.success(`已加入执行队列，请在设置-导出列表中下载`)
      } else {
        this.$message.error(`导出失败`)
      }
    }
  }
}
</script>

<style lang="scss">
.zyk_adapay_account {
  .clearfix span {
    font-weight: 700;
  }
  label {
    font-size: 12px;
    color: #000;
  }
  .el-row {
    margin-bottom: 0px;
  }
  .el-form-item {
    margin-bottom: 12px;
  }
  .el-table th {
    background: #f5f5f5;
    color: #000;
  }
}
</style>

<style lang="scss" scoped>
.zyk_adapay_account {
  .group {
    margin: 30px 0;
    .item {
      border: 1px solid #f5f5f5;
      padding: 14px 0;
    }
    .title,
    .money {
      font-size: 18px;
      font-weight: 700;
      text-align: center;
    }
  }
  .tablelist {
    margin: 40px 0;
  }
  .pagination {
    margin: 20px 0;
    text-align: center;
  }
}
</style>
