<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-row class="content-bottom-padded" :gutter="20">
      <el-col :span="4">
        <el-select
          v-model="params.status"
          :placeholder="$t('fb2561ac.0ed783')"
          style="width: 100%"
          @change="statusSelectHandle"
        >
          <el-option
            v-for="(item, index) in statusList"
            :key="index"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-input v-model="params.mobile" :placeholder="$t('fb2561ac.6fb813')">
          <el-button slot="append" icon="el-icon-search" @click="numberSearch" />
        </el-input>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="list" height="550" border>
      <el-table-column prop="created" :label="$t('fb2561ac.5ba072')" min-width="84">
        <template slot-scope="scope">
          <span>{{ scope.row.created | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="distributor_name" :label="$t('fb2561ac.70cb31')" />
      <el-table-column prop="distributor_mobile" :label="$t('fb2561ac.bed5e6')" />
      <el-table-column :label="$t('fb2561ac.8f5d8a')">
        <template slot-scope="scope">
          <span> {{ scope.row.money / 100 }} </span> {{ $t('fb2561ac.c16655') }}
        </template>
      </el-table-column>
      <el-table-column prop="status" :label="$t('fb2561ac.0ed783')">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 'apply'" type="primary">
            {{ $t('fb2561ac.047109') }}
          </el-tag>
          <el-tag v-if="scope.row.status == 'process'" type="danger">
            {{ $t('fb2561ac.444e00') }}
          </el-tag>
          <el-tag v-if="scope.row.status == 'success'" type="warning">
            {{ $t('fb2561ac.42b524') }}
          </el-tag>
          <el-tag v-if="scope.row.status == 'reject'" type="info">
            {{ $t('fb2561ac.81233d') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('fb2561ac.e679e8')" width="120">
        <template slot-scope="scope">
          <el-button size="mini" type="warning" @click="dialogPayInfo(scope.row)">
            {{ $t('fb2561ac.e679e8') }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column :label="$t('fb2561ac.2b6bc0')" width="160">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status == 'reject'" v-popover:popover size="mini" type="info">
            <el-popover ref="popover" placement="top" width="400" trigger="click">
              <el-input type="textarea" :rows="6" :disabled="true" :value="scope.row.remarks" />
            </el-popover>
            {{ $t('fb2561ac.f48f94') }}
          </el-button>
          <el-button
            v-if="scope.row.status == 'apply'"
            size="mini"
            type="primary"
            @click="dialogOpen(scope.row)"
          >
            {{ $t('fb2561ac.1d6733') }}
          </el-button>
          <el-button
            v-if="scope.row.status == 'apply'"
            size="mini"
            type="primary"
            @click="dialogCancel(scope.row)"
          >
            {{ $t('fb2561ac.7173f8') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="total_count > params.pageSize" class="mt-4 text-right">
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page.sync="params.page"
        :total="total_count"
        :page-size="params.pageSize"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog
      :title="$t('fb2561ac.e679e8')"
      :visible.sync="payDialog"
      :close-on-click-modal="false"
      width="50%"
    >
      <el-table :data="payList" border style="width: 100%">
        <el-table-column prop="update_time" :label="$t('fb2561ac.4ff1e7')" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.update_time | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="amount" :label="$t('fb2561ac.7f295a')" width="180">
          <template slot-scope="scope">
            <span> {{ scope.row.amount / 100 }} </span> {{ $t('fb2561ac.c16655') }}
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="$t('fb2561ac.ac204b')">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 'NOT_PAY'"> {{ $t('fb2561ac.8cbf8e') }} </span>
            <el-tag v-if="scope.row.status == 'SUCCESS'" type="success">
              {{ $t('fb2561ac.c7c515') }}
            </el-tag>
            <span v-if="scope.row.status == 'FAIL'"> {{ $t('fb2561ac.35d585') }} </span>
          </template>
        </el-table-column>
        <el-table-column prop="error_desc" :label="$t('fb2561ac.727689')">
          <template slot-scope="scope">
            <span v-if="scope.row.error_desc">{{ scope.row.error_desc }}</span>
            <span v-else> - </span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer content-center">
        <el-button @click.native="payDialog = false"> {{ $t('fb2561ac.b15d91') }} </el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="$t('fb2561ac.03c85b')"
      :visible.sync="canceldialog"
      :close-on-click-modal="false"
      width="50%"
    >
      <el-input v-model="textarea" type="textarea" :rows="6" :placeholder="$t('fb2561ac.fc955a')" />
      <div slot="footer" class="dialog-footer content-center">
        <el-button @click.native="canceldialog = false"> {{ $t('fb2561ac.170933') }} </el-button>
        <el-button type="primary" @click="actionProcessCashWithdrawal('reject')">
          {{ $t('fb2561ac.fc9087') }}
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="$t('fb2561ac.597e24')"
      :visible.sync="dialog"
      :close-on-click-modal="false"
      width="50%"
    >
      <el-alert
        v-if="detail.money > cashWithdrawalRebate"
        :title="$t('fb2561ac.0ea1df')"
        :description="$t('fb2561ac.3d89a7')"
        :closable="false"
        type="error"
        show-icon
      />
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span style="font-size: 20px"
            >{{ detail.distributor_name }} {{ detail.distributor_mobile }}</span
          >
        </div>
        <div class="text item">
          <span>{{ $t('fb2561ac.7069d4') }} </span
          ><span style="font-size: 26px; color: red">{{ cashWithdrawalRebate / 100 }}</span>
          {{ $t('fb2561ac.c16655') }}
        </div>
        <div class="text item">
          {{ $t('fb2561ac.37fec4') }}
          <span style="font-size: 26px; color: red">{{ detail.money / 100 }}</span>
          {{ $t('fb2561ac.c16655') }}
        </div>
      </el-card>
      <div slot="footer" class="dialog-footer content-center">
        <el-button @click.native="dialog = false"> {{ $t('fb2561ac.170933') }} </el-button>
        <el-button
          v-if="detail.money <= cashWithdrawalRebate"
          type="primary"
          @click="actionProcessCashWithdrawal('argee')"
        >
          {{ $t('fb2561ac.5f7445') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getCashWithdrawals,
  processCashWithdrawal,
  getDistributorCount,
  getCashWithdrawalPayInfo
} from '../../../api/marketing'

export default {
  data() {
    return {
      statusList: [
        { name: this.$t('fb2561ac.99c3eb'), value: 'apply' },
        { name: this.$t('fb2561ac.940fe3'), value: 'reject' },
        { name: this.$t('fb2561ac.dca060'), value: 'success' },
        { name: this.$t('fb2561ac.81246b'), value: 'process' }
      ],
      activeName: 'first',
      total_count: 0,
      textarea: '',
      dialog: false,
      canceldialog: false,
      applyText: '',
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
      list: [{}]
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
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
        this.$message({ type: 'error', message: this.$t('fb2561ac.923aea') })
        return
      }

      if (processType == 'reject') {
        var params = { process_type: processType, remarks: this.textarea }
      } else {
        var params = { process_type: processType }
      }
      processCashWithdrawal(this.detail.id, params).then((response) => {
        this.canceldialog = false
        this.dialog = false
        this.getList()
        if (processType == 'reject') {
          this.$message({ type: 'success', message: this.$t('fb2561ac.a3dd30') })
        } else {
          this.$message({ type: 'success', message: this.$t('fb2561ac.3d6f6e') })
        }
      })
    },
    dialogOpen(detail) {
      this.dialog = true
      this.detail = detail
      this.applyText = this.$t('fb2561ac.628f1d') + detail.money / 100 + this.$t('fb2561ac.c16655')
      getDistributorCount(detail.distributor_id).then((response) => {
        this.cashWithdrawalRebate = response.data.data.cashWithdrawalRebate
      })
    },
    dialogPayInfo(detail) {
      this.payDialog = true
      this.detail = detail
      getCashWithdrawalPayInfo(detail.id).then((response) => {
        this.payList = response.data.data.list
      })
    },
    getList() {
      this.loading = true
      getCashWithdrawals(this.params).then((response) => {
        if (response.data.data.list) {
          this.list = response.data.data.list
          this.total_count = response.data.data.total_count
        }
        this.loading = false
      })
    }
  }
}
</script>
