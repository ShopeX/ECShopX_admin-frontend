<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <SpFilterForm :model="searchParams" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem :label="$t('9bd7ffcf.7035c6')" prop="login_name">
        <el-input
          v-model="searchParams.login_name"
          :placeholder="$t('9bd7ffcf.f821a7')"
          clearable
        />
      </SpFilterFormItem>
      <SpFilterFormItem :label="$t('9bd7ffcf.8098e2')" prop="mobile">
        <el-input v-model="searchParams.mobile" :placeholder="$t('9bd7ffcf.6e4f4b')" clearable />
      </SpFilterFormItem>
      <SpFilterFormItem :label="$t('9bd7ffcf.60d045')" prop="username">
        <el-input v-model="searchParams.username" :placeholder="$t('9bd7ffcf.8093e3')" clearable />
      </SpFilterFormItem>
      <SpFilterFormItem :label="$t('9bd7ffcf.9190cc')" prop="supplier_name">
        <el-input
          v-model="searchParams.supplier_name"
          :placeholder="$t('9bd7ffcf.f0c2bb')"
          clearable
        />
      </SpFilterFormItem>
    </SpFilterForm>

    <div class="action-container">
      <el-button type="primary" plain icon="plus" @click="addSupplier">
        {{ $t('9bd7ffcf.4a3c32') }}
      </el-button>
    </div>

    <SpFinder
      ref="finder"
      no-selection
      url="/account/management"
      :fixed-row-action="true"
      :setting="finderSetting"
      row-actions-fixed-align="left"
      :hooks="{
        beforeSearch: beforeSearch
      }"
    />

    <SpDialog
      ref="supplierDialogRef"
      v-model="supplierDialog"
      :title="supplierDialogTitle"
      :form="supplierForm"
      :form-list="supplierFormList"
      @onSubmit="onSupplierFormSubmit"
    />
  </SpPage>
</template>

<script>
export default {
  data() {
    return {
      searchParams: {
        login_name: '',
        mobile: '',
        username: '',
        supplier_name: ''
      },
      supplierDialog: false,
      supplierFormListDisabled: { 1: false, 2: false },
      supplierForm: {
        id: '',
        operator_type: 'supplier',
        mobile: '',
        login_name: '',
        supplier_name: '',
        username: '',
        password: ''
      }
    }
  },
  computed: {
    supplierDialogTitle() {
      return this.supplierForm.id ? this.$t('9bd7ffcf.12928d') : this.$t('9bd7ffcf.4a3c32')
    },
    finderSetting() {
      return {
        columns: [
          { name: this.$t('9bd7ffcf.7035c6'), key: 'login_name' },
          { name: this.$t('9bd7ffcf.9190cc'), key: 'supplier_name' },
          { name: this.$t('9bd7ffcf.8098e2'), key: 'mobile' },
          { name: this.$t('9bd7ffcf.60d045'), key: 'username' },
          {
            name: this.$t('9bd7ffcf.710ad0'),
            key: 'is_disable',
            render: (h, { row }) =>
              h('el-switch', {
                props: {
                  value: row.is_disable,
                  'active-value': true,
                  'inactive-value': false
                },
                on: {
                  change: async (e) => {
                    await this.$api.login.changeOperatorStatus({
                      operator_id: row.operator_id,
                      is_disable: e ? 1 : 0
                    })
                    row.is_disable = e
                  }
                }
              })
          }
        ],
        actions: [
          {
            name: this.$t('9bd7ffcf.95b351'),
            key: 'edit',
            type: 'button',
            buttonType: 'text',
            action: {
              type: 'link',
              handler: ([row]) => {
                this.supplierForm.id = row.operator_id
                this.supplierForm.mobile = row.mobile
                this.supplierForm.login_name = row.login_name
                this.supplierForm.supplier_name = row.supplier_name || ''
                this.supplierForm.username = row.username
                this.supplierForm.password = ''
                this.supplierFormListDisabled[1] = true
                this.supplierFormListDisabled[2] = true
                this.supplierDialog = true
              }
            }
          }
        ]
      }
    },
    supplierFormList() {
      const emptyMsg = this.$t('9bd7ffcf.281bad')
      const d = this.supplierFormListDisabled
      return [
        {
          label: this.$t('9bd7ffcf.7035c6'),
          key: 'login_name',
          type: 'input',
          required: true,
          message: emptyMsg
        },
        {
          label: this.$t('9bd7ffcf.9190cc'),
          key: 'supplier_name',
          type: 'input',
          required: true,
          message: emptyMsg,
          placeholder: this.$t('9bd7ffcf.f0c2bb')
        },
        {
          label: this.$t('9bd7ffcf.8098e2'),
          key: 'mobile',
          type: 'input',
          required: true,
          message: emptyMsg,
          disabled: d[1]
        },
        {
          label: this.$t('9bd7ffcf.60d045'),
          key: 'username',
          type: 'input',
          required: true,
          message: emptyMsg,
          disabled: d[2]
        },
        {
          label: this.$t('9bd7ffcf.a81052'),
          key: 'password',
          type: 'input',
          message: this.$t('9bd7ffcf.c4a882'),
          placeholder: this.$t('9bd7ffcf.c4a882'),
          // tip: this.$t('9bd7ffcf.d7e319'),
          validator: (rule, value, callback) => {
            const requiredMsg = this.$t('9bd7ffcf.c4a882')
            const ruleMsg = this.$t('9bd7ffcf.d7e319')
            const isEdit = !!this.supplierForm.id
            const raw = value == null ? '' : String(value)
            if (!isEdit) {
              if (!raw.trim()) {
                callback(new Error(requiredMsg))
                return
              }
            } else if (!raw.trim()) {
              callback()
              return
            }
            const pwd = raw
            if (pwd.length < 8) {
              callback(new Error(ruleMsg))
              return
            }
            const hasDigit = /\d/.test(pwd)
            const hasLetter = /[a-zA-Z]/.test(pwd)
            const hasSpecial = /[^a-zA-Z0-9]/.test(pwd)
            const categories = [hasDigit, hasLetter, hasSpecial].filter(Boolean).length
            if (categories < 2) {
              callback(new Error(ruleMsg))
              return
            }
            callback()
          }
        }
      ]
    }
  },
  methods: {
    onSearch() {
      this.$refs['finder'].refresh(true)
    },
    beforeSearch(params) {
      params = {
        ...params,
        operator_type: 'supplier',
        ...this.searchParams
      }
      return params
    },
    addSupplier() {
      this.supplierFormListDisabled[1] = false
      this.supplierFormListDisabled[2] = false
      this.supplierForm = {
        id: '',
        operator_type: 'supplier',
        mobile: '',
        login_name: '',
        supplier_name: '',
        username: '',
        password: ''
      }
      this.supplierDialog = true
    },
    async onSupplierFormSubmit() {
      const { id: item_id, ...payload } = this.supplierForm
      if (item_id && (!payload.password || String(payload.password).trim() === '')) {
        delete payload.password
      }
      if (item_id) {
        await this.$api.company.updateAccountInfo(item_id, payload)
        this.$message.success(this.$t('9bd7ffcf.55aa63'))
      } else {
        await this.$api.company.createAccount(payload)
        this.$message.success(this.$t('9bd7ffcf.3fdaea'))
      }
      this.supplierDialog = false
      this.$refs['finder'].refresh(true)
    }
  }
}
</script>
<style scoped lang="scss">
.sp-filter-form {
  margin-bottom: 16px;
}
</style>
