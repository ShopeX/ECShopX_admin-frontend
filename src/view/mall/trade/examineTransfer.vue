<template>
  <div>
    <SpFilterForm :model="params" size="small" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="create_time" label="日期范围:">
        <el-date-picker
          v-model="params.create_time"
          type="daterange"
          value-format="yyyy/MM/dd"
          placeholder="选择日期范围"
        />
      </SpFilterFormItem>
      <SpFilterFormItem prop="mobile" label="单号:">
        <el-input v-model="params.mobile" placeholder="手机号/交易单号" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="mobile" label="订单号:">
        <el-input v-model="params.mobile" placeholder="请输入订单号" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="payment_method" label="状态:">
        <el-select v-model="params.payment_method">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </SpFilterFormItem>
    </SpFilterForm>

    <el-button type="primary" plain>导出</el-button>

    <SpFinder
      ref="finder"
      url="/account/management"
      :fixed-row-action="true"
      no-selection
      :setting="setting"
      :hooks="{
        beforeSearch: beforeSearch
      }"
    />

    <SpDialog
      ref="addDialogRef"
      v-model="deliveryman"
      :title="editTitle"
      :form="addForm"
      :form-list="addFormList"
      @onSubmit="onAddSubmit"
    />

    <!-- <DistributorSelect
        :store-visible="DistributorVisible"
        :is-valid="isValid"
        :get-status="DistributorStatus"
        :rel-data-ids="relDistributors"
        :old-data="oldData"
        :is-single="isSingle"
        :distribution_type="distributionType"
        @chooseStore="DistributorChooseAction"
        @closeStoreDialog="closeDialogAction"
      /> -->
  </div>
</template>
<script>
import DistributorSelect from '@/components/function/distributorSelect'
import { IS_DISTRIBUTOR, IS_MERCHANT } from '@/utils'

