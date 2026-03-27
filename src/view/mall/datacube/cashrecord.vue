<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-card v-if="loginType === 'distributor'">
      <el-row style="marginbottom: 0px">
        <el-form ref="topforms" :model="topforms" :rules="topformsrules">
          <el-row type="flex" justify="space-around" style="marginbottom: 0px">
            <el-col :span="5" class="left-cols-css">
              <p class="title-fonts">{{ $t('a6226f20.9c893e') }}</p>
              <p class="title-fonts title-fonts-fs">¥ {{ withdrawal_balance }}</p>
              <el-form-item
                v-if="distributormoneyList.withdraw_method === 2"
                prop="withdrawal_amount"
              >
                {{ $t('a6226f20.db7971') }}
                <el-input
                  v-model="topforms.withdrawal_amount"
                  size="mini"
                  :precision="2"
                  style="width: 150px"
                  @input="oninput"
                />
                {{ $t('a6226f20.c16655') }}
              </el-form-item>
              <p v-if="distributormoneyList.withdraw_method === 2" style="margin-bottom: 15px">
                {{ $t('a6226f20.ee6ce8') }}
                <span style="color: red"
                  >¥ {{ distributormoneyList.distributor_money
                  }}<span style="color: #000">{{ $t('a6226f20.415e87') }}</span></span
                >
              </p>
              <el-button
                v-if="distributormoneyList.withdraw_method === 2"
                type="primary"
                @click="onSumbit"
              >
                {{ $t('a6226f20.db7971') }}
              </el-button>
            </el-col>
            <el-col :span="16" class="right-cols-css">
              <p>{{ $t('a6226f20.3c35d5') }}</p>
              <p>{{ $t('a6226f20.469b45') }}</p>
              <p>{{ $t('a6226f20.38163d') }}</p>
            </el-col>
          </el-row>
        </el-form>
      </el-row>
    </el-card>
    <el-card>
      <el-form :model="formData" label-width="100px">
        <el-row style="marginbottom: 0px">
          <el-col :span="12">
            <el-form-item :label="$t('a6226f20.786622')">
              <el-date-picker
                v-model="rangeData"
                size="small"
                type="daterange"
                alue-format="yyyy-MM-dd"
                align="right"
                unlink-panels
                :range-separator="$t('a6226f20.981cbe')"
                :start-placeholder="$t('a6226f20.b44c0f')"
                :end-placeholder="$t('a6226f20.1d468b')"
                style="width: 100%"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd"
                :clearable="false"
                @change="dateChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('a6226f20.0ed783')">
              <el-select v-model="formData.cash_status" size="small" style="width: 100%">
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
            <el-form-item :label="$t('a6226f20.51c30a')">
              <el-input
                v-model="formData.order_id"
                style="width: 100%"
                size="small"
                :placeholder="$t('a6226f20.5e4087')"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="loginType !== 'distributor'" :span="12">
            <el-form-item :label="$t('a6226f20.afa2e6')">
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
          <el-col v-if="loginType !== 'distributor'" :span="4" :push="8" style="margin-left: 10px">
            <div class="flex-right">
              <el-button size="small" @click="handleReset">{{ $t('a6226f20.4b9c32') }}</el-button>
              <el-button size="small" type="primary" @click="getCompanyDataList()">
                {{ $t('a6226f20.e5f71f') }}
              </el-button>
            </div>
          </el-col>
        </el-row>
        <el-row v-if="loginType === 'distributor'" :gutter="20">
          <el-col :span="4" :push="20">
            <div class="flex-right">
              <el-button @click="handleReset">{{ $t('a6226f20.4b9c32') }}</el-button>
              <el-button type="primary" @click="getCompanyDataList()">
{{
                $t('a6226f20.e5f71f')
              }}
</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <el-row style="marginbottom: 0px">
        <el-col :span="4" class="total-num-box">
          <p class="total-num-top-fonts">
            {{ allAccountList.count }}
          </p>
          <p class="total-num-bot-fonts">{{ $t('a6226f20.8b0c51') }}</p>
        </el-col>
        <el-col :span="4" class="total-num-box">
          <p class="total-num-top-fonts">¥ {{ (allAccountList.total_amt / 100).toFixed(2) }}</p>
          <p class="total-num-bot-fonts">{{ $t('a6226f20.7f6e2e') }}</p>
        </el-col>
        <el-col :span="4" class="total-num-box">
          <p class="total-num-top-fonts">
            ¥ {{ (allAccountList.finish_total_amt / 100).toFixed(2) }}
          </p>
          <p class="total-num-bot-fonts">{{ $t('a6226f20.f59dea') }}</p>
        </el-col>
        <el-col :span="4" class="total-num-box">
          <p class="total-num-top-fonts">¥ {{ (allAccountList.total_amting / 100).toFixed(2) }}</p>
          <p class="total-num-bot-fonts">{{ $t('a6226f20.466d29') }}</p>
        </el-col>
        <el-col :span="4" class="total-num-box">
          <p class="total-num-top-fonts">
            ¥ {{ (allAccountList.fail_total_amt / 100).toFixed(2) }}
          </p>
          <p class="total-num-bot-fonts">{{ $t('a6226f20.5cf040') }}</p>
        </el-col>
      </el-row>
    </el-card>
    <el-card>
      <el-row type="flex" justify="end">
        <el-button type="primary" size="small" @click="onExportExcel()">
{{
          $t('a6226f20.55405e')
        }}
