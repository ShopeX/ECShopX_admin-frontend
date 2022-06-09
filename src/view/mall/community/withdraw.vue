<style lang="scss" scoped>
.sp-filter-form {
  margin-bottom: 16px;
  padding-bottom: 0;
}
.total-info {
  margin-top: 30px;
  .total-value {
    font-size: 28px;
  }
}
</style>
<template>
  <div>
    <div v-if="$route.path.indexOf('detail') === -1">
      <SpFilterForm
        :model="formQuery"
        @onSearch="onSearch"
        @onReset="onSearch"
      >
        <SpFilterFormItem
          prop="status"
          label="提现状态:"
        >
          <el-input
            v-model="formQuery.name"
            placeholder="请选择"
          />
        </SpFilterFormItem>
        <SpFilterFormItem
          prop="mobile"
          label="手机号:"
        >
          <el-input
            v-model="formQuery.mobile"
            placeholder="请输入团长手机号"
          />
        </SpFilterFormItem>
      </SpFilterForm>

      <el-row class="total-info">
        <el-col :span="6">
          <div class="total-label">
            佣金总额（¥）
          </div>
          <div class="total-value">
            100
          </div>
        </el-col>
        <el-col :span="6">
          <div class="total-label">
            已提现总额（¥）
          </div>
          <div class="total-value">
            100
          </div>
        </el-col>
        <el-col :span="6">
          <div class="total-label">
            待处理金额（¥）
          </div>
          <div class="total-value">
            100
          </div>
        </el-col>
        <el-col :span="6">
          <div class="total-label">
            申请提现人数
          </div>
          <div class="total-value">
            100
          </div>
        </el-col>
      </el-row>

      <SpFinder
        ref="finder"
        no-selection
        :setting="setting"
        :hooks="{
          beforeSearch: beforeSearch,
          afterSearch: afterSearch
        }"
        url="/community/cash_withdrawal"
      />

      <SpDialog
        ref="resloveDialogRef"
        v-model="resloveDialog"
        :title="`审批`"
        :form="resloveForm"
        :form-list="resloveFormList"
        @onSubmit="onResloveSubmit"
      />
    </div>
    <router-view />
  </div>
</template>

<script>
import { createSetting } from '@shopex/finder'
import moment from 'moment'
export default {
  name: '',
  data () {
    return {
      formQuery: {
        status: '',
        mobile: ''
      },
      setting: createSetting({
        actions: [
          {
            name: '打款',
            key: 'detail',
            type: 'button',
            buttonType: 'text'
          },
          {
            name: '拒绝',
            key: 'apply',
            type: 'button',
            buttonType: 'text'
          }
        ],
        columns: [
          { name: '申请时间', key: 'created_date' },
          { name: '打款方式', key: 'pay_type' },
          { name: '团长手机号', key: 'mobile' },
          { name: '申请提现金额（¥）', key: 'money' },
          { name: '提现状态', key: 'status' }
          // { name: '打款记录', key: 'chief_mobile' }
        ]
      }),
      resloveDialog: false,
      resloveForm: {
        apply_id: '',
        approve_status: 1,
        refuse_reason: ''
      },
      resloveFormList: [
        {
          label: '审批:',
          key: 'approve_status',
          type: 'radio',
          options: [
            { label: 1, name: '同意' },
            { label: 2, name: '不同意' }
          ],
          onChange: (e) => {
            if (e == 2) {
              this.resloveFormList[1].isShow = true
            } else {
              this.resloveFormList[1].isShow = false
            }
          }
        },
        {
          label: '拒绝原因:',
          key: 'refuse_reason',
          type: 'input',
          placeholder: '请输入拒绝原因',
          isShow: false,
          validator: (rule, value, callback) => {
            if (this.resloveForm.approve_status == 2 && !value) {
              callback(new Error('不能为空'))
            } else {
              callback()
            }
          }
        }
      ]
    }
  },
  created () {},
  methods: {
    onSearch () {
      this.$refs.finder.refresh()
    },
    beforeSearch (params) {
      const formQuery = JSON.parse(JSON.stringify(this.formQuery))
      if (formQuery.approve_status == '-1') {
        delete formQuery.approve_status
      }
      return { ...params, ...formQuery }
    },
    afterSearch (response) {
      debugger
    },
    async onResloveSubmit () {
      const { apply_id, approve_status, refuse_reason } = this.resloveForm
      await this.$api.community.approveChief(apply_id, {
        approve_status,
        refuse_reason
      })
      this.resloveDialog = false
      this.$refs.finder.refresh()
    },
    getApproveStatus (status) {
      if (status == '0') {
        return '未审核'
      } else if (status == '1') {
        return '已审核'
      } else if (status == '2') {
        return '已拒绝'
      }
    }
  }
}
</script>
