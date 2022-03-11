<template>
  <div>
    <el-alert
      title="温馨提示"
      description="批量打款操作，仅支持线下打款操作"
      :closable="false"
      type="warning"
      show-icon
    />
    <el-tabs
      v-model="newActivieName"
      type="border-card"
      @tab-click="newHandleClick"
    >
      <el-tab-pane
        v-for="(item, index) in bankType"
        :key="index"
        :label="item.label"
        :name="item.name"
      />
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            v-model="params.account_name"
            size="mini"
            placeholder="提现账号姓名"
          >
            <el-button
              slot="append"
              size="mini"
              icon="el-icon-search"
              @click="numberSearch"
            />
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-select
            v-model="activeName"
            size="small"
            clearable
            @change="handleClick"
          >
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
            placeholder="添加时间筛选"
            style="width: 100%"
            @change="dateChange"
          />
        </el-col>
        <el-col
          :md="2"
          :lg="2"
        >
          <el-button-group>
            <el-button
              size="mini"
              type="primary"
              @click="exportData"
            >
              导出
            </el-button>
          </el-button-group>
          <el-popover
            placement="top-start"
            width="200"
            trigger="hover"
            content="导出任务会以队列执行，点击导出后，请至‘设置-导出列表’页面中查看及下载数据"
          >
            <i
              slot="reference"
              class="el-icon-question"
            />
          </el-popover>
        </el-col>
        <el-col
          v-if="activeName == 'apply' && newActivieName != 'wechatpay'"
          :span="6"
        >
          <el-button-group>
            <el-button
              size="mini"
              type="primary"
              icon="plus"
              @click="batchPaymentOpen"
            >
              批量确认
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
        <el-table-column
          type="selection"
          align="center"
          label="全选"
        />
        <el-table-column
          prop="created"
          label="申请时间"
          min-width="120"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.created | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="bank_name"
          label="打款方式"
        />
        <el-table-column
          prop="account_mobile"
          label="手机号"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.account_mobile }}</span>
          </template>
        </el-table-column>
        <el-table-column label="提现金额">
          <template slot-scope="scope">
            <span>¥ {{ scope.row.money / 100 }} </span>
          </template>
        </el-table-column>
        <el-table-column label="提现积分">
          <template slot-scope="scope">
            <span> {{ scope.row.point }} </span>
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
          label="操作"
          width="240"
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
              v-if="
                scope.row.bank_type == 'wechatpay' &&
                  (scope.row.status == 'process' || scope.row.status == 'success')
              "
              size="mini"
              type="warning"
              @click="dialogPayInfo(scope.row)"
            >
              打款记录
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
          layout="prev, pager, next, total"
          :current-page.sync="params.page"
          :total="total_count"
          :page-size="params.pageSize"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-tabs>

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
          label="提现金额"
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
        v-if="detail.bank_type === 'wechatpay'"
        title="微信打款"
        description="微信打款方式，将直接通过微信账号打款到推广员"
        :closable="false"
        type="warning"
        show-icon
      />
      <el-alert
        v-else
        title="线下打款"
        description="请通过线下打款方式打款，此处不会进行实际打款"
        :closable="false"
        type="info"
        show-icon
      />
      <el-card class="box-card">
        <div
          slot="header"
          class="clearfix"
        >
          <el-tag v-if="detail.bank_type === 'wechatpay'">
            微信打款
          </el-tag>
          <el-tag v-if="detail.bank_type === 'alipay'">
            支付宝线下打款
          </el-tag>
          <el-tag v-if="detail.bank_type === 'bankpay'">
            银行卡线下打款
          </el-tag>
        </div>
        <el-row v-if="detail.bank_type === 'bankpay'">
          <el-col :span="4">
            银行名称
          </el-col>
          <el-col :span="8">
            {{ detail.bank_name }}
          </el-col>
        </el-row>
        <el-row v-if="detail.bank_type !== 'wechatpay'">
          <el-col :span="4">
            账户
          </el-col>
          <el-col :span="8">
            {{ detail.bank_account }}
          </el-col>
        </el-row>
        <el-row v-if="detail.bank_type !== 'wechatpay'">
          <el-col :span="4">
            账户姓名
          </el-col>
          <el-col :span="8">
            {{ detail.account_name }}
          </el-col>
        </el-row>
        <el-row v-if="detail.bank_type === 'bankpay'">
          <el-col :span="4">
            预留手机号
          </el-col>
          <el-col :span="8">
            {{ detail.account_mobile }}
          </el-col>
        </el-row>
        <el-row v-if="detail.bank_type === 'bankpay'">
          <el-col :span="4">
            开户行信息
          </el-col>
          <el-col :span="8">
            {{ detail.bank_address }}
          </el-col>
        </el-row>
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
          type="primary"
          @click="actionProcessCashWithdrawal('argee')"
        >
          同意提现
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="批量提现确认"
      :visible.sync="newDialog"
      :close-on-click-modal="false"
      width="50%"
    >
      <el-alert
        v-if="newActivieName === 'wechatpay'"
        title="微信打款"
        description="微信打款方式，将直接通过微信账号打款到推广员"
        :closable="false"
        type="warning"
        show-icon
      />
      <el-alert
        v-else
        title="线下打款"
        description="请通过线下打款方式打款，此处不会进行实际打款"
        :closable="false"
        type="info"
        show-icon
      />
      <el-table
        v-loading="loading"
        :data="selectData"
        :height="wheight - 220"
      >
        <el-table-column
          prop="created"
          label="申请时间"
          min-width="120"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.created | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="account_mobile"
          label="手机号"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.account_mobile }}</span>
          </template>
        </el-table-column>
        <el-table-column label="提现金额">
          <template slot-scope="scope">
            <span>¥ {{ scope.row.money / 100 }} </span>
          </template>
        </el-table-column>
        <el-table-column label="提现积分">
          <template slot-scope="scope">
            <span> {{ scope.row.point }} </span>
          </template>
        </el-table-column>
      </el-table>
      <div
        slot="footer"
        class="dialog-footer content-center"
      >
        <el-button @click.native="newDialog = false">
          取消操作
        </el-button>
        <el-button
          type="primary"
          @click="batchPayment('argee')"
        >
          同意提现
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
  data () {
    return {
      create_time: '',
      bankType: [
        { label: '支付宝线下打款', name: 'alipay' },
        { label: '银行卡线下打款', name: 'bankpay' },
        { label: '微信打款', name: 'wechatpay' }
      ],
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
      statusOption: [
        { title: '待处理', value: 'apply' },
        { title: '付款异常', value: 'process' },
        { title: '提现完成', value: 'success' },
        { title: '拒绝退款', value: 'reject' }
      ],
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
    ...mapGetters(['wheight'])
  },
  mounted () {
    this.params.status = this.activeName
    this.getList()
  },
  methods: {
    newHandleClick (tab, event) {
      this.newActivieName = tab.name
      this.params.page = 1
      this.params.bank_type = tab.name
      this.batchfilter.bank_type = tab.name
      this.getList()
    },
    getRowKeys (row) {
      return row.id
    },
    handleClick (val) {
      this.activeName = val
      this.params.page = 1
      this.params.status = val
      this.getList()
    },
    handleCurrentChange (page_num) {
      this.params.page = page_num
      this.getList()
    },
    dialogCancel (detail) {
      this.canceldialog = true
      this.detail = detail
    },
    dateChange (val) {
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
    dateStrToTimeStamp (str) {
      return Date.parse(new Date(str)) / 1000
    },
    numberSearch (e) {
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
          this.$message({ type: 'success', message: '拒绝提现成功' })
        } else {
          this.$message({ type: 'success', message: '打款成功' })
        }
      })
    },
    dialogOpen (detail) {
      this.dialog = true
      this.detail = detail
    },
    dialogPayInfo (detail) {
      this.payDialog = true
      this.detail = detail
      getMerchantTradeList(detail.id).then((response) => {
        this.payList = response.data.data.list
      })
    },
    getList () {
      this.loading = true
      getCashWithdrawalList(this.params).then((response) => {
        if (response.data.data.list) {
          this.list = response.data.data.list
          this.total_count = response.data.data.total_count
        }
        this.loading = false
      })
    },
    exportData (type) {
      this.params.page = 1
      withdrawExport(this.params).then((response) => {
        if (response.data.data.status) {
          this.$message({
            type: 'success',
            message: '已加入执行队列，请在设置-导出列表中下载'
          })
          return
        } else if (response.data.data.url) {
          this.downloadUrl = response.data.data.url
          this.downloadName = response.data.data.filename
          this.downloadView = true
        } else {
          this.$message({
            type: 'error',
            message: '无内容可导出 或 执行失败，请检查重试'
          })
          return
        }
      })
    },
    handleSelectionChange (rows) {
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
    batchPaymentOpen () {
      this.newDialog = true
    },
    batchPayment (type) {
      batchProcessCashWithdrawal(this.batchfilter).then((res) => {
        this.newDialog = false
        this.$message({ type: 'success', message: '打款成功' })
        this.getList()
      })
    }
  }
}
</script>
