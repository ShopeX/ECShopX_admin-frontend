<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-alert
      :title="$t('72b49acd.947d98')"
      :description="$t('72b49acd.933861')"
      :closable="false"
      type="warning"
      show-icon
    />
    <el-tabs v-model="newActivieName" type="border-card" @tab-click="newHandleClick">
      <el-tab-pane
        v-for="(item, index) in bankType"
        :key="index"
        :label="item.label"
        :name="item.name"
      />
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input v-model="params.account_name" size="mini" :placeholder="$t('72b49acd.a64dd7')">
            <el-button slot="append" size="mini" icon="el-icon-search" @click="numberSearch" />
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-select v-model="activeName" size="small" clearable @change="handleClick">
            <el-option
              v-for="item in statusOption"
              :key="item.value"
              :label="item.title"
              size="mini"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-date-picker
            v-model="create_time"
            size="mini"
            type="daterange"
            value-format="yyyy/MM/dd"
            :placeholder="$t('72b49acd.5d92ab')"
            style="width: 100%"
            @change="dateChange"
          />
        </el-col>
        <el-col :md="2" :lg="2">
          <el-button-group>
            <el-button size="mini" type="primary" @click="exportData">
              {{ $t('72b49acd.55405e') }}
            </el-button>
          </el-button-group>
          <el-popover
            placement="top-start"
            width="200"
            trigger="hover"
            :content="$t('72b49acd.676480')"
          >
            <i slot="reference" class="el-icon-question" />
          </el-popover>
        </el-col>
        <el-col v-if="activeName == 'apply' && newActivieName != 'wechatpay'" :span="6">
          <el-button-group>
            <el-button size="mini" type="primary" icon="plus" @click="batchPaymentOpen">
              {{ $t('72b49acd.3d3b8f') }}
            </el-button>
          </el-button-group>
        </el-col>
      </el-row>
      <el-table
        v-loading="loading"
        :data="list"
        :row-key="getRowKeys"
        :height="wheight - 360"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center" :label="$t('72b49acd.66eeac')" />
        <el-table-column prop="created" :label="$t('72b49acd.5ba072')" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.created | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="bank_name" :label="$t('72b49acd.c11ddb')" />
        <el-table-column prop="account_mobile" :label="$t('72b49acd.8098e2')">
          <template slot-scope="scope">
            <span>{{ scope.row.account_mobile }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('72b49acd.292a28')">
          <template slot-scope="scope">
            <span>¥ {{ scope.row.money / 100 }} </span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('72b49acd.5efc6e')">
          <template slot-scope="scope">
            <span> {{ scope.row.point }} </span>
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="$t('72b49acd.0ed783')">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 'apply'" type="primary">
              {{ $t('72b49acd.047109') }}
            </el-tag>
            <el-tag v-if="scope.row.status == 'process'" type="danger">
              {{ $t('72b49acd.444e00') }}
            </el-tag>
            <el-tag v-if="scope.row.status == 'success'" type="warning">
              {{ $t('72b49acd.42b524') }}
            </el-tag>
            <el-tag v-if="scope.row.status == 'reject'" type="info">
              {{ $t('72b49acd.81233d') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('72b49acd.2b6bc0')" width="240">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status == 'reject'"
              v-popover:popover
              size="mini"
              type="info"
            >
              <el-popover ref="popover" placement="top" width="400" trigger="click">
                <el-input type="textarea" :rows="6" :disabled="true" :value="scope.row.remarks" />
              </el-popover>
              {{ $t('72b49acd.f48f94') }}
            </el-button>
            <el-button
              v-if="
                scope.row.bank_type == 'wechatpay' &&
                (scope.row.status == 'process' || scope.row.status == 'success')
              "
              size="mini"
              type="warning"
              @click="dialogPayInfo(scope.row)"
            >
              {{ $t('72b49acd.e679e8') }}
            </el-button>
            <el-button
              v-if="scope.row.status == 'apply'"
              size="mini"
              type="primary"
              @click="dialogOpen(scope.row)"
            >
              {{ $t('72b49acd.1d6733') }}
            </el-button>
            <el-button
              v-if="scope.row.status == 'apply'"
              size="mini"
              type="primary"
              @click="dialogCancel(scope.row)"
            >
              {{ $t('72b49acd.7173f8') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="total_count > params.pageSize" class="mt-4 text-right">
        <el-pagination
          background
          layout="prev, pager, next, total"
          :current-page.sync="params.page"
          :total="total_count"
          :page-size="params.pageSize"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-tabs>

    <el-dialog
      :title="$t('72b49acd.e679e8')"
      :visible.sync="payDialog"
      :close-on-click-modal="false"
      width="50%"
    >
      <el-table :data="payList" border style="width: 100%">
        <el-table-column prop="update_time" :label="$t('72b49acd.4ff1e7')" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.update_time | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="amount" :label="$t('72b49acd.292a28')" width="180">
          <template slot-scope="scope">
            <span> {{ scope.row.amount / 100 }} </span> {{ $t('72b49acd.c16655') }}
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="$t('72b49acd.ac204b')">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 'NOT_PAY'"> {{ $t('72b49acd.8cbf8e') }} </span>
            <el-tag v-if="scope.row.status == 'SUCCESS'" type="success">
              {{ $t('72b49acd.c7c515') }}
            </el-tag>
            <span v-if="scope.row.status == 'FAIL'"> {{ $t('72b49acd.35d585') }} </span>
          </template>
        </el-table-column>
        <el-table-column prop="error_desc" :label="$t('72b49acd.727689')">
          <template slot-scope="scope">
            <span v-if="scope.row.error_desc">{{ scope.row.error_desc }}</span>
            <span v-else> - </span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer content-center">
        <el-button @click.native="payDialog = false"> {{ $t('72b49acd.b15d91') }} </el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="$t('72b49acd.03c85b')"
      :visible.sync="canceldialog"
      :close-on-click-modal="false"
      width="50%"
    >
      <el-input v-model="textarea" type="textarea" :rows="6" :placeholder="$t('72b49acd.fc955a')" />
      <div slot="footer" class="dialog-footer content-center">
        <el-button @click.native="canceldialog = false"> {{ $t('72b49acd.170933') }} </el-button>
        <el-button type="primary" @click="actionProcessCashWithdrawal('reject')">
          {{ $t('72b49acd.fc9087') }}
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="$t('72b49acd.597e24')"
      :visible.sync="dialog"
      :close-on-click-modal="false"
      width="50%"
    >
      <el-alert
        v-if="detail.bank_type === 'wechatpay'"
        :title="$t('72b49acd.5a8dbc')"
        :description="$t('72b49acd.9676c0')"
        :closable="false"
        type="warning"
        show-icon
      />
      <el-alert
        v-else
        :title="$t('72b49acd.68edc1')"
        :description="$t('72b49acd.46d94d')"
        :closable="false"
        type="info"
        show-icon
      />
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <el-tag v-if="detail.bank_type === 'wechatpay'"> {{ $t('72b49acd.5a8dbc') }} </el-tag>
          <el-tag v-if="detail.bank_type === 'alipay'"> {{ $t('72b49acd.6180e4') }} </el-tag>
          <el-tag v-if="detail.bank_type === 'bankpay'"> {{ $t('72b49acd.2c4912') }} </el-tag>
        </div>
        <el-row v-if="detail.bank_type === 'bankpay'">
          <el-col :span="4"> {{ $t('72b49acd.181d9a') }} </el-col>
          <el-col :span="8">
            {{ detail.bank_name }}
          </el-col>
        </el-row>
        <el-row v-if="detail.bank_type !== 'wechatpay'">
          <el-col :span="4"> {{ $t('72b49acd.7116e7') }} </el-col>
          <el-col :span="8">
            {{ detail.bank_account }}
          </el-col>
        </el-row>
        <el-row v-if="detail.bank_type !== 'wechatpay'">
          <el-col :span="4"> {{ $t('72b49acd.91a7b4') }} </el-col>
          <el-col :span="8">
            {{ detail.account_name }}
          </el-col>
        </el-row>
        <el-row v-if="detail.bank_type === 'bankpay'">
          <el-col :span="4"> {{ $t('72b49acd.134bec') }} </el-col>
          <el-col :span="8">
            {{ detail.account_mobile }}
          </el-col>
        </el-row>
        <el-row v-if="detail.bank_type === 'bankpay'">
          <el-col :span="4"> {{ $t('72b49acd.1fe8af') }} </el-col>
          <el-col :span="8">
            {{ detail.bank_address }}
          </el-col>
        </el-row>
        <div class="text item">
          {{ $t('72b49acd.37fec4') }}
          <span style="font-size: 26px; color: red">{{ detail.money / 100 }}</span>
          {{ $t('72b49acd.c16655') }}
        </div>
      </el-card>
      <div slot="footer" class="dialog-footer content-center">
        <el-button @click.native="dialog = false"> {{ $t('72b49acd.170933') }} </el-button>
        <el-button type="primary" @click="actionProcessCashWithdrawal('argee')">
          {{ $t('72b49acd.3d98ab') }}
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="$t('72b49acd.5186cd')"
      :visible.sync="newDialog"
      :close-on-click-modal="false"
      width="50%"
    >
      <el-alert
        v-if="newActivieName === 'wechatpay'"
        :title="$t('72b49acd.5a8dbc')"
        :description="$t('72b49acd.9676c0')"
        :closable="false"
        type="warning"
        show-icon
      />
      <el-alert
        v-else
        :title="$t('72b49acd.68edc1')"
        :description="$t('72b49acd.46d94d')"
        :closable="false"
        type="info"
        show-icon
      />
      <el-table v-loading="loading" :data="selectData" :height="wheight - 220">
        <el-table-column prop="created" :label="$t('72b49acd.5ba072')" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.created | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="account_mobile" :label="$t('72b49acd.8098e2')">
          <template slot-scope="scope">
            <span>{{ scope.row.account_mobile }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('72b49acd.292a28')">
          <template slot-scope="scope">
            <span>¥ {{ scope.row.money / 100 }} </span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('72b49acd.5efc6e')">
          <template slot-scope="scope">
            <span> {{ scope.row.point }} </span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer content-center">
        <el-button @click.native="newDialog = false"> {{ $t('72b49acd.170933') }} </el-button>
        <el-button type="primary" @click="batchPayment('argee')">
          {{ $t('72b49acd.3d98ab') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import {
  processCashWithdrawal,
  getCashWithdrawalList,
  getMerchantTradeList,
  batchProcessCashWithdrawal,
  withdrawExport
} from '../../../../api/community'

export default {
  data() {
    return {
      create_time: '',
      newActivieName: 'alipay',
      activeName: 'apply',
      total_count: 0,
      textarea: '',
      dialog: false,
      canceldialog: false,
      pageLimit: 10,
      detail: {},
      payDialog: false,
      payList: [],
      loading: false,
      params: {
        page: 1,
        pageSize: 20,
        account_name: '',
        status: '',
        start_time: '',
        end_time: '',
        bank_type: 'alipay'
      },
      list: [{}],
      selectData: [],
      batchfilter: {
        process_type: 'argee',
        cash_withdrawal_id: [],
        bank_type: ''
      },
      newDialog: false
    }
  },
  computed: {
    ...mapGetters(['wheight']),
    bankType() {
      return [
        { label: this.$t('72b49acd.6180e4'), name: 'alipay' },
        { label: this.$t('72b49acd.2c4912'), name: 'bankpay' },
        { label: this.$t('72b49acd.5a8dbc'), name: 'wechatpay' }
      ]
    },
    statusOption() {
      return [
        { title: this.$t('72b49acd.047109'), value: 'apply' },
        { title: this.$t('72b49acd.444e00'), value: 'process' },
        { title: this.$t('72b49acd.42b524'), value: 'success' },
        { title: this.$t('72b49acd.c17a0b'), value: 'reject' }
      ]
    }
  },
  mounted() {
    this.params.status = this.activeName
    this.getList()
  },
  methods: {
    newHandleClick(tab, event) {
      this.newActivieName = tab.name
      this.params.page = 1
      this.params.bank_type = tab.name
      this.batchfilter.bank_type = tab.name
      this.getList()
    },
    getRowKeys(row) {
      return row.id
    },
    handleClick(val) {
      this.activeName = val
      this.params.page = 1
      this.params.status = val
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
    dateChange(val) {
      this.params.status = ''
      if (val && val.length > 0) {
        this.params.start_time = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
        this.params.end_time = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
      } else {
        this.params.start_time = ''
        this.params.end_time = ''
      }
      this.params.page = 1
      this.getList()
    },
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    numberSearch(e) {
      this.params.page = 1
      this.getList()
    },
    actionProcessCashWithdrawal(processType) {
      if (processType == 'reject' && !this.textarea) {
        this.$message({ type: 'error', message: this.$t('72b49acd.923aea') })
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
          this.$message({ type: 'success', message: this.$t('72b49acd.e2874a') })
        } else {
          this.$message({ type: 'success', message: this.$t('72b49acd.3d6f6e') })
        }
      })
    },
    dialogOpen(detail) {
      this.dialog = true
      this.detail = detail
    },
    dialogPayInfo(detail) {
      this.payDialog = true
      this.detail = detail
      getMerchantTradeList(detail.id).then((response) => {
        this.payList = response.data.data.list
      })
    },
    getList() {
      this.loading = true
      getCashWithdrawalList(this.params).then((response) => {
        if (response.data.data.list) {
          this.list = response.data.data.list
          this.total_count = response.data.data.total_count
        }
        this.loading = false
      })
    },
    exportData(type) {
      this.params.page = 1
      withdrawExport(this.params).then((response) => {
        if (response.data.data.status) {
          this.$message({
            type: 'success',
            message: this.$t('72b49acd.3e1ddd')
          })
          return
        } else if (response.data.data.url) {
          this.downloadUrl = response.data.data.url
          this.downloadName = response.data.data.filename
          this.downloadView = true
        } else {
          this.$message({
            type: 'error',
            message: this.$t('72b49acd.89ae53')
          })
          return
        }
      })
    },
    handleSelectionChange(rows) {
      this.batchfilter.cash_withdrawal_id = []
      this.selectData = []
      if (rows) {
        rows.forEach((row) => {
          if (row) {
            this.batchfilter.cash_withdrawal_id.push(row.id)
            this.selectData.push(row)
          }
        })
      }
    },
    batchPaymentOpen() {
      this.newDialog = true
    },
    batchPayment(type) {
      batchProcessCashWithdrawal(this.batchfilter).then((res) => {
        this.newDialog = false
        this.$message({ type: 'success', message: this.$t('72b49acd.3d6f6e') })
        this.getList()
      })
    }
  }
}
</script>
