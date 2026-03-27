<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <div v-if="$route.path.indexOf('_detail') === -1">
      <el-card v-if="loginType === 'distributor'">
        <el-row style="marginbottom: 0px">
          <el-col :span="5" class="admin-total-num-box">
            <p class="admin-total-num-top-fonts">¥ {{ totalList.income }}</p>
            <p class="admin-total-num-bot-fonts">
              {{ $t('c8d3d7a6.2d4a71') }}
              <el-popover
                placement="bottom"
                width="200"
                trigger="hover"
                :content="$t('c8d3d7a6.d7e9bf')"
              >
                <i
                  slot="reference"
                  class="el-icon-question"
                  style="color: #c1c1c1; font-size: 16px"
                />
              </el-popover>
            </p>
          </el-col>
          <el-col :span="5" class="admin-total-num-box">
            <p class="admin-total-num-top-fonts">¥ {{ totalList.refund }}</p>
            <p class="admin-total-num-bot-fonts">
              {{ $t('c8d3d7a6.125cc4') }}
              <el-popover
                placement="bottom"
                width="220"
                trigger="hover"
                :content="$t('c8d3d7a6.89233f')"
              >
                <i
                  slot="reference"
                  class="el-icon-question"
                  style="color: #c1c1c1; font-size: 16px"
                />
              </el-popover>
            </p>
          </el-col>
          <el-col :span="5" class="admin-total-num-box">
            <p class="admin-total-num-top-fonts">¥ {{ totalList.unsettled_funds }}</p>
            <p class="admin-total-num-bot-fonts">
              {{ $t('c8d3d7a6.a9caf3') }}
              <el-popover
                placement="bottom"
                width="420"
                trigger="hover"
                :content="$t('c8d3d7a6.c91d49')"
              >
                <i
                  slot="reference"
                  class="el-icon-question"
                  style="color: #c1c1c1; font-size: 16px"
                />
              </el-popover>
            </p>
          </el-col>
          <el-col :span="5" class="admin-total-num-box">
            <p class="admin-total-num-top-fonts">¥ {{ totalList.settlement_funds }}</p>
            <p class="admin-total-num-bot-fonts">
              {{ $t('c8d3d7a6.538778') }}
              <el-popover
                placement="bottom"
                width="230"
                trigger="hover"
                :content="$t('c8d3d7a6.c384c8')"
              >
                <i
                  slot="reference"
                  class="el-icon-question"
                  style="color: #c1c1c1; font-size: 16px"
                />
              </el-popover>
            </p>
          </el-col>
          <el-col :span="4" class="admin-total-num-box">
            <p class="admin-total-num-top-fonts">¥ {{ totalList.withdrawal_balance }}</p>
            <p class="admin-total-num-bot-fonts">
              {{ $t('c8d3d7a6.504406') }}
              <el-popover
                placement="bottom"
                width="200"
                trigger="hover"
                :content="$t('c8d3d7a6.4d4ef5')"
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
        <el-form :model="formData" label-width="100px">
          <el-row style="marginbottom: 0px">
            <el-col :span="12">
              <el-form-item :label="$t('c8d3d7a6.786622')">
                <el-date-picker
                  v-model="rangeData"
                  type="daterange"
                  alue-format="yyyy-MM-dd"
                  align="right"
                  unlink-panels
                  :range-separator="$t('c8d3d7a6.981cbe')"
                  :start-placeholder="$t('c8d3d7a6.b44c0f')"
                  :end-placeholder="$t('c8d3d7a6.1d468b')"
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
              <el-form-item :label="$t('c8d3d7a6.50cdff')">
                <el-select v-model="formData.profitsharing_status" style="width: 100%" size="small">
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
              <el-form-item :label="$t('c8d3d7a6.3e8657')">
                <el-input
                  v-model="formData.order_id"
                  size="small"
                  :placeholder="$t('c8d3d7a6.ca1eab')"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :label="$t('c8d3d7a6.99aa6c')">
                <el-select v-model="formData.app_pay_type" size="small" style="width: 100%">
                  <el-option
                    v-for="item in payOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="loginType !== 'distributor'" :span="12">
              <el-form-item :label="$t('c8d3d7a6.afa2e6')">
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
              <el-form-item :label="$t('c8d3d7a6.86f6cf')">
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
                <el-button size="small" @click="handleReset">{{ $t('c8d3d7a6.4b9c32') }}</el-button>
                <el-button size="small" type="primary" @click="getCompanyDataList">
                  {{ $t('c8d3d7a6.e5f71f') }}
                </el-button>
              </div>
            </el-col>
          </el-row>
          <el-row v-if="loginType !== 'distributor'" :gutter="20">
            <el-col :span="4" :push="20">
              <div class="flex-right">
                <el-button size="small" @click="handleReset">{{ $t('c8d3d7a6.4b9c32') }}</el-button>
                <el-button size="small" type="primary" @click="getCompanyDataList">
                  {{ $t('c8d3d7a6.e5f71f') }}
                </el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <el-card>
        <el-row style="marginbottom: 0px">
          <el-col :span="3" class="total-num-box">
            <p class="total-num-top-fonts">
              {{ allAccountList.order_count }}
            </p>
            <p class="total-num-bot-fonts">{{ $t('c8d3d7a6.d081a0') }}</p>
          </el-col>
          <el-col :span="3" class="total-num-box">
            <p class="total-num-top-fonts">¥ {{ allAccountList.order_total_fee }}</p>
            <p class="total-num-bot-fonts">{{ $t('c8d3d7a6.723b8c') }}</p>
          </el-col>
          <el-col :span="3" class="total-num-box">
            <p class="total-num-top-fonts">
              {{ allAccountList.order_refund_count }}
            </p>
            <p class="total-num-bot-fonts">{{ $t('c8d3d7a6.441bb3') }}</p>
          </el-col>
          <el-col :span="3" class="total-num-box">
            <p class="total-num-top-fonts">¥ {{ allAccountList.order_refund_total_fee }}</p>
            <p class="total-num-bot-fonts">{{ $t('c8d3d7a6.36930f') }}</p>
          </el-col>
          <el-col :span="3" class="total-num-box">
            <p class="total-num-top-fonts">
              {{ allAccountList.order_refunding_count }}
            </p>
            <p class="total-num-bot-fonts">{{ $t('c8d3d7a6.102e13') }}</p>
          </el-col>
          <el-col :span="3" class="total-num-box">
            <p class="total-num-top-fonts">¥ {{ allAccountList.order_refunding_total_fee }}</p>
            <p class="total-num-bot-fonts">{{ $t('c8d3d7a6.400668') }}</p>
          </el-col>
          <el-col :span="3" class="total-num-box">
            <p class="total-num-top-fonts">¥ {{ allAccountList.order_profit_sharing_charge }}</p>
            <p class="total-num-bot-fonts">{{ $t('c8d3d7a6.1b1138') }}</p>
          </el-col>
          <el-col :span="3" class="total-num-box">
            <p class="total-num-top-fonts">¥ {{ allAccountList.order_un_profit_sharing_charge }}</p>
            <p class="total-num-bot-fonts">
              {{ $t('c8d3d7a6.ae7769') }}
              <el-popover
                v-if="loginType !== 'distributor'"
                placement="left"
                width="500"
                trigger="hover"
              >
                <div class="popover-box">
                  <h3>{{ $t('c8d3d7a6.b2bfc6') }}</h3>
                  <h3>{{ $t('c8d3d7a6.d081a0') }}</h3>
                  <p>{{ $t('c8d3d7a6.883e2d') }}</p>
                  <h3>{{ $t('c8d3d7a6.200189') }}</h3>
                  <p>{{ $t('c8d3d7a6.2afe56') }}</p>
                  <h3>{{ $t('c8d3d7a6.1502ed') }}</h3>
                  <p>{{ $t('c8d3d7a6.02809d') }}</p>
                  <h3>{{ $t('c8d3d7a6.36930f') }}</h3>
                  <p>{{ $t('c8d3d7a6.b53921') }}</p>
                  <h3>{{ $t('c8d3d7a6.102e13') }}</h3>
                  <p>{{ $t('c8d3d7a6.cc2a4b') }}</p>
                  <h3>{{ $t('c8d3d7a6.400668') }}</h3>
                  <p>{{ $t('c8d3d7a6.85435c') }}</p>
                  <h3>{{ $t('c8d3d7a6.ae7769') }}</h3>
                  <p>{{ $t('c8d3d7a6.768cf4') }}</p>
                  <h3>{{ $t('c8d3d7a6.1b1138') }}</h3>
                  <p>{{ $t('c8d3d7a6.3d47f7') }}</p>
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
        <el-row type="flex" justify="end">
          <el-button size="small" type="primary" @click="onExportExcel()">
{{
            $t('c8d3d7a6.55405e')
          }}
