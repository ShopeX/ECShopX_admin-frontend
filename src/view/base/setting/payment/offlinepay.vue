<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss"></style>
<template>
  <div>
    <SpForm v-model="form" :form-list="formList" @onSubmit="onSaveConfig" />

    <div v-if="form.is_open">
      <div class="action-container">
        <el-button type="primary" @click="addDeliveryman">{{ $t('6c1afa3c.89beb5') }}</el-button>
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
          label: this.$t('6c1afa3c.9593e2'),
          key: 'pay_name',
          type: 'input',
          required: true,
          message: this.$t('6c1afa3c.281bad')
        },
        {
          label: this.$t('6c1afa3c.be8f34'),
          key: 'pay_tips',
          type: 'textarea',
          width: '600px'
        },
        {
          label: this.$t('6c1afa3c.c4b7b7'),
          key: 'pay_desc',
          type: 'textarea',
          width: '600px'
        },
        {
          label: this.$t('6c1afa3c.756fb3'),
          key: 'auto_cancel_time',
          component: ({ key }, value) => {
            return (
              <div>
                {this.$t('6c1afa3c.1f092f')}
                <el-input
                  type='number'
                  min='0'
                  style='width: 100px;margin-left: 10px;'
                  v-model={value[key]}
                />
                {this.$t('6c1afa3c.baa02a')}
              </div>
            )
          },
          required: true,
          message: this.$t('6c1afa3c.281bad')
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
          label: this.$t('6c1afa3c.780afe'),
          key: 'is_open',
          type: 'switch'
        }
      ],
      deliveryman: false,
      addLoading: false,
      editTitle: this.$t ? this.$t('6c1afa3c.89beb5') : '添加收款账户',
      params: {},
      options: [
        {
          value: 'order',
          label: this.$t ? this.$t('6c1afa3c.ed776f') : '按单笔订单'
        },
        {
          value: 'amount',
          label: this.$t ? this.$t('6c1afa3c.705abf') : '按订单金额比例'
        }
      ],
      setting: {
        columns: [
          { name: this.$t('6c1afa3c.84fc41'), key: 'bank_account_name' },
          { name: this.$t('6c1afa3c.954218'), key: 'bank_account_no' },
          { name: this.$t('6c1afa3c.cc5ca0'), key: 'bank_name' },
          { name: this.$t('6c1afa3c.4402fa'), key: 'china_ums_no' },
          {
            name: this.$t('6c1afa3c.e277b7'),
            width: 100,
            key: 'pic',
            render: (h, { row }) => {
              return <SpImage src={row.pic} width={60} height={60} />
            }
          },
          { name: this.$t('6c1afa3c.2432b5'), key: 'remark' },
          {
            name: this.$t('6c1afa3c.d1c357'),
            width: 100,
            key: 'staff_attribute',
            render: (h, { row }) => {
              return (
                <span>
                  {row.is_default === 'true'
                    ? this.$t('6c1afa3c.0a60ac')
                    : this.$t('6c1afa3c.c9744f')}
                </span>
              )
            }
          }
        ],
        actions: [
          {
            name: this.$t('6c1afa3c.95b351'),
            key: 'detail',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: ([row]) => {
                this.editTitle = this.$t('6c1afa3c.27e12d')
                this.deliveryman = true

                this.addForm = {
                  ...row
                }
              }
            }
          },
          {
            name: this.$t('6c1afa3c.2f4aad'),
            key: 'apply',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: async ([row]) => {
                await this.$confirm(this.$t('6c1afa3c.b28efa'), this.$t('6c1afa3c.02d981'), {
                  confirmButtonText: this.$t('6c1afa3c.38cf16'),
                  cancelButtonText: this.$t('6c1afa3c.625fb2')
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
          label: this.$t('6c1afa3c.84fc41'),
          key: 'bank_account_name',
          placeholder: this.$t('6c1afa3c.2eb695'),
          type: 'input',
          required: true,
          message: this.$t('6c1afa3c.a4a208')
        },
        {
          label: this.$t('6c1afa3c.954218'),
          key: 'bank_account_no',
          placeholder: this.$t('6c1afa3c.f9aa7d'),
          type: 'input',
          required: true,
          message: this.$t('6c1afa3c.d81e7c')
        },
        {
          label: this.$t('6c1afa3c.cc5ca0'),
          key: 'bank_name',
          placeholder: this.$t('6c1afa3c.46222a'),
          type: 'input',
          required: true,
          message: this.$t('6c1afa3c.0630e3')
        },
        {
          label: this.$t('6c1afa3c.4402fa'),
          key: 'china_ums_no',
          placeholder: this.$t('6c1afa3c.e44953'),
          type: 'input',
          required: true,
          message: this.$t('6c1afa3c.d414ff')
        },
        {
          label: this.$t('6c1afa3c.e277b7'),
          key: 'pic',
          tip: this.$t('6c1afa3c.9068dc'),
          required: true,
          message: this.$t('6c1afa3c.b1498f'),
          component: ({ key }, value) => {
            return <SpImagePicker v-model={value[key]} />
          }
        },
        {
          label: this.$t('6c1afa3c.2432b5'),
          key: 'remark',
          placeholder: this.$t('6c1afa3c.3cac63'),
          type: 'input'
        },
        {
          label: this.$t('6c1afa3c.d1c357'),
          key: 'is_default',
          type: 'radio',
          required: true,
          options: [
            {
              label: 'true',
              name: this.$t('6c1afa3c.0a60ac')
            },
            {
              label: 'false',
              name: this.$t('6c1afa3c.c9744f')
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
      this.form.is_open = res.is_open == 'true' || res.is_open == true ? true : false
      this.form.is_need_finance_audit = res.is_need_finance_audit
    },
    async onSaveConfig() {
      const params = {
        ...this.form,
        is_open: this.form.is_open ? 'true' : 'false'
      }
      await this.$api.trade.setPaymentSetting(params)
      this.$message.success(this.$t('6c1afa3c.3b1083'))
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
      this.editTitle = this.$t('6c1afa3c.89beb5')
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
        this.$message.success(this.$t('6c1afa3c.3bb47b'))
        this.deliveryman = false
        this.onSearch()
      } else {
        await this.$api.offline.createOfflineAccount(this.addForm)
        this.$message.success(this.$t('6c1afa3c.3b1083'))
        this.deliveryman = false
        this.onSearch()
      }
      this.addLoading = false
    }
  }
}
</script>
