<style lang="scss"></style>
<template>
  <div>
    <SpForm v-model="form" :form-list="formList" @onSubmit="onSaveConfig" />

    <div v-if="form.is_open">
      <div class="action-container">
        <el-button type="primary" @click="addDeliveryman">添加收款账户</el-button>
      </div>

      <SpFinder
        ref="finder"
        url="/espier/offline/backaccount/lists"
        no-selection
        :setting="setting"
        :hooks="{
          beforeSearch: beforeSearch
        }"
      />

      <SpDialog
        ref="addDialogRef"
        v-model="deliveryman"
        :confirm-status="addLoading"
        :title="editTitle"
        :form="addForm"
        :form-list="addFormList"
        @onSubmit="onAddSubmit"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      form: {
        pay_type: 'offline_pay',
        pay_name: '',
        auto_cancel_time: 0,
        is_need_finance_audit: '1',
        pay_tips: '',
        pay_desc: '',
        is_open: false
      },
      formList: [
        {
          label: '支付方式名称',
          key: 'pay_name',
          type: 'input',
          required: true,
          message: '不能为空'
        },
        {
          label: '收款说明',
          key: 'pay_tips',
          type: 'textarea',
          width: '600px'
        },
        {
          label: '付款说明',
          key: 'pay_desc',
          type: 'textarea',
          width: '600px'
        },
        {
          label: '订单自动取消',
          key: 'auto_cancel_time',
          component: ({ key }, value) => {
            return (
              <div>
                未付款订单，将在
                <el-input
                  type='number'
                  min='0'
                  style='width: 100px;margin-left: 10px;'
                  v-model={value[key]}
                />
                （小时）之后取消
              </div>
            )
          },
          required: true,
          message: '不能为空'
        },
        // {
        //   label: '是否需要财务审核',
        //   key: 'is_need_finance_audit',
        //   type: 'radio',
        //   options: [
        //     {
        //       label: 'true',
        //       name: '是'
        //     },
        //     {
        //       label: 'false',
        //       name: '否'
        //     }
        //   ],
        //   required: true,
        //   message: '不能为空'
        // },

        {
          label: '是否开启',
          key: 'is_open',
          type: 'switch'
        }
      ],
      deliveryman: false,
      addLoading: false,
      editTitle: '添加收款账户',
      params: {},
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
          { name: '收款人户名', key: 'bank_account_name' },
          { name: '银行账号', key: 'bank_account_no' },
          { name: '开户银行', key: 'bank_name' },
          { name: '银联号', key: 'china_ums_no' },
          {
            name: '银行LOGO',
            width: 100,
            key: 'pic',
            render: (h, { row }) => {
              return <SpImage src={row.pic} width={60} height={60} />
            }
          },
          { name: '备注', key: 'remark' },
          {
            name: '是否默认',
            width: 100,
            key: 'staff_attribute',
            render: (h, { row }) => {
              return <span>{row.is_default === 'true' ? '是' : '否'}</span>
            }
          }
        ],
        actions: [
          {
            name: '编辑',
            key: 'detail',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: ([row]) => {
                this.editTitle = '编辑收款账户'
                this.deliveryman = true

                this.addForm = {
                  ...row
                }
              }
            }
          },
          {
            name: '删除',
            key: 'apply',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: async ([row]) => {
                await this.$confirm(`确认删除？`, '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消'
                })
                await this.$api.offline.deleteOfflineAccount(row.id)
                this.$refs['finder'].refresh()
              }
            }
          }
        ]
      },

      addForm: {
        bank_account_name: '',
        bank_account_no: '',
        bank_name: '',
        pic: '',
        remark: '',
        china_ums_no: '',
        is_default: null
      },
      addFormList: [
        {
          label: '收款人户名',
          key: 'bank_account_name',
          placeholder: '请输入收款人户名',
          type: 'input',
          required: true,
          message: '收款人户名不能为空'
        },
        {
          label: '银行账号',
          key: 'bank_account_no',
          placeholder: '请输入银行账号',
          type: 'input',
          required: true,
          message: '银行账号不能为空'
        },
        {
          label: '开户银行',
          key: 'bank_name',
          placeholder: '请输入开户银行',
          type: 'input',
          required: true,
          message: '开户银行不能为空'
        },
        {
          label: '银联号',
          key: 'china_ums_no',
          placeholder: '请输入银联号',
          type: 'input',
          required: true,
          message: '银联号不能为空'
        },
        {
          label: '银行LOGO',
          key: 'pic',
          tip: '支持png、jpg、gif、jpeg等格式文件',
          required: true,
          message: '请上传银行LOGO',
          component: ({ key }, value) => {
            return <SpImagePicker v-model={value[key]} />
          }
        },
        {
          label: '备注',
          key: 'remark',
          placeholder: '请输入备注',
          type: 'input'
        },
        {
          label: '是否默认',
          key: 'is_default',
          type: 'radio',
          required: true,
          options: [
            {
              label: 'true',
              name: '是'
            },
            {
              label: 'false',
              name: '否'
            }
          ]
        }
      ]
    }
  },
  mounted() {
    this.getConfig()
  },
  methods: {
    async getConfig() {
      const res = await this.$api.trade.getPaymentSetting({ pay_type: 'offline_pay' })
      this.form.pay_name = res.pay_name
      this.form.auto_cancel_time = res.auto_cancel_time
      this.form.pay_tips = res.pay_tips
      this.form.pay_desc = res.pay_desc
      this.form.is_open = res.is_open == 'true'
      this.form.is_need_finance_audit = res.is_need_finance_audit
    },
    async onSaveConfig() {
      const params = {
        ...this.form,
        is_open: this.form.is_open ? 'true' : 'false'
      }
      await this.$api.trade.setPaymentSetting(params)
      this.$message.success('保存成功')
    },
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
    addDeliveryman() {
      this.deliveryman = true
      this.editTitle = '添加收款账户'
      this.addForm = {
        bank_account_name: '',
        bank_account_no: '',
        bank_name: '',
        china_ums_no: '',
        pic: '',
        remark: '',
        is_default: null
      }
    },
    async onAddSubmit() {
      this.addLoading = true
      let params = {
        ...this.addForm
      }

      if (params.id) {
        await this.$api.offline.updateOfflineAccount(params)
        this.$message.success('编辑成功')
        this.deliveryman = false
        this.onSearch()
      } else {
        await this.$api.offline.createOfflineAccount(this.addForm)
        this.$message.success('保存成功')
        this.deliveryman = false
        this.onSearch()
      }
      this.addLoading = false
    }
  }
}
</script>
