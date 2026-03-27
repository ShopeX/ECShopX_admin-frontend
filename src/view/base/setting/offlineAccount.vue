<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <div class="action-container">
      <el-button type="primary" @click="addDeliveryman">{{ $t('1037e661.89beb5') }}</el-button>
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
      :title="$t(editTitle)"
      :form="addForm"
      :form-list="addFormList"
      @onSubmit="onAddSubmit"
    />
  </div>
</template>
<script>
export default {
  name: '',
  mixins: [],
  props: {},
  data() {
    return {
      deliveryman: false,
      addLoading: false,
      editTitle: '1037e661.89beb5',
      params: {},
      options: [
        {
          value: 'order',
          label: '1037e661.ed776f'
        },
        {
          value: 'amount',
          label: '1037e661.705abf'
        }
      ],
      setting: {
        columns: [
          { name: '1037e661.84fc41', key: 'bank_account_name' },
          { name: '1037e661.954218', key: 'bank_account_no' },
          { name: '1037e661.cc5ca0', key: 'bank_name' },
          { name: '1037e661.4402fa', key: 'china_ums_no' },
          {
            name: '1037e661.d1c357',
            width: 100,
            key: 'staff_attribute',
            render: (h, { row }) => {
              return (
                <span>
                  {row.is_default === 'true'
                    ? this.$t('1037e661.0a60ac')
                    : this.$t('1037e661.c9744f')}
                </span>
              )
            }
          }
        ],
        actions: [
          {
            name: '1037e661.95b351',
            key: 'detail',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: ([row]) => {
                this.editTitle = '1037e661.27e12d'
                this.deliveryman = true

                this.addForm = {
                  ...row
                }
              }
            }
          },
          {
            name: '1037e661.2f4aad',
            key: 'apply',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: async ([row]) => {
                await this.$confirm(this.$t('1037e661.b28efa'), this.$t('1037e661.02d981'), {
                  confirmButtonText: this.$t('1037e661.38cf16'),
                  cancelButtonText: this.$t('1037e661.625fb2')
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
        china_ums_no: '',
        is_default: null
      },
      addFormList: [
        {
          label: '1037e661.84fc41',
          key: 'bank_account_name',
          placeholder: '1037e661.2eb695',
          type: 'input',
          required: true,
          message: '1037e661.a4a208'
        },
        {
          label: '1037e661.954218',
          key: 'bank_account_no',
          placeholder: '1037e661.f9aa7d',
          type: 'input',
          required: true,
          message: '1037e661.d81e7c'
        },
        {
          label: '1037e661.cc5ca0',
          key: 'bank_name',
          placeholder: '1037e661.46222a',
          type: 'input',
          required: true,
          message: '1037e661.0630e3'
        },
        {
          label: '1037e661.4402fa',
          key: 'china_ums_no',
          placeholder: '1037e661.e44953',
          type: 'input',
          required: true,
          message: '1037e661.d414ff'
        },
        {
          label: '1037e661.d1c357',
          key: 'is_default',
          type: 'radio',
          required: true,
          options: [
            {
              label: 'true',
              name: '1037e661.0a60ac'
            },
            {
              label: 'false',
              name: '1037e661.c9744f'
            }
          ]
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
    addDeliveryman() {
      this.deliveryman = true
      this.editTitle = '1037e661.89beb5'
      this.addForm = {
        bank_account_name: '',
        bank_account_no: '',
        bank_name: '',
        china_ums_no: '',
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
        this.$message.success(this.$t('1037e661.3bb47b'))
        this.deliveryman = false
        this.onSearch()
      } else {
        await this.$api.offline.createOfflineAccount(this.addForm)
        this.$message.success(this.$t('1037e661.3b1083'))
        this.deliveryman = false
        this.onSearch()
      }
      this.addLoading = false
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
</style>
