<!-- * @description 提现记录 -->
<template>
  <div>
    <el-card v-if="loginType === 'distributor'">
      <el-row style="marginbottom: 0px">
        <el-form
          ref="topforms"
          :model="topforms"
          :rules="topformsrules"
        >
          <el-row
            type="flex"
            justify="space-around"
            style="marginbottom: 0px"
          >
            <el-col
              :span="5"
              class="left-cols-css"
            >
              <p class="title-fonts">
                当前可提现金额
              </p>
              <p class="title-fonts title-fonts-fs">
                ¥ {{ withdrawal_balance }}
              </p>
              <el-form-item
                v-if="distributormoneyList.withdraw_method === 2"
                prop="withdrawal_amount"
              >
                提现
                <el-input
                  v-model="topforms.withdrawal_amount"
                  size="mini"
                  :precision="2"
                  style="width: 150px"
                  @input="oninput"
                />
                元
              </el-form-item>
              <p
                v-if="distributormoneyList.withdraw_method === 2"
                style="margin-bottom: 15px"
              >
                提现限额：满
                <span
                  style="color: red"
                >¥ {{ distributormoneyList.distributor_money
                }}<span style="color: #000"> 元，可提现</span></span>
              </p>
              <el-button
                v-if="distributormoneyList.withdraw_method === 2"
                type="primary"
                @click="onSumbit"
              >
                提现
              </el-button>
            </el-col>
            <el-col
              :span="16"
              class="right-cols-css"
            >
              <p>1、当前可提现金额需大于或等于提现限额才可进行提现；</p>
              <p>2、提现操作请在10:00:00-23:59:59进行(仅可提现金额大于或等于提现限额)；</p>
              <p>
                3、根据支付公司逻辑，申请提现后一个工作日到账，节假日顺延具体提现信息请查询提现记录。
              </p>
            </el-col>
          </el-row>
        </el-form>
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
                size="small"
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
                @change="dateChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="提现状态">
              <el-select
                v-model="formData.cash_status"
                size="small"
                style="width: 100%"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="提现订单号">
              <el-input
                v-model="formData.order_id"
                style="width: 100%"
                size="small"
                placeholder="请输入提现订单号"
              />
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
                @update="storeSearch"
                @performInitChange="performInitChange"
              />
            </el-form-item>
          </el-col>
          <el-col
            v-if="loginType !== 'distributor'"
            :span="4"
            :push="8"
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
                @click="getCompanyDataList()"
              >
                搜索
              </el-button>
            </div>
          </el-col>
        </el-row>
        <el-row
          v-if="loginType === 'distributor'"
          :gutter="20"
        >
          <el-col
            :span="4"
            :push="20"
          >
            <div class="flex-right">
              <el-button @click="handleReset">
                重置
              </el-button>
              <el-button
                type="primary"
                @click="getCompanyDataList()"
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
          :span="4"
          class="total-num-box"
        >
          <p class="total-num-top-fonts">
            {{ allAccountList.count }}
          </p>
          <p class="total-num-bot-fonts">
            提现笔数
          </p>
        </el-col>
        <el-col
          :span="4"
          class="total-num-box"
        >
          <p class="total-num-top-fonts">
            ¥ {{ (allAccountList.total_amt / 100).toFixed(2) }}
          </p>
          <p class="total-num-bot-fonts">
            提现总金额
          </p>
        </el-col>
        <el-col
          :span="4"
          class="total-num-box"
        >
          <p class="total-num-top-fonts">
            ¥ {{ (allAccountList.finish_total_amt / 100).toFixed(2) }}
          </p>
          <p class="total-num-bot-fonts">
            提现成功金额
          </p>
        </el-col>
        <el-col
          :span="4"
          class="total-num-box"
        >
          <p class="total-num-top-fonts">
            ¥ {{ (allAccountList.total_amting / 100).toFixed(2) }}
          </p>
          <p class="total-num-bot-fonts">
            提现中金额
          </p>
        </el-col>
        <el-col
          :span="4"
          class="total-num-box"
        >
          <p class="total-num-top-fonts">
            ¥ {{ (allAccountList.fail_total_amt / 100).toFixed(2) }}
          </p>
          <p class="total-num-bot-fonts">
            提现失败金额
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
          type="primary"
          size="small"
          @click="onExportExcel()"
        >
          导出
        </el-button>
      </el-row>
      <el-table
        v-loading="loading"
        :data="allListData"
        stripe
        border
        style="width: 100%"
      >
        <el-table-column
          prop="created_at"
          label="日期"
          width="170"
        />
        <el-table-column
          prop="order_id"
          label="提现订单号"
          width="180"
        />
        <el-table-column
          prop="bind_card_id"
          label="到账银行卡号"
          width="180"
        />
        <el-table-column label="提现金额">
          <template slot-scope="scope">
            ￥{{ (scope.row.trans_amt / 100).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="loginType !== 'distributor'"
          prop="distributor_name"
          label="店铺名称"
          width="180"
        />
        <el-table-column
          prop="login_name"
          label="操作人"
          width="160"
        />
        <el-table-column
          prop="cash_status"
          label="提现状态"
        >
          <template slot-scope="scope">
            {{
              (scope.row.cash_status === '0' && '提现中') ||
                (scope.row.cash_status === '1' && '提现中') ||
                (scope.row.cash_status === '2' && '提现成功') ||
                (scope.row.cash_status === '3' && '提现失败')
            }}
          </template>
        </el-table-column>
        <el-table-column
          prop="resp_desc"
          label="备注"
          width="400"
        >
          <template slot-scope="scope">
            <p style="color: #027db4">
              {{ scope.row.resp_desc }}
            </p>
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
</template>
<script>
import { withdrawgetList, onSumbitsData, onCashExportData } from '@/api/datacube'
import { getStoreAccount, getWithdrawset } from '@/api/fenzhang'
import shopSelect from '@/components/shopSelect2'
import moment, { min } from 'moment'
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
      topforms: {
        withdrawal_amount: ''
      },
      topformsrules: {
        withdrawal_amount: [
          { type: 'string', message: '请输入金额', required: true, trigger: 'blur' },
          {
            pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
            message: '请输入正确格式,可保留两位小数'
          },
          { validator: this.validator }
        ]
      },
      params: {
        page: 1,
        page_size: 10
      },
      formData: {
        start_date: '',
        end_date: '',
        cash_status: '',
        order_id: '',
        distributor_id: ''
      },
      options: [
        { label: '全部', value: '' },
        { label: '提现中', value: 1 },
        { label: '提现成功', value: 2 },
        { label: '提现失败', value: 3 }
      ],
      allListData: [], // table数据
      allAccountList: {}, // 提现数据统计
      distributormoneyList: {}, // 提现限额/提现方式
      withdrawal_balance: 0, // 可提现金额
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
              // end_date.setTime(end_date.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit('pick', [start_date, end_date])
            }
          },
          {
            text: '最近三个月',
            onClick (picker) {
              const start_date = new Date()
              const end_date = new Date()
              start_date.setTime(start_date.getTime() - 3600 * 1000 * 24 * 90)
              // end_date.setTime(end_date.getTime() - 3600 * 1000 * 24 * 1);
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
    validator (rule, value, callback) {
      if (Number(value) > Number(this.withdrawal_balance)) {
        callback(new Error('提现金额不能大于当前可提现金额'))
      } else {
        callback()
      }
    },
    onSumbit () {
      // 设置提现金额
      if (Number(this.withdrawal_balance) < Number(this.distributormoneyList.distributor_money)) {
        this.$message.error('不满足提现条件')
        return
      }
      const { withdrawal_amount } = this.topforms
      this.$refs.topforms.validate((valid) => {
        if (valid) {
          this.$confirm(
            `<div style='margin-left:45px'>
              <p><i class="el-icon-warning" style='color:#E6A23C; font-size: 20px;margin-right:5px'></i>请确认您的提现金额: ¥ ${withdrawal_amount}</p>
              <p style='font-size:12px;margin-left:30px;color:#ccc'>操作后无法撤销，请再次确认您的提现金额</p>
            </div>`,
            '提现提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              dangerouslyUseHTMLString: true
            }
          ).then(() => {
            onSumbitsData({ withdrawal_amount }).then((res) => {
              this.$message({ type: 'success', message: '提现成功!' })
            })
          })
        } else {
          return false
        }
      })
    },
    oninput (value) {
      // 过滤小数点后两位
      if (value) {
        value.replace(/[^0-9.]/g, '')
        // if (Number(tixian) < Number(mintixian)) {
        //   this.$message.error('不满足提现条件')
        // }
      }
    },
    getCompanyDataList () {
      this.dataSource.loading = true
      withdrawgetList({ ...this.formData, ...this.params }).then((res) => {
        // 列表和统计
        this.allListData = res.data.data.list.data
        this.allAccountList = res.data.data.total
        let total = res.data.data.list.total_count
        this.dataSource = {
          total_count: Number(total),
          loading: false
        }
        this.loading = false
      })
      getStoreAccount({ ...this.formData, ...this.params }).then((res) => {
        // 获取当前可提现金额
        this.withdrawal_balance = res.data.data.totle.withdrawal_balance
      })
      getWithdrawset().then((res) => {
        // 获取提现限额和提现方式
        this.distributormoneyList = res.data.data
      })
    },
    performInitChange () {
      this.performInit = false
    },
    handleReset () {
      this.formData = {
        start_date: '',
        end_date: '',
        cash_status: '',
        order_id: '',
        distributor_id: ''
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
      // 导出
      onCashExportData(this.formData).then((response) => {
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
      var start = new Date()
      var end = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      // end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
      this.rangeData = [start, end]
      this.formData.start_date = moment(start).format('YYYY-MM-DD')
      this.formData.end_date = moment(end).format('YYYY-MM-DD')
    }
  }
}
</script>

<style lang="scss" scoped>
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
.left-cols-css {
  text-align: center;
  // .el-form-item__content > .el-form-item__error {
  //   left: 30% !important;
  // }
}
.title-fonts {
  font-weight: bold;
  color: #000;
  font-size: 16px;
  margin-bottom: 5px;
}
.title-fonts-fs {
  font-size: 28px;
}
.right-cols-css {
  background: #f2f2f2;
  padding: 0px 15px;
  p {
    color: #818181;
    font-size: 14px;
    margin-bottom: 13px;
  }
  p:first-child {
    margin-top: 20px;
  }
}
.tips-fonts {
  margin-left: 20px;
}
</style>
