<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage class="page-withdraw">
    <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="status" label="">
        <el-select clearable v-model="params.status" :placeholder="$t('a1788ba0.0ed783')">
          <el-option
            v-for="(item, index) in statusList"
            :key="index"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </SpFilterFormItem>
      <SpFilterFormItem prop="mobile" label="">
        <el-input :placeholder="$t('a1788ba0.8098e2')" v-model="params.mobile" />
      </SpFilterFormItem>
    </SpFilterForm>
    <el-card>
      <div class="time-box basic">
        <el-row>
          <el-col :span="6">
            <div>{{ $t('a1788ba0.587e76') }}</div>
            &nbsp;<span>¥{{ count.all / 100 }}</span>
          </el-col>
          <el-col :span="6">
            <div>{{ $t('a1788ba0.078c7b') }}</div>
            &nbsp;<span>¥{{ count.success / 100 }}</span>
          </el-col>
          <el-col :span="6">
            <div>{{ $t('a1788ba0.f94cfe') }}</div>
            &nbsp;<span>¥{{ count.apply / 100 }}</span>
          </el-col>
          <el-col :span="6">
            <div>{{ $t('a1788ba0.28fe21') }}</div>
            &nbsp;<span>{{ count.userCount }}</span>
          </el-col>
        </el-row>
      </div>
      <el-table :data="list" :height="wheight - 150" v-loading="loading">
        <el-table-column prop="created" :label="$t('a1788ba0.5ba072')" min-width="84">
          <template slot-scope="scope">
            <span>{{ scope.row.created | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('a1788ba0.c11ddb')">
          <template slot-scope="scope">
            <el-tag size="mini" v-if="scope.row.pay_type === 'wechat'" type="success">
              {{ $t('a1788ba0.cfbf6f') }}
            </el-tag>
            <el-tag size="mini" v-if="scope.row.pay_type === 'alipay'">
              {{ $t('a1788ba0.ccd097') }}
            </el-tag>
            <el-tag size="mini" v-if="scope.row.pay_type === 'hfpay'" type="warning">
              {{ $t('a1788ba0.4c7d29') }}
            </el-tag>
            <el-tag size="mini" v-if="scope.row.pay_type === 'bankcard'" type="warning">
              {{ $t('a1788ba0.774267') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="mobile" :label="$t('a1788ba0.8f0619')">
          <template slot-scope="scope">
            <span>{{ scope.row.mobile }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('a1788ba0.8f5d8a')">
          <template slot-scope="scope">
            <span> {{ scope.row.money / 100 }} </span> {{ $t('a1788ba0.c16655') }}
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="$t('a1788ba0.0ed783')">
          <template slot-scope="scope">
            <el-tag type="primary" v-if="scope.row.status == 'apply'" size="mini">
              {{ $t('a1788ba0.99c3eb') }}
            </el-tag>
            <el-tag type="warning" v-if="scope.row.status == 'process'" size="mini">
              {{ $t('a1788ba0.2e89ce') }}
            </el-tag>
            <el-tag type="success" v-if="scope.row.status == 'success'" size="mini">
              {{ $t('a1788ba0.42b524') }}
            </el-tag>
            <el-tag type="info" v-if="scope.row.status == 'reject'" size="mini">
              {{ $t('a1788ba0.940fe3') }}
            </el-tag>
            <el-tag type="danger" v-if="scope.row.status == 'failed'" size="mini">
              {{ $t('a1788ba0.f285c5') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('a1788ba0.e679e8')" width="120">
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-document"
              type="text"
              @click="dialogPayInfo(scope.row)"
            >
              {{ $t('a1788ba0.e679e8') }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column :label="$t('a1788ba0.2b6bc0')" width="160">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              v-if="scope.row.status == 'reject'"
              v-popover:popover
            >
              <el-popover ref="popover" placement="top" width="400" trigger="click">
                <el-input type="textarea" :rows="6" :disabled="true" :value="scope.row.remarks" />
              </el-popover>
              <i class="el-icon-warning mark" /> {{ $t('a1788ba0.f48f94') }}
            </el-button>
            <el-button
              size="mini"
              type="text"
              v-if="scope.row.status == 'failed'"
              v-popover:popover
            >
              <el-popover ref="popover" placement="top" width="400" trigger="click">
                <el-input type="textarea" :rows="6" :disabled="true" :value="scope.row.remarks" />
              </el-popover>
              <i class="el-icon-warning mark" /> {{ $t('a1788ba0.13d5f2') }}
            </el-button>
            <el-button
              size="mini"
              type="primary"
              v-if="scope.row.status == 'apply'"
              @click="dialogOpen(scope.row)"
            >
              {{ $t('a1788ba0.1d6733') }}
            </el-button>
            <el-button
              size="mini"
              type="warning"
              v-if="scope.row.status == 'apply'"
              @click="dialogCancel(scope.row)"
            >
              {{ $t('a1788ba0.7173f8') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="mt-4 text-right">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
          @size-change="getList"
          :current-page.sync="params.page"
          :total="total_count"
          :page-size.sync="params.pageSize"
        />
      </div>
    </el-card>
    <el-dialog
      :title="$t('a1788ba0.e679e8')"
      :visible.sync="payDialog"
      :close-on-click-modal="false"
      width="50%"
    >
      <el-table :data="payList">
        <el-table-column prop="update_time" :label="$t('a1788ba0.4ff1e7')" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.update_time | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="amount" :label="$t('a1788ba0.7f295a')" width="180">
          <template slot-scope="scope">
            <span> {{ scope.row.amount / 100 }} </span> {{ $t('a1788ba0.c16655') }}
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="$t('a1788ba0.ac204b')">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 'NOT_PAY'"> {{ $t('a1788ba0.8cbf8e') }} </span>
            <span v-if="scope.row.status == 'PAYING'"> {{ $t('a1788ba0.73e3ca') }} </span>
            <el-tag type="success" v-if="scope.row.status == 'SUCCESS'">
              {{ $t('a1788ba0.c7c515') }}
            </el-tag>
            <span v-if="scope.row.status == 'FAIL'"> {{ $t('a1788ba0.35d585') }} </span>
          </template>
        </el-table-column>
        <el-table-column prop="error_desc" :label="$t('a1788ba0.727689')">
          <template slot-scope="scope">
            <span v-if="scope.row.error_desc">{{ scope.row.error_desc }}</span>
            <span v-else> - </span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer content-center">
        <el-button @click.native="payDialog = false">{{ $t('a1788ba0.b15d91') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="$t('a1788ba0.03c85b')"
      :visible.sync="canceldialog"
      :close-on-click-modal="false"
      width="50%"
    >
      <el-input type="textarea" :rows="6" :placeholder="$t('a1788ba0.fc955a')" v-model="textarea" />
      <div slot="footer" class="dialog-footer content-center">
        <el-button @click.native="canceldialog = false">{{ $t('a1788ba0.170933') }}</el-button>
        <el-button type="primary" @click="actionProcessCashWithdrawal('reject')">
          {{ $t('a1788ba0.fc9087') }}
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="$t('a1788ba0.597e24')"
      :visible.sync="dialog"
      :close-on-click-modal="false"
      width="50%"
    >
      <el-alert
        v-if="detail.money > cashWithdrawalRebate"
        :title="$t('a1788ba0.0ea1df')"
        :description="$t('a1788ba0.3d89a7')"
        :closable="false"
        type="error"
        show-icon
      />
      <el-alert
        v-if="detail.pay_type === 'wechat'"
        :title="$t('a1788ba0.5a8dbc')"
        :description="$t('a1788ba0.9676c0')"
        :closable="false"
        type="info"
        show-icon
      />
      <el-alert
        v-if="detail.pay_type === 'alipay'"
        :title="$t('a1788ba0.6180e4')"
        :description="$t('a1788ba0.46d94d')"
        :closable="false"
        type="info"
        show-icon
      />
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <el-tag v-if="detail.pay_type === 'wechat'">{{ $t('a1788ba0.5a8dbc') }}</el-tag>
          <el-tag v-if="detail.pay_type === 'alipay'">{{ $t('a1788ba0.6180e4') }}</el-tag>
          <span style="font-size: 20px">{{ detail.account_name }} - {{ detail.mobile }}</span>
        </div>
        <div v-if="detail.pay_type === 'alipay'" class="text item">
          <span>{{ $t('a1788ba0.6feb60') }}</span
          ><span style="font-size: 26px">{{ detail.account_name }}</span>
        </div>
        <div v-if="detail.pay_type === 'alipay'" class="text item">
          <span>{{ $t('a1788ba0.83ab43') }}</span
          ><span style="font-size: 26px">{{ detail.pay_account }}</span>
        </div>
        <div class="text item">
          <span>{{ $t('a1788ba0.7069d4') }} </span
          ><span style="font-size: 26px; color: red">{{ cashWithdrawalRebate / 100 }}</span>
          {{ $t('a1788ba0.c16655') }}
        </div>
        <div class="text item">
          {{ $t('a1788ba0.37fec4') }}
          <span style="font-size: 26px; color: red">{{ detail.money / 100 }}</span>
          {{ $t('a1788ba0.c16655') }}
        </div>
      </el-card>
      <div slot="footer" class="dialog-footer content-center">
        <el-button @click.native="dialog = false">{{ $t('a1788ba0.170933') }}</el-button>
        <el-button
          v-if="detail.money <= cashWithdrawalRebate"
          type="primary"
          @click="actionProcessCashWithdrawal('argee')"
        >
          {{ $t('a1788ba0.083792') }}
        </el-button>
      </div>
    </el-dialog>
  </SpPage>
</template>
<script>
import { mapGetters } from 'vuex'
import {
  withdrawalApplications,
  checkWithdrawal,
  withdrawalPayinfo,
  withdrawalStatistics
} from '../../api/promotions'

export default {
  data() {
    return {
      activeName: 'first',
      total_count: 0,
      textarea: '',
      dialog: false,
      canceldialog: false,
      pageLimit: 10,
      detail: {},
      payDialog: false,
      payList: [],
      cashWithdrawalRebate: 0,
      loading: false,
      params: {
        page: 1,
        pageSize: 20,
        mobile: '',
        status: ''
      },
      list: [{}],
      count: {
        all: 0,
        success: 0,
        apply: 0,
        userCount: 0
      }
    }
  },
  computed: {
    ...mapGetters(['wheight']),
    statusList() {
      return [
        { name: this.$t('a1788ba0.99c3eb'), value: 'apply' },
        { name: this.$t('a1788ba0.940fe3'), value: 'reject' },
        { name: this.$t('a1788ba0.dca060'), value: 'success' },
        { name: this.$t('a1788ba0.2e89ce'), value: 'process' },
        { name: this.$t('a1788ba0.f285c5'), value: 'failed' }
      ]
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    onSearch() {
      this.params.page = 1
      this.getList()
    },
    onReset() {
      this.params = {
        page: 1,
        pageSize: 20,
        mobile: '',
        status: ''
      }
      this.getList()
    },
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getList()
    },
    dialogCancel(detail) {
      this.canceldialog = true
      this.detail = detail
    },
    numberSearch(e) {
      this.params.page = 1
      this.getList()
    },
    statusSelectHandle() {
      this.params.page = 1
      this.getList()
    },
    actionProcessCashWithdrawal(processType) {
      if (processType == 'reject' && !this.textarea) {
        this.$message({ type: 'error', message: this.$t('a1788ba0.923aea') })
        return
      }

      if (processType == 'reject') {
        var params = { process_type: processType, remarks: this.textarea }
      } else {
        var params = { process_type: processType }
      }
      checkWithdrawal(this.detail.id, params).then((response) => {
        this.canceldialog = false
        this.dialog = false
        this.getList()
        if (processType == 'reject') {
          this.$message({ type: 'success', message: this.$t('a1788ba0.a3dd30') })
        } else {
          this.$message({ type: 'success', message: this.$t('a1788ba0.3d6f6e') })
        }
      })
    },
    dialogOpen(detail) {
      this.dialog = true
      this.detail = detail
      withdrawalStatistics({ user_id: detail.user_id }).then((response) => {
        this.cashWithdrawalRebate =
          Number(response.data.data.cashWithdrawalRebate) +
          Number(response.data.data.freezeCashWithdrawalRebate)
      })
    },
    dialogPayInfo(detail) {
      this.payDialog = true
      this.detail = detail
      withdrawalPayinfo(detail.id).then((response) => {
        this.payList = response.data.data.list
      })
    },
    getList() {
      this.loading = true
      withdrawalApplications(this.params).then((response) => {
        if (response.data.data.list) {
          this.list = response.data.data.list
          this.total_count = response.data.data.total_count
          this.count = response.data.data.count
        }
        this.loading = false
      })
    }
  }
}
</script>
<style scoped lang="scss">
.page-withdraw {
  .time-box {
    margin: 10px 0;
  }
  .basic {
    padding: 30px 0;
    text-align: center;
    span {
      font-size: 30px;
      font-weight: bold;
    }
  }
}
</style>