</el-button>
        </el-row>
        <el-table v-loading="loading" :data="tableDataList" stripe border style="width: 100%">
          <el-table-column prop="create_time" :label="$t('c8d3d7a6.4ff1e7')" width="180" />
          <el-table-column prop="order_id" :label="$t('c8d3d7a6.1e8dc2')" width="180" />
          <el-table-column
            v-if="loginType === 'distributor'"
            prop="app_pay_type_desc"
            :label="$t('c8d3d7a6.99aa6c')"
            width="150"
          />
          <el-table-column prop="profitsharing_status" :label="$t('c8d3d7a6.50cdff')">
            <template slot-scope="scope">
              {{
                scope.row.profitsharing_status === '1' || scope.row.profitsharing_status === 1
                  ? $t('c8d3d7a6.facb53')
                  : $t('c8d3d7a6.139304')
              }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('c8d3d7a6.0b3745')" width="170">
            <template slot-scope="scope">
              <p style="color: #67c23a">￥{{ (scope.row.total_fee / 100).toFixed(2) }}</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('c8d3d7a6.15858a')" width="170">
            <template slot-scope="scope"> ￥{{ (scope.row.charge / 100).toFixed(2) }} </template>
          </el-table-column>
          <el-table-column
            v-if="loginType !== 'distributor'"
            prop="distributor_name"
            :label="$t('c8d3d7a6.0d4934')"
            width="180"
          />
          <el-table-column :label="$t('c8d3d7a6.a0cd4c')" width="160">
            <template slot-scope="scope">
              <p style="color: #d9001b">￥{{ (scope.row.refund_fee / 100).toFixed(2) }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="order_status" :label="$t('c8d3d7a6.86f6cf')">
            <template slot-scope="scope">
              {{
                (scope.row.order_status === 'refunding' && $t('c8d3d7a6.07e608')) ||
                (scope.row.order_status === 'pay' && $t('c8d3d7a6.26fcbb')) ||
                (scope.row.order_status === 'refundsuccess' && $t('c8d3d7a6.d58cbd')) ||
                (scope.row.order_status === 'refundfail' && $t('c8d3d7a6.7c2544')) ||
                (scope.row.order_status === 'NOTPAY' && $t('c8d3d7a6.608afd')) ||
                (scope.row.order_status === 'PART_PAYMENT' && $t('c8d3d7a6.38b508')) ||
                (scope.row.order_status === 'WAIT_GROUPS_SUCCESS' && $t('c8d3d7a6.c2335d')) ||
                (scope.row.order_status === 'PAYED' && $t('c8d3d7a6.8d02a5')) ||
                (scope.row.order_status === 'CANCEL' && $t('c8d3d7a6.2111cc')) ||
                (scope.row.order_status === 'WAIT_BUYER_CONFIRM' && $t('c8d3d7a6.d76c15'))
              }}
            </template>
          </el-table-column>
          <el-table-column fixed="left" :label="$t('c8d3d7a6.2b6bc0')" width="100">
            <template slot-scope="scope">
              <router-link
                :to="{ path: matchRoutePath('detail'), query: { orderId: scope.row.order_id } }"
              >
                {{ $t('c8d3d7a6.f26225') }}
              </router-link>
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
    <router-view />
  </div>
</template>
<script>
import { GetAccountStatisList, onOrderExportData } from '@/api/datacube'
import { getStoreAccount } from '@/api/fenzhang'
import shopSelect from '@/components/shopSelect2'
import moment from 'moment'
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
        { label: i18n.t('c8d3d7a6.a8b0c2'), value: 0 },
        { label: i18n.t('c8d3d7a6.139304'), value: 2 },
        { label: i18n.t('c8d3d7a6.facb53'), value: 1 }
      ],
      payOptions: [
        { label: i18n.t('c8d3d7a6.a8b0c2'), value: '' },
        { label: i18n.t('c8d3d7a6.886e9a'), value: '01' },
        { label: i18n.t('c8d3d7a6.8f5c72'), value: '02' },
        { label: i18n.t('c8d3d7a6.00a20f'), value: '03' },
        { label: i18n.t('c8d3d7a6.44a38b'), value: '05' },
        { label: i18n.t('c8d3d7a6.248467'), value: '06' },
        { label: i18n.t('c8d3d7a6.439845'), value: '07' },
        { label: i18n.t('c8d3d7a6.7a0d24'), value: '08' },
        { label: i18n.t('c8d3d7a6.b991ed'), value: '09' },
        { label: i18n.t('c8d3d7a6.1ee1f8'), value: '10' },
        { label: i18n.t('c8d3d7a6.088101'), value: '11' },
        { label: i18n.t('c8d3d7a6.8b025e'), value: '12' },
        { label: i18n.t('c8d3d7a6.108884'), value: '13' }
      ],
      statusOption: [
        { label: i18n.t('c8d3d7a6.a8b0c2'), value: '' },
        { label: i18n.t('c8d3d7a6.07e608'), value: 'refunding' },
        { label: i18n.t('c8d3d7a6.eb5dc9'), value: 'pay' },
        { label: i18n.t('c8d3d7a6.d58cbd'), value: 'refundsuccess' },
        { label: i18n.t('c8d3d7a6.7c2544'), value: 'refundfail' }
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
            text: i18n.t('c8d3d7a6.335dfc'),
            onClick(picker) {
              const start_date = new Date()
              const end_date = new Date()
              start_date.setTime(start_date.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start_date, end_date])
            }
          },
          {
            text: i18n.t('c8d3d7a6.d96eb4'),
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
    getCompanyDataList() {
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
            message: this.$t('c8d3d7a6.5b0398')
          })
        })
    },
    performInitChange() {
      this.performInit = false
    },
    handleReset() {
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
      // 表格导出
      onOrderExportData(this.formData).then((response) => {
        const { status, url, filename } = response.data.data
        if (status) {
          this.$message({
            type: 'success',
            message: this.$t('c8d3d7a6.3e1ddd')
          })
          return
        } else {
          this.$message({
            type: 'error',
            message: this.$t('c8d3d7a6.89ae53')
          })
          return
        }
      })
    },
    initDate() {
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
