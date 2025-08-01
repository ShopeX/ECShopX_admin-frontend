<template>
  <SpPage class="page-withdraw">
    <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="status" label="">
        <el-select clearable v-model="params.status" placeholder="提现状态 ">
          <el-option
            v-for="(item, index) in statusList"
            :key="index"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </SpFilterFormItem>
      <SpFilterFormItem prop="mobile" label="">
        <el-input placeholder="手机号" v-model="params.mobile" />
      </SpFilterFormItem>
    </SpFilterForm>
    <el-card>
      <div class="time-box basic">
        <el-row>
          <el-col :span="6">
            <div>佣金总额</div>
            &nbsp;<span>¥{{ count.all / 100 }}</span>
          </el-col>
          <el-col :span="6">
            <div>已提现总额</div>
            &nbsp;<span>¥{{ count.success / 100 }}</span>
          </el-col>
          <el-col :span="6">
            <div>待处理金额</div>
            &nbsp;<span>¥{{ count.apply / 100 }}</span>
          </el-col>
          <el-col :span="6">
            <div>申请提现人数</div>
            &nbsp;<span>{{ count.userCount }}</span>
          </el-col>
        </el-row>
      </div>
      <el-table :data="list" :height="wheight - 150" v-loading="loading">
        <el-table-column prop="created" label="申请时间" min-width="84">
          <template slot-scope="scope">
            <span>{{ scope.row.created | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="打款方式">
          <template slot-scope="scope">
            <el-tag size="mini" v-if="scope.row.pay_type === 'wechat'" type="success">微信</el-tag>
            <el-tag size="mini" v-if="scope.row.pay_type === 'alipay'">支付宝</el-tag>
            <el-tag size="mini" v-if="scope.row.pay_type === 'hfpay'" type="warning">汇付</el-tag>
            <el-tag size="mini" v-if="scope.row.pay_type === 'bankcard'" type="warning">
              银行卡
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="mobile" label="推广员手机号">
          <template slot-scope="scope">
            <span>{{ scope.row.mobile }}</span>
          </template>
        </el-table-column>
        <el-table-column label="申请提现金额">
          <template slot-scope="scope">
            <span> {{ scope.row.money / 100 }} </span> 元
          </template>
        </el-table-column>
        <el-table-column prop="status" label="提现状态">
          <template slot-scope="scope">
            <el-tag type="primary" v-if="scope.row.status == 'apply'" size="mini">
              提现待处理
            </el-tag>
            <el-tag type="warning" v-if="scope.row.status == 'process'" size="mini">
              提现处理中
            </el-tag>
            <el-tag type="success" v-if="scope.row.status == 'success'" size="mini">
              提现完成
            </el-tag>
            <el-tag type="info" v-if="scope.row.status == 'reject'" size="mini">提现拒绝</el-tag>
            <el-tag type="danger" v-if="scope.row.status == 'failed'" size="mini">提现失败</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="打款记录" width="120">
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-document"
              type="text"
              @click="dialogPayInfo(scope.row)"
            >
              打款记录
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160">
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
              <i class="el-icon-warning mark" /> 拒绝原因
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
              <i class="el-icon-warning mark" /> 失败原因
            </el-button>
            <el-button
              size="mini"
              type="primary"
              v-if="scope.row.status == 'apply'"
              @click="dialogOpen(scope.row)"
            >
              打款
            </el-button>
            <el-button
              size="mini"
              type="warning"
              v-if="scope.row.status == 'apply'"
              @click="dialogCancel(scope.row)"
            >
              拒绝
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
    <el-dialog title="打款记录" :visible.sync="payDialog" :close-on-click-modal="false" width="50%">
      <el-table :data="payList">
        <el-table-column prop="update_time" label="日期" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.update_time | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="提现佣金" width="180">
          <template slot-scope="scope">
            <span> {{ scope.row.amount / 100 }} </span> 元
          </template>
        </el-table-column>
        <el-table-column prop="status" label="付款状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 'NOT_PAY'"> 未付款 </span>
            <span v-if="scope.row.status == 'PAYING'"> 打款中 </span>
            <el-tag type="success" v-if="scope.row.status == 'SUCCESS'"> 付款成功 </el-tag>
            <span v-if="scope.row.status == 'FAIL'"> 付款失败 </span>
          </template>
        </el-table-column>
        <el-table-column prop="error_desc" label="付款失败原因">
          <template slot-scope="scope">
            <span v-if="scope.row.error_desc">{{ scope.row.error_desc }}</span>
            <span v-else> - </span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer content-center">
        <el-button @click.native="payDialog = false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="拒绝提现"
      :visible.sync="canceldialog"
      :close-on-click-modal="false"
      width="50%"
    >
      <el-input type="textarea" :rows="6" placeholder="请输入拒绝原因" v-model="textarea" />
      <div slot="footer" class="dialog-footer content-center">
        <el-button @click.native="canceldialog = false">取消操作</el-button>
        <el-button type="primary" @click="actionProcessCashWithdrawal('reject')">
          确认拒绝
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="提现确认" :visible.sync="dialog" :close-on-click-modal="false" width="50%">
      <el-alert
        v-if="detail.money > cashWithdrawalRebate"
        title="账户异常，申请提现金额大于可提现金额"
        description="不可进行打款操作，请联系服务商查看详情。"
        :closable="false"
        type="error"
        show-icon
      />
      <el-alert
        v-if="detail.pay_type === 'wechat'"
        title="微信打款"
        description="微信打款方式，将直接通过微信账号打款到推广员"
        :closable="false"
        type="info"
        show-icon
      />
      <el-alert
        v-if="detail.pay_type === 'alipay'"
        title="支付宝线下打款"
        description="请通过线下打款方式打款，此处不会进行实际打款"
        :closable="false"
        type="info"
        show-icon
      />
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <el-tag v-if="detail.pay_type === 'wechat'">微信打款</el-tag>
          <el-tag v-if="detail.pay_type === 'alipay'">支付宝线下打款</el-tag>
          <span style="font-size: 20px">{{ detail.account_name }} - {{ detail.mobile }}</span>
        </div>
        <div v-if="detail.pay_type === 'alipay'" class="text item">
          <span>支付宝账号姓名</span><span style="font-size: 26px">{{ detail.account_name }}</span>
        </div>
        <div v-if="detail.pay_type === 'alipay'" class="text item">
          <span>支付宝账号</span><span style="font-size: 26px">{{ detail.pay_account }}</span>
        </div>
        <div class="text item">
          <span>可提现佣金 </span
          ><span style="font-size: 26px; color: red">{{ cashWithdrawalRebate / 100 }}</span> 元
        </div>
        <div class="text item">
          申请提现 <span style="font-size: 26px; color: red">{{ detail.money / 100 }}</span> 元
        </div>
      </el-card>
      <div slot="footer" class="dialog-footer content-center">
        <el-button @click.native="dialog = false">取消操作</el-button>
        <el-button
          v-if="detail.money <= cashWithdrawalRebate"
          type="primary"
          @click="actionProcessCashWithdrawal('argee')"
        >
          打款到推广员
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
      statusList: [
        { name: '提现待处理', value: 'apply' },
        { name: '提现拒绝', value: 'reject' },
        { name: '提现成功', value: 'success' },
        { name: '提现处理中', value: 'process' },
        { name: '提现失败', value: 'failed' }
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
    ...mapGetters(['wheight'])
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
        this.$message({ type: 'error', message: '请输入拒绝提现原因' })
        return
      }

      if (processType == 'reject') {
        var params = { process_type: processType, remarks: this.textarea }
      } else {
        var params = { process_type: processType }
      }
      checkWithdrawal(this.detail.id, params).then(response => {
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
    dialogOpen(detail) {
      this.dialog = true
      this.detail = detail
      this.applyText = '推广员申请提现佣金' + detail.money / 100 + '元'
      withdrawalStatistics({ user_id: detail.user_id }).then(response => {
        this.cashWithdrawalRebate =
          Number(response.data.data.cashWithdrawalRebate) +
          Number(response.data.data.freezeCashWithdrawalRebate)
      })
    },
    dialogPayInfo(detail) {
      this.payDialog = true
      this.detail = detail
      withdrawalPayinfo(detail.id).then(response => {
        this.payList = response.data.data.list
      })
    },
    getList() {
      this.loading = true
      withdrawalApplications(this.params).then(response => {
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