</el-button>
      </el-row>
      <el-table v-loading="loading" :data="allListData" stripe border style="width: 100%">
        <el-table-column prop="created_at" :label="$t('a6226f20.4ff1e7')" width="170" />
        <el-table-column prop="order_id" :label="$t('a6226f20.51c30a')" width="180" />
        <el-table-column prop="bind_card_id" :label="$t('a6226f20.e6f7d9')" width="180" />
        <el-table-column :label="$t('a6226f20.292a28')">
          <template slot-scope="scope"> ￥{{ (scope.row.trans_amt / 100).toFixed(2) }} </template>
        </el-table-column>
        <el-table-column
          v-if="loginType !== 'distributor'"
          prop="distributor_name"
          :label="$t('a6226f20.0d4934')"
          width="180"
        />
        <el-table-column prop="login_name" :label="$t('a6226f20.f9ac4b')" width="160" />
        <el-table-column prop="cash_status" :label="$t('a6226f20.0ed783')">
          <template slot-scope="scope">
            {{
              (scope.row.cash_status === '0' && $t('a6226f20.153430')) ||
              (scope.row.cash_status === '1' && $t('a6226f20.153430')) ||
              (scope.row.cash_status === '2' && $t('a6226f20.dca060')) ||
              (scope.row.cash_status === '3' && $t('a6226f20.f285c5'))
            }}
          </template>
        </el-table-column>
        <el-table-column prop="resp_desc" :label="$t('a6226f20.2432b5')" width="400">
          <template slot-scope="scope">
            <p style="color: #027db4">
              {{ scope.row.resp_desc }}
            </p>
          </template>
        </el-table-column>
      </el-table>
      <div class="mt-4 text-right">
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
import { i18n } from '@/i18n'

export default {
  components: {
    shopSelect
  },
  data() {
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
          { type: 'string', message: i18n.t('a6226f20.d594b7'), required: true, trigger: 'blur' },
          {
            pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
            message: i18n.t('a6226f20.00db3d')
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
        { label: i18n.t('a6226f20.a8b0c2'), value: '' },
        { label: i18n.t('a6226f20.153430'), value: 1 },
        { label: i18n.t('a6226f20.dca060'), value: 2 },
        { label: i18n.t('a6226f20.f285c5'), value: 3 }
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
            text: i18n.t('a6226f20.335dfc'),
            onClick(picker) {
              const start_date = new Date()
              const end_date = new Date()
              start_date.setTime(start_date.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start_date, end_date])
            }
          },
          {
            text: i18n.t('a6226f20.d96eb4'),
            onClick(picker) {
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
  mounted() {
    this.initDate()
    this.getCompanyDataList()
  },
  methods: {
    validator(rule, value, callback) {
      if (Number(value) > Number(this.withdrawal_balance)) {
        callback(new Error(this.$t('a6226f20.2d9936')))
      } else {
        callback()
      }
    },
    onSumbit() {
      if (Number(this.withdrawal_balance) < Number(this.distributormoneyList.distributor_money)) {
        this.$message.error(this.$t('a6226f20.53ed3a'))
        return
      }
      const { withdrawal_amount } = this.topforms
      this.$refs.topforms.validate((valid) => {
        if (valid) {
          this.$confirm(
            `<div style='margin-left:45px'>
              <p><i class="el-icon-warning" style='color:#E6A23C; font-size: 20px;margin-right:5px'></i>${this.$t(
                'a6226f20.e741d2'
              )} ¥ ${withdrawal_amount}</p>
              <p style='font-size:12px;margin-left:30px;color:#ccc'>${this.$t(
                'a6226f20.787531'
              )}</p>
            </div>`,
            this.$t('a6226f20.79a5a0'),
            {
              confirmButtonText: this.$t('a6226f20.38cf16'),
              cancelButtonText: this.$t('a6226f20.625fb2'),
              dangerouslyUseHTMLString: true
            }
          ).then(() => {
            onSumbitsData({ withdrawal_amount }).then((res) => {
              this.$message({ type: 'success', message: this.$t('a6226f20.ad01c2') })
            })
          })
        } else {
          return false
        }
      })
    },
    oninput(value) {
      // 过滤小数点后两位
      if (value) {
        value.replace(/[^0-9.]/g, '')
        // if (Number(tixian) < Number(mintixian)) {
        //   this.$message.error('不满足提现条件')
        // }
      }
    },
    getCompanyDataList() {
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
    performInitChange() {
      this.performInit = false
    },
    handleReset() {
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
    dateChange(val) {
      if (val) {
        this.formData.start_date = val[0]
        this.formData.end_date = val[1]
      }
    },
    storeSearch(val) {
      this.formData.distributor_id = val.shop_id
    },
    handleSizeChange(pageSize) {
      this.params.page = 1
      this.params.page_size = pageSize
      this.getCompanyDataList()
    },
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getCompanyDataList()
    },
    onExportExcel() {
      // 导出
      onCashExportData(this.formData).then((response) => {
        const { status, url, filename } = response.data.data
        if (status) {
          this.$message({
            type: 'success',
            message: this.$t('a6226f20.3e1ddd')
          })
          return
        } else {
          this.$message({
            type: 'error',
            message: this.$t('a6226f20.89ae53')
          })
          return
        }
      })
    },
    initDate() {
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
