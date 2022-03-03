<template>
  <div>
    <el-row
      class="content-bottom-padded"
      :gutter="20"
    >
      <el-col :span="4">
        <el-select
          v-model="params.status"
          placeholder="提现状态"
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
        <el-input
          v-model="params.mobile"
          placeholder="分销商手机号"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="numberSearch"
          />
        </el-input>
      </el-col>
    </el-row>
    <el-table
      v-loading="loading"
      :data="list"
      height="550"
      border
    >
      <el-table-column
        prop="created"
        label="申请时间"
        min-width="84"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.created | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="distributor_name"
        label="分销商姓名"
      />
      <el-table-column
        prop="distributor_mobile"
        label="分销商手机号"
      />
      <el-table-column label="申请提现金额">
        <template slot-scope="scope">
          <span> {{ scope.row.money / 100 }} </span> 元
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="提现状态"
      >
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.status == 'apply'"
            type="primary"
          >
            待处理
          </el-tag>
          <el-tag
            v-if="scope.row.status == 'process'"
            type="danger"
          >
            付款异常
          </el-tag>
          <el-tag
            v-if="scope.row.status == 'success'"
            type="warning"
          >
            提现完成
          </el-tag>
          <el-tag
            v-if="scope.row.status == 'reject'"
            type="info"
          >
            已拒绝
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="打款记录"
        width="120"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="warning"
            @click="dialogPayInfo(scope.row)"
          >
            打款记录
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="160"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status == 'reject'"
            v-popover:popover
            size="mini"
            type="info"
          >
            <el-popover
              ref="popover"
              placement="top"
              width="400"
              trigger="click"
            >
              <el-input
                type="textarea"
                :rows="6"
                :disabled="true"
                :value="scope.row.remarks"
              />
            </el-popover>
            拒绝原因
          </el-button>
          <el-button
            v-if="scope.row.status == 'apply'"
            size="mini"
            type="primary"
            @click="dialogOpen(scope.row)"
          >
            打款
          </el-button>
          <el-button
            v-if="scope.row.status == 'apply'"
            size="mini"
            type="primary"
            @click="dialogCancel(scope.row)"
          >
            拒绝
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div
      v-if="total_count > params.pageSize"
      class="content-padded content-center"
    >
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
      title="打款记录"
      :visible.sync="payDialog"
      :close-on-click-modal="false"
      width="50%"
    >
      <el-table
        :data="payList"
        border
        style="width: 100%"
      >
        <el-table-column
          prop="update_time"
          label="日期"
          width="180"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.update_time | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="amount"
          label="提现佣金"
          width="180"
        >
          <template slot-scope="scope">
            <span> {{ scope.row.amount / 100 }} </span> 元
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="付款状态"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.status == 'NOT_PAY'"> 未付款 </span>
            <el-tag
              v-if="scope.row.status == 'SUCCESS'"
              type="success"
            >
              付款成功
            </el-tag>
            <span v-if="scope.row.status == 'FAIL'"> 付款失败 </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="error_desc"
          label="付款失败原因"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.error_desc">{{ scope.row.error_desc }}</span>
            <span v-else> - </span>
          </template>
        </el-table-column>
      </el-table>
      <div
        slot="footer"
        class="dialog-footer content-center"
      >
        <el-button @click.native="payDialog = false">
          关闭
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="拒绝提现"
      :visible.sync="canceldialog"
      :close-on-click-modal="false"
      width="50%"
    >
      <el-input
        v-model="textarea"
        type="textarea"
        :rows="6"
        placeholder="请输入拒绝原因"
      />
      <div
        slot="footer"
        class="dialog-footer content-center"
      >
        <el-button @click.native="canceldialog = false">
          取消操作
        </el-button>
        <el-button
          type="primary"
          @click="actionProcessCashWithdrawal('reject')"
        >
          确认拒绝
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="提现确认"
      :visible.sync="dialog"
      :close-on-click-modal="false"
      width="50%"
    >
      <el-alert
        v-if="detail.money > cashWithdrawalRebate"
        title="账户异常，申请提现金额大于可提现金额"
        description="不可进行打款操作，请联系服务商查看详情。"
        :closable="false"
        type="error"
        show-icon
      />
      <el-card class="box-card">
        <div
          slot="header"
          class="clearfix"
        >
          <span
            style="font-size: 20px"
          >{{ detail.distributor_name }} {{ detail.distributor_mobile }}</span>
        </div>
        <div class="text item">
          <span>可提现佣金 </span><span style="font-size: 26px; color: red">{{ cashWithdrawalRebate / 100 }}</span> 元
        </div>
        <div class="text item">
          申请提现 <span style="font-size: 26px; color: red">{{ detail.money / 100 }}</span> 元
        </div>
      </el-card>
      <div
        slot="footer"
        class="dialog-footer content-center"
      >
        <el-button @click.native="dialog = false">
          取消操作
        </el-button>
        <el-button
          v-if="detail.money <= cashWithdrawalRebate"
          type="primary"
          @click="actionProcessCashWithdrawal('argee')"
        >
          打款到分销商
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
  data () {
    return {
      statusList: [
        { name: '提现待处理', value: 'apply' },
        { name: '提现拒绝', value: 'reject' },
        { name: '提现成功', value: 'success' },
        { name: '提现异常', value: 'process' }
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
  mounted () {
    this.getList()
  },
  methods: {
    handleCurrentChange (page_num) {
      this.params.page = page_num
      this.getList()
    },
    dialogCancel (detail) {
      this.canceldialog = true
      this.detail = detail
    },
    numberSearch (e) {
      this.params.page = 1
      this.getList()
    },
    statusSelectHandle () {
      this.params.page = 1
      this.getList()
    },
    actionProcessCashWithdrawal (processType) {
      if (processType == 'reject' && !this.textarea) {
        this.$message({ type: 'error', message: '请输入拒绝提现原因' })
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
          this.$message({ type: 'success', message: '拒绝佣金提现成功' })
        } else {
          this.$message({ type: 'success', message: '打款成功' })
        }
      })
    },
    dialogOpen (detail) {
      this.dialog = true
      this.detail = detail
      this.applyText = '分销商申请提现佣金' + detail.money / 100 + '元'
      getDistributorCount(detail.distributor_id).then((response) => {
        this.cashWithdrawalRebate = response.data.data.cashWithdrawalRebate
      })
    },
    dialogPayInfo (detail) {
      this.payDialog = true
      this.detail = detail
      getCashWithdrawalPayInfo(detail.id).then((response) => {
        this.payList = response.data.data.list
      })
    },
    getList () {
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