export default {
  name: '',
  components: {
    DistributorSelect
  },
  mixins: [],
  props: {},
  data() {
    return {
      deliveryman: false,
      DistributorVisible: false,
      DistributorStatus: false,
      distributionType: '0',
      isSingle: false,
      isValid: true,
      oldData: [],
      relDistributors: [],
      operator_id: '',
      editTitle: '',
      params: {
        operator_type: 'self_delivery_staff',
        username: '',
        mobile: '',
        payment_method: ''
      },
      options: [
        {
          value: 'order',
          label: '按单笔订单'
        },
        {
          value: 'amount',
          label: '按订单金额比例'
        }
      ],
      setting: {
        columns: [
          { name: '收款账户名', key: 'username', width: 110 },
          { name: '收款银行名称', key: 'staff_no', width: 110 },
          { name: '订单支付金额', key: 'mobile', width: 150 },
          {
            name: '订单支付金额',
            width: 110,
            key: 'staff_attribute',
            render: (h, { row }) => {
              return <span>¥{(row.staff_attribute / 100).toFixed(2)}</span>
            }
          },
          { name: '订单编号', key: 'mobile', width: 150 },
          {
            name: '审核意见',
            width: 150,
            key: 'payment_method',
            render: (h, { row }) => {
              return <span>{row.payment_method === 'order' ? '按单笔订单' : '按订单金额比例'}</span>
            }
          },
          {
            name: '审核状态',
            width: 150,
            key: 'payment_method',
            render: (h, { row }) => {
              return <span>{row.payment_method === 'order' ? '按单笔订单' : '按订单金额比例'}</span>
            }
          },
          {
            name: '审批状态',
            width: 150,
            key: 'payment_method',
            render: (h, { row }) => {
              return <span>{row.payment_method === 'order' ? '按单笔订单' : '按订单金额比例'}</span>
            }
          },
          {
            name: '创建时间',
            width: 150,
            key: 'payment_method',
            render: (h, { row }) => {
              return <span>{row.payment_method === 'order' ? '按单笔订单' : '按订单金额比例'}</span>
            }
          },
          {
            name: '审核时间',
            width: 150,
            key: 'payment_method',
            render: (h, { row }) => {
              return <span>{row.payment_method === 'order' ? '按单笔订单' : '按订单金额比例'}</span>
            }
          }
        ],
        actions: [
          {
            name: '转账确认',
            key: 'detail',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: ([row]) => {
                this.operator_id = row.operator_id
                this.relDistributors = []
                this.editTitle = '转账确认审核'
                this.deliveryman = true
                this.addForm = {
                  username: row.username,
                  operator_type: row.operator_type,
                  distributor_name: row.distributor_name,
                  staff_type: row.staff_type,
                  staff_no: row.staff_no,
                  staff_attribute: row.staff_attribute,
                  payment_method: row.payment_method,
                  payment_fee: row.payment_method == 'order' ? Number(row.payment_fee) / 100 : 0.01,
                  payment_fee1: row.payment_method == 'order' ? 1 : Number(row.payment_fee) / 100,
                  mobile: row.mobile,
                  distributor_ids: [],
                  password: ''
                }
                this.relDistributors = row.staff_type == 'distributor' ? row.distributor_ids : []
              }
            }
          },
          {
            name: '操作日志',
            key: 'apply',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: async ([row]) => {}
            }
          }
        ]
      },

      addForm: {
        operator_type: 'self_delivery_staff',
        distributor_name: '',
        staff_type: 'platform',
        staff_no: '',
        staff_attribute: 'part_time',
        payment_method: 'order',
        payment_fee: 0.01,
        payment_fee1: 1,
        mobile: '',
        password: '',
        distributor_ids: []
      },
      addFormList: [
        {
          component: () => (
            <div>
              <el-descriptions title='用户信息'>
                <el-descriptions-item label='订单号'>kooriookami</el-descriptions-item>
                <el-descriptions-item label='订单金额'>18100000000</el-descriptions-item>
                <el-descriptions-item label='订单状态'>苏州市</el-descriptions-item>
                <el-descriptions-item label='运费'>kooriookami</el-descriptions-item>
                <el-descriptions-item label='订单备注'>18100000000</el-descriptions-item>
                <el-descriptions-item label='收货地址'>苏州市</el-descriptions-item>
                <el-descriptions-item label='收货人'>苏州市</el-descriptions-item>
              </el-descriptions>
              <el-descriptions title='收款账户信息' column='2'>
                <el-descriptions-item label='收款账户名'>kooriookami</el-descriptions-item>
                <el-descriptions-item label='收款银行名称'>18100000000</el-descriptions-item>
                <el-descriptions-item label='收款银行账号'>苏州市</el-descriptions-item>
                <el-descriptions-item label='收款银联号'>kooriookami</el-descriptions-item>
              </el-descriptions>
              <el-descriptions title='付款账户信息' column='2'>
                <el-descriptions-item label='付款银行'>kooriookami</el-descriptions-item>
                <el-descriptions-item label='付款卡号'>18100000000</el-descriptions-item>
                <el-descriptions-item label='付款账户名'>苏州市</el-descriptions-item>
                <el-descriptions-item label='订单支付金额'>kooriookami</el-descriptions-item>
                <el-descriptions-item label='凭证图片集合'>18100000000</el-descriptions-item>
                <el-descriptions-item label='支付备注'>苏州市</el-descriptions-item>
              </el-descriptions>
              <div class='modal-header el-descriptions__title'>订单信息</div>
            </div>
          )
        },
        {
          label: '审核',
          key: 'staff_type',
          type: 'radio',
          required: true,
          options: [
            {
              label: 'platform',
              name: '审核通过'
            },
            {
              label: 'distributor',
              name: '审核拒绝'
            }
          ]
        },
        {
          label: '审核备注',
          key: 'username',
          type: 'textarea',
          maxlength: 500,
          required: true,
          message: '审核备注不能为空'
        }
      ]
    }
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    onSearch() {
      this.$refs['finder'].refresh()
    },
    beforeSearch(params) {
      const _params = {
        ...params,
        ...this.params
      }
      return _params
    },
    onAddCancel() {
      this.deliveryman = false
    },

    async onAddSubmit() {
      let res = /^(?=.*[a-zA-Z0-9!@#$%^&*()-_+=])[a-zA-Z0-9!@#$%^&*()-_+=]{6,20}$/.test(
        this.addForm.password
      )
      if (this.operator_id) {
        if (this.addForm.password) {
          if (!res) {
            this.$message({
              type: 'error',
              message: '密码不能是文字并且至少6位'
            })
            return
          }
        }
      } else {
        if (this.addForm.password) {
          if (!res) {
            this.$message({
              type: 'error',
              message: '密码不能是文字并且至少6位'
            })
            return
          }
        } else {
          this.$message({ type: 'error', message: '请输入密码' })
          return
        }
      }

      if (this.addForm.staff_type == 'distributor' && this.relDistributors.length == 0) {
        this.$message({ type: 'error', message: '店铺配送员必须关联店铺' })
        return false
      }

      if (this.relDistributors.length > 0) {
        this.addForm.distributor_ids = []
        this.relDistributors.forEach((distributor) => {
          this.addForm.distributor_ids.push({
            name: distributor.name,
            distributor_id: distributor.distributor_id
          })
        })
      }

      if (this.addForm.staff_type == 'platform') {
        //平台的后端自己给数据
        this.addForm.distributor_ids = []
      }

      let params = {
        ...this.addForm,
        payment_fee:
          this.addForm.payment_method == 'order'
            ? this.addForm.payment_fee
            : this.addForm.payment_fee1
      }

      if (this.operator_id) {
        await this.$api.company.updateAccountInfo(this.operator_id, params)
        this.$message.success('编辑成功')
        this.deliveryman = false
        this.onSearch()
      } else {
        await this.$api.company.createAccount(this.addForm)
        this.$message.success('保存成功')
        this.deliveryman = false
        this.onSearch()
      }
    },
    async addDistributoreAction() {
      const { data } = await this.$picker.shop()
      let arrObj = [...this.relDistributors, ...data]

      for (let i = 0; i < arrObj.length; i++) {
        for (let j = i + 1; j < arrObj.length; j++) {
          if (arrObj[i].distributor_id == arrObj[j].distributor_id) {
            arrObj.splice(j, 1)
            j--
          }
        }
      }
      console.log(arrObj, 'tttt')

      this.relDistributors = arrObj
      this.DistributorStatus = true
      this.DistributorVisible = true
    },
    // DistributorChooseAction(data) {
    //   console.log(data)
    //   this.DistributorVisible = false
    //   if (data === null || data.length <= 0) return
    //   this.relDistributors = data
    //   this.oldData = data
    // },
    // closeDialogAction() {
    //   this.DistributorVisible = false
    //   this.relDistributors = this.oldData
    //   this.DistributorStatus = false
    // },
    DistributoreHandleClose(index) {
      this.DistributorVisible = false
      this.relDistributors.splice(index, 1)
    }
  }
}
</script>
<style lang="scss" scoped>
.flex-box {
  display: flex;
  align-items: center;
  span {
    margin-left: 10px;
  }
}
.modal-header {
  width: 100%;
  background: #f3f3f3;
  padding-left: 16px;
  box-sizing: border-box;
  color: #000;
}
</style>
<style>
.el-descriptions__header {
  width: 100%;
  background: #f3f3f3;
  padding-left: 16px;
  box-sizing: border-box;
}
</style>
