<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpRouterView>
    <SpPage>
      <div class="zyk_bspay_account">
        <el-form ref="ruleForm" :model="form" class="demo-ruleForm" label-width="100px">
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <span>{{ $t('eac538c8.8ab066') }}</span>
            </div>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item :label="$t('eac538c8.1e8dc2')" prop="order_id">
                  <el-input v-model="form.order_id" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('eac538c8.fa68e9')" prop="trade_id">
                  <el-input v-model="form.trade_id" />
                </el-form-item>
              </el-col>
              <el-col v-if="$store.getters.login_type != 'distributor'" :span="8">
                <el-form-item :label="$t('eac538c8.0d4934')" prop="distributor_name">
                  <el-input v-model="form.distributor_name" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('eac538c8.0c9d2b')" prop="pay_channel">
                  <el-select v-model="form.pay_channel" style="width: 100%">
                    <el-option
                      v-for="option in bspayPaymentOptions"
                      :key="option.value"
                      :label="$t(option.label)"
                      :value="option.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('eac538c8.209f63')" prop="status">
                  <el-select v-model="form.status" style="width: 100%">
                    <el-option :label="$t('eac538c8.21d63b')" value="SUCCESS" />
                    <el-option :label="$t('eac538c8.cfcaaa')" value="PARTIAL_REFUND" />
                    <el-option :label="$t('eac538c8.3b5a4d')" value="FULL_REFUND" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('eac538c8.9b712b')" prop="bspay_div_status">
                  <el-select v-model="form.bspay_div_status" style="width: 100%">
                    <el-option :label="$t('eac538c8.3d8a78')" value="NOTDIV" />
                    <el-option :label="$t('eac538c8.6b086e')" value="DIVED" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-if="$store.getters.login_type == 'admin'" :span="8">
                <el-form-item :label="$t('eac538c8.6e640f')" prop="bspay_fee_mode">
                  <el-select v-model="form.bspay_fee_mode" style="width: 100%">
                    <el-option :label="$t('eac538c8.6c1506')" value="1" />
                    <el-option :label="$t('eac538c8.75d29a')" value="2" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('eac538c8.cd649f')" prop="time">
                  <el-date-picker
                    v-model="form.time"
                    value-format="timestamp"
                    style="width: 100%"
                    type="daterange"
                    :default-time="['00:00:00', '23:59:59']"
                    range-separator="-"
                    :start-placeholder="$t('eac538c8.b44c0f')"
                    :end-placeholder="$t('eac538c8.1d468b')"
                    @change="timeHandle"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('eac538c8.73cd01')" prop="can_div">
                  <el-select v-model="form.can_div" style="width: 100%">
                    <el-option :label="$t('eac538c8.882957')" value="true" />
                    <el-option :label="$t('eac538c8.97f98c')" value="false" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item style="text-align: right">
              <el-button type="primary" size="medium" @click="queryHandle">
                {{ $t('eac538c8.bee912') }}
              </el-button>
              <el-button type="info" size="medium" @click="resetForm('ruleForm')">
                {{ $t('eac538c8.288f0c') }}
              </el-button>
            </el-form-item>
            <el-row :gutter="20" class="group">
              <el-col v-if="$store.getters.login_type != 'distributor'" :span="6" class="item">
                <p class="title">{{ $t('eac538c8.d39323') }}</p>
                <p class="money">￥ {{ (total.totalFee / 100) | formatNumMoney }}</p>
              </el-col>
              <el-col :span="6" class="item">
                <p class="title">{{ $t('eac538c8.8c022f') }}</p>
                <p class="money">￥ {{ (total.payFee / 100) | formatNumMoney }}</p>
              </el-col>
              <el-col v-if="$store.getters.login_type == 'distributor'" :span="6" class="item">
                <p class="title">{{ $t('eac538c8.600ffa') }}</p>
                <p class="money">￥ {{ (total.totalFee / 100) | formatNumMoney }}</p>
              </el-col>
              <el-col :span="6" class="item">
                <p class="title">{{ $t('eac538c8.564dc6') }}</p>
                <p class="money">￥ {{ (total.divFee / 100) | formatNumMoney }}</p>
              </el-col>
              <el-col v-if="$store.getters.login_type == 'admin'" :span="6" class="item">
                <p class="title">{{ $t('eac538c8.fdab98') }}</p>
                <p class="money">￥ {{ (total.bspayFee / 100) | formatNumMoney }}</p>
              </el-col>
            </el-row>
            <!-- tablelist -->
            <div class="tablelist">
              <el-row style="text-align: right">
                <el-upload
                  style="margin-right: 10px; display: inline-block"
                  action=""
                  :on-change="uploadHandleChange"
                  :auto-upload="false"
                  :show-file-list="false"
                >
                  <!-- <el-button type="primary">
                导入<i class="el-icon-upload el-icon--right" />
              </el-button> -->
                </el-upload>
                <el-button type="primary" size="medium" @click="exportFile">
                  {{ $t('eac538c8.d64170') }}
                </el-button>
              </el-row>
              <el-table v-loading="loading" :data="list" style="width: 100%">
                <el-table-column :label="$t('eac538c8.1e8dc2')" prop="orderId" />
                <template v-if="$store.getters.login_type != 'distributor'">
                  <el-table-column :label="$t('eac538c8.b39afc')" prop="distributor_name" />
                </template>
                <template>
                  <el-table-column :label="$t('eac538c8.fa68e9')" prop="tradeId" />
                  <el-table-column :label="$t('eac538c8.0c9d2b')">
                    <template slot-scope="scope">
                      <span v-if="scope.row.payType == 'pos'">{{ $t('eac538c8.d37dec') }}</span>
                      <span v-else-if="scope.row.payType == 'bspay' && scope.row.payChannel">
                        {{
                          paymentDisplayNames[scope.row.payChannel]
                            ? $t(paymentDisplayNames[scope.row.payChannel])
                            : scope.row.payChannel
                        }}
                      </span>
                      <span v-else>{{ scope.row.payType || '-' }}</span>
                    </template>
                  </el-table-column>
                </template>

                <el-table-column
                  v-if="$store.getters.login_type != 'distributor'"
                  :label="$t('eac538c8.b1862e')"
                >
                  <template slot-scope="scope">
                    <span>{{ (scope.row.totalFee / 100) | formatNumMoney }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  v-if="$store.getters.login_type == 'distributor'"
                  :label="$t('eac538c8.7184d3')"
                >
                  <template slot-scope="scope">
                    <span>{{ (scope.row.totalFee / 100) | formatNumMoney }}</span>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('eac538c8.209f63')" prop="tradeState">
                  <template slot-scope="scope">
                    <span v-if="scope.row.tradeState == 'SUCCESS'">{{
                      $t('eac538c8.21d63b')
                    }}</span>
                    <span v-else-if="scope.row.tradeState == 'PARTIAL_REFUND'">{{
                      $t('eac538c8.cfcaaa')
                    }}</span>
                    <span v-else-if="scope.row.tradeState == 'FULL_REFUND'">{{
                      $t('eac538c8.3b5a4d')
                    }}</span>
                    <!-- <span v-else-if="scope.row.tradeState =='CLOSED'">已关闭</span>
                  <span v-else-if="scope.row.tradeState =='REVOKED'">已撤销</span>
                  <span v-else-if="scope.row.tradeState =='PAYERROR'">支付失败</span> -->
                  </template>
                </el-table-column>
                <el-table-column :label="$t('eac538c8.a0cd4c')">
                  <template slot-scope="scope">
                    <span>{{ (scope.row.refundedFee / 100) | formatNumMoney }}</span>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('eac538c8.b39fe6')">
                  <template slot-scope="scope">
                    <span v-if="scope.row.payType == 'bspay'">{{ $t('eac538c8.ea512c') }}</span>
                    <span v-else>{{ $t('eac538c8.75ab31') }}</span>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('eac538c8.73cd01')">
                  <template slot-scope="scope">
                    <span v-if="scope.row.canDiv === true">{{ $t('eac538c8.882957') }}</span>
                    <span v-else>{{ $t('eac538c8.97f98c') }}</span>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('eac538c8.9b712b')">
                  <template slot-scope="scope">
                    <span v-if="scope.row.bspayDivStatus == 'NOTDIV'">{{
                      $t('eac538c8.3d8a78')
                    }}</span>
                    <span v-else-if="scope.row.bspayDivStatus == 'DIVED'">{{
                      $t('eac538c8.6b086e')
                    }}</span>
                  </template>
                </el-table-column>
                <template v-if="$store.getters.login_type == 'admin'">
                  <el-table-column :label="$t('eac538c8.6e640f')" prop="bspayFeeMode">
                    <template slot-scope="scope">
                      <span v-if="scope.row.bspayFeeMode == '2'">{{ $t('eac538c8.75d29a') }}</span>
                      <span v-else-if="scope.row.bspayFeeMode == '1'">{{
                        $t('eac538c8.6c1506')
                      }}</span>
                      <span v-else>-</span>
                    </template>
                  </el-table-column>

                  <el-table-column :label="$t('eac538c8.03c168')">
                    <template slot-scope="scope">
                      <span>{{ (scope.row.bspayFee / 100) | formatNumMoney }}</span>
                    </template>
                  </el-table-column>
                </template>
                <el-table-column :label="$t('eac538c8.1e61f1')">
                  <template slot-scope="scope">
                    <span>{{ (scope.row.divFee / 100) | formatNumMoney }}</span>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('eac538c8.696f5a')" prop="timeStart">
                  <template slot-scope="scope">
                    <span>{{ scope.row.timeStart | formatTimestamp }}</span>
                  </template>
                </el-table-column>
                <el-table-column fixed="left" :label="$t('eac538c8.2b6bc0')" width="100">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click="goDetail(scope.row.tradeId)">
                      {{ $t('eac538c8.607e7a') }}
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
      </div>
    </SpPage>
  </SpRouterView>
</template>

<script>
import { BSPAY_PAYMENT_OPTIONS, BSPAY_PAYMENT_DISPLAY_NAMES } from '@/consts/bspay'

export default {
  data() {
    return {
      form: {
        order_id: '', //订单号
        trade_id: '', // 交易流水号
        pay_channel: '', //支付渠道
        status: '', // 订单状态
        bspay_div_status: '', //分账状态,
        can_div: '',
        distributor_name: '', // 收款方 （店铺名称）
        bspay_fee_mode: '', //手续费扣费方式
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
        bspayFee: '' // 手续费总额
      },
      list: [],
      // list:{
      //   orderId:'',//订单号，
      //   distributor_name:'',//商铺名称
      //   totalFee:'',//订单金额
      //   tradeState:'', // 交易状态
      //   refundedFee:'',//退款金额
      //   bspay_div_status:'',//是否分账
      //   bspayFeeMode:'', //手续费扣费方式
      //   bspayFee:'',//手续费
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
  computed: {
    // 使用自动生成的下拉选择选项
    bspayPaymentOptions() {
      return BSPAY_PAYMENT_OPTIONS
    },
    // 支付方式显示名称映射
    paymentDisplayNames() {
      return BSPAY_PAYMENT_DISPLAY_NAMES
    }
  },
  mounted() {
    this.getSub_account()
  },

  methods: {
    getDistributorId() {
      return {
        distributor_id: this.$store.getters.shopId || 0
      }
    },
    async uploadHandleChange(file, fileList) {
      let params = {
        isUploadFile: true,
        file_type: 'bspay_tradedata',
        file: file.raw,
        ...this.getDistributorId()
      }
      await this.$api.common.handleUploadFile(params)
      this.$message({
        type: 'success',
        message: this.$t('eac538c8.7bbfaa')
      })
      this.getSub_account()
    },
    goDetail(id) {
      this.$router.push({
        path: `${this.$route.path}/detail/${id}`
      })
    },
    async getSub_account() {
      this.loading = true
      const { list, total, total_count } = await this.$api.bspay.subAccount({
        ...this.form,
        ...this.params,
        ...this.time
      })
      this.total = total
      this.list = list
      this.total_count = total_count
      this.loading = false
    },
    handleCurrentChange(page) {
      this.params.page = page
      this.getSub_account()
    },
    handleSizeChange(pageSize) {
      this.params.pageSize = pageSize
      this.getSub_account()
    },
    timeHandle(val) {
      this.time.time_start_begin = val[0]
      this.time.time_start_end = val[1]
    },
    queryHandle() {
      this.params = {
        page: 1,
        pageSize: 10
      }
      this.getSub_account()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.form.pay_channel = ''
      this.form.status = ''
      this.time.time_start_begin = ''
      this.time.time_start_end = ''
    },
    async exportFile() {
      const { status } = await this.$api.bspay.exportFileList({
        ...this.form,
        ...this.params,
        ...this.time
      })
      if (status) {
        this.$message.success(this.$t('eac538c8.3e1ddd'))
      } else {
        this.$message.error(this.$t('eac538c8.dd51ab'))
      }
    }
  }
}
</script>

<style lang="scss">
.zyk_bspay_account {
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
.zyk_bspay_account {
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
