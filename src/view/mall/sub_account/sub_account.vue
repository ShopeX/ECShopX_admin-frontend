<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <SpRouterView class="zyk_adapay_account">
      <el-form ref="ruleForm" :model="form" class="demo-ruleForm" label-width="100px">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span>{{ $t('aab9b30d.8ab066') }}</span>
          </div>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item :label="$t('aab9b30d.1e8dc2')" prop="order_id">
                <el-input v-model="form.order_id" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('aab9b30d.fa68e9')" prop="trade_id">
                <el-input v-model="form.trade_id" />
              </el-form-item>
            </el-col>
            <el-col v-if="$store.getters.login_type != 'distributor'" :span="8">
              <el-form-item :label="$t('aab9b30d.0d4934')" prop="distributor_name">
                <el-input v-model="form.distributor_name" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('aab9b30d.0c9d2b')" prop="pay_type">
                <el-select v-model="form.pay_type" style="width: 100%">
                  <el-option :label="$t('aab9b30d.18796a')" value="wx_lite" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('aab9b30d.209f63')" prop="status">
                <el-select v-model="form.status" style="width: 100%">
                  <el-option :label="$t('aab9b30d.21d63b')" value="SUCCESS" />
                  <el-option :label="$t('aab9b30d.cfcaaa')" value="PARTIAL_REFUND" />
                  <el-option :label="$t('aab9b30d.3b5a4d')" value="FULL_REFUND" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('aab9b30d.9b712b')" prop="adapay_div_status">
                <el-select v-model="form.adapay_div_status" style="width: 100%">
                  <el-option :label="$t('aab9b30d.3d8a78')" value="NOTDIV" />
                  <el-option :label="$t('aab9b30d.6b086e')" value="DIVED" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="$store.getters.login_type == 'admin'" :span="8">
              <el-form-item :label="$t('aab9b30d.6e640f')" prop="adapay_fee_mode">
                <el-select v-model="form.adapay_fee_mode" style="width: 100%">
                  <el-option :label="$t('aab9b30d.75d29a')" value="I" />
                  <el-option :label="$t('aab9b30d.6c1506')" value="O" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('aab9b30d.cd649f')" prop="time">
                <el-date-picker
                  v-model="form.time"
                  value-format="timestamp"
                  style="width: 100%"
                  type="daterange"
                  :default-time="['00:00:00', '23:59:59']"
                  range-separator="-"
                  :start-placeholder="$t('aab9b30d.b44c0f')"
                  :end-placeholder="$t('aab9b30d.1d468b')"
                  @change="timeHandle"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('aab9b30d.73cd01')" prop="can_div">
                <el-select v-model="form.can_div" style="width: 100%">
                  <el-option :label="$t('aab9b30d.882957')" value="true" />
                  <el-option :label="$t('aab9b30d.97f98c')" value="false" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item style="text-align: right">
            <el-button type="primary" size="medium" @click="queryHandle">
              {{ $t('aab9b30d.bee912') }}
            </el-button>
            <el-button type="info" size="medium" @click="resetForm('ruleForm')">
              {{ $t('aab9b30d.288f0c') }}
            </el-button>
          </el-form-item>
          <el-row :gutter="20" class="group">
            <el-col v-if="$store.getters.login_type != 'distributor'" :span="6" class="item">
              <p class="title">{{ $t('aab9b30d.d39323') }}</p>
              <p class="money">￥ {{ (total.totalFee / 100) | formatNumMoney }}</p>
            </el-col>
            <el-col :span="6" class="item">
              <p class="title">{{ $t('aab9b30d.8c022f') }}</p>
              <p class="money">￥ {{ (total.payFee / 100) | formatNumMoney }}</p>
            </el-col>
            <el-col v-if="$store.getters.login_type == 'distributor'" :span="6" class="item">
              <p class="title">{{ $t('aab9b30d.600ffa') }}</p>
              <p class="money">￥ {{ (total.totalFee / 100) | formatNumMoney }}</p>
            </el-col>
            <el-col :span="6" class="item">
              <p class="title">{{ $t('aab9b30d.564dc6') }}</p>
              <p class="money">￥ {{ (total.divFee / 100) | formatNumMoney }}</p>
            </el-col>
            <el-col v-if="$store.getters.login_type == 'admin'" :span="6" class="item">
              <p class="title">{{ $t('aab9b30d.fdab98') }}</p>
              <p class="money">￥ {{ (total.adapayFee / 100) | formatNumMoney }}</p>
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
                <el-button type="primary">
                  {{ $t('aab9b30d.8d9a07') }}<i class="el-icon-upload el-icon--right" />
                </el-button>
              </el-upload>
            </el-row>
            <el-table v-loading="loading" :data="list" style="width: 100%">
              <el-table-column :label="$t('aab9b30d.1e8dc2')" prop="orderId" />
              <template v-if="$store.getters.login_type != 'distributor'">
                <el-table-column :label="$t('aab9b30d.b39afc')" prop="distributor_name" />
              </template>
              <template>
                <el-table-column :label="$t('aab9b30d.fa68e9')" prop="tradeId" />
                <el-table-column :label="$t('aab9b30d.0c9d2b')">
                  <template slot-scope="scope">
                    <span v-if="scope.row.payType == 'wxpay'">{{ $t('aab9b30d.bffe28') }}</span>
                    <span v-if="scope.row.payType == 'wxpayapp'">{{ $t('aab9b30d.3c2c77') }}</span>
                    <span v-if="scope.row.payType == 'wxpayh5'">{{ $t('aab9b30d.df7033') }}</span>
                    <span v-if="scope.row.payType == 'wxpaypc'">{{ $t('aab9b30d.67a318') }}</span>
                    <span v-if="scope.row.payType == 'wxpaypos'">{{ $t('aab9b30d.c8a8cb') }}</span>
                    <span v-if="scope.row.payType == 'alipayapp'">{{ $t('aab9b30d.2ac4fe') }}</span>
                    <span v-if="scope.row.payType == 'alipay'">{{ $t('aab9b30d.e3b206') }}</span>
                    <span v-if="scope.row.payType == 'alipayh5'">{{ $t('aab9b30d.5a3c52') }}</span>
                    <span v-if="scope.row.payType == 'alipaypos'">{{ $t('aab9b30d.bc475f') }}</span>
                    <span v-if="scope.row.payType == 'deposit'">{{ $t('aab9b30d.89ac23') }}</span>
                    <span v-if="scope.row.payType == 'point'">{{ $t('aab9b30d.accd19') }}</span>
                    <span v-if="scope.row.payType == 'pos'">{{ $t('aab9b30d.d37dec') }}</span>
                    <span
                      v-if="scope.row.payType == 'adapay' && scope.row.payChannel == 'wx_lite'"
                      >{{ $t('aab9b30d.bffe28') }}</span
                    >
                  </template>
                </el-table-column>
              </template>

              <el-table-column
                v-if="$store.getters.login_type != 'distributor'"
                :label="$t('aab9b30d.b1862e')"
              >
                <template slot-scope="scope">
                  <span>{{ (scope.row.totalFee / 100) | formatNumMoney }}</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="$store.getters.login_type == 'distributor'"
                :label="$t('aab9b30d.7184d3')"
              >
                <template slot-scope="scope">
                  <span>{{ (scope.row.totalFee / 100) | formatNumMoney }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('aab9b30d.209f63')" prop="tradeState">
                <template slot-scope="scope">
                  <span v-if="scope.row.tradeState == 'SUCCESS'">{{ $t('aab9b30d.21d63b') }}</span>
                  <span v-else-if="scope.row.tradeState == 'PARTIAL_REFUND'">{{
                    $t('aab9b30d.cfcaaa')
                  }}</span>
                  <span v-else-if="scope.row.tradeState == 'FULL_REFUND'">{{
                    $t('aab9b30d.3b5a4d')
                  }}</span>
                  <!-- <span v-else-if="scope.row.tradeState =='CLOSED'">已关闭</span>
                  <span v-else-if="scope.row.tradeState =='REVOKED'">已撤销</span>
                  <span v-else-if="scope.row.tradeState =='PAYERROR'">支付失败</span> -->
                </template>
              </el-table-column>
              <el-table-column :label="$t('aab9b30d.a0cd4c')">
                <template slot-scope="scope">
                  <span>{{ (scope.row.refundedFee / 100) | formatNumMoney }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('aab9b30d.b39fe6')">
                <template slot-scope="scope">
                  <span v-if="scope.row.payType == 'adapay'">{{ $t('aab9b30d.ea512c') }}</span>
                  <span v-else>{{ $t('aab9b30d.75ab31') }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('aab9b30d.73cd01')">
                <template slot-scope="scope">
                  <span v-if="scope.row.canDiv === true">{{ $t('aab9b30d.882957') }}</span>
                  <span v-else>{{ $t('aab9b30d.97f98c') }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('aab9b30d.9b712b')">
                <template slot-scope="scope">
                  <span v-if="scope.row.adapayDivStatus == 'NOTDIV'">{{
                    $t('aab9b30d.3d8a78')
                  }}</span>
                  <span v-else-if="scope.row.adapayDivStatus == 'DIVED'">{{
                    $t('aab9b30d.6b086e')
                  }}</span>
                </template>
              </el-table-column>
              <template v-if="$store.getters.login_type == 'admin'">
                <el-table-column :label="$t('aab9b30d.6e640f')" prop="adapayFeeMode">
                  <template slot-scope="scope">
                    <span v-if="scope.row.adapayFeeMode == 'I'">{{ $t('aab9b30d.75d29a') }}</span>
                    <span v-else-if="scope.row.adapayFeeMode == 'O'">{{
                      $t('aab9b30d.6c1506')
                    }}</span>
                    <span v-else>-</span>
                  </template>
                </el-table-column>

                <el-table-column :label="$t('aab9b30d.03c168')">
                  <template slot-scope="scope">
                    <span>{{ (scope.row.adapayFee / 100) | formatNumMoney }}</span>
                  </template>
                </el-table-column>
              </template>
              <el-table-column :label="$t('aab9b30d.1e61f1')">
                <template slot-scope="scope">
                  <span>{{ (scope.row.divFee / 100) | formatNumMoney }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('aab9b30d.696f5a')" prop="timeStart">
                <template slot-scope="scope">
                  <span>{{ scope.row.timeStart | formatTimestamp }}</span>
                </template>
              </el-table-column>
              <el-table-column fixed="left" :label="$t('aab9b30d.2b6bc0')" width="100">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="goDetail(scope.row.tradeId)">
                    {{ $t('aab9b30d.607e7a') }}
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
    </SpRouterView>
  </SpPage>
</template>

<script>
export default {
  data() {
    return {
      form: {
        order_id: '', //订单号
        trade_id: '', // 交易流水号
        pay_type: '', //支付方式
        status: '', // 订单状态
        adapay_div_status: '', //分账状态,
        can_div: '',
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
        file_type: 'adapay_tradedata',
        file: file.raw,
        ...this.getDistributorId()
      }
      await this.$api.common.handleUploadFile(params)
      this.$message({
        type: 'success',
        message: this.$t('aab9b30d.7bbfaa')
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
    handleCurrentChange(page) {
      console.log(page)
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
      this.form.pay_type = ''
      this.form.status = ''
      this.time.time_start_begin = ''
      this.time.time_start_end = ''
    },
    async exportFile() {
      const { status } = await this.$api.adapay.exportFileList({
        ...this.form,
        ...this.params,
        ...this.time
      })
      if (status) {
        this.$message.success(this.$t('d41d8cd9.g1h2i3'))
      } else {
        this.$message.error(this.$t('d41d8cd9.l2m3n4'))
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
