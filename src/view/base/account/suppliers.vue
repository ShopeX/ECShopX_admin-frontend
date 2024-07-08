<template>
  <div>
    <div class="action-container">
      <el-button type="primary" icon="plus" @click="addSupplier"> 添加供应商 </el-button>
    </div>

    <SpFinder
      ref="finder"
      no-selection
      url="/account/management"
      :fixed-row-action="true"
      :setting="finderSetting"
      :hooks="{
        beforeSearch: beforeSearch
      }"
    />

    <SpDialog
      ref="supplierDialogRef"
      v-model="supplierDialog"
      :title="this.supplierForm.id ? '编辑供应商' : '添加供应商'"
      :form="supplierForm"
      :form-list="supplierFormList"
      @onSubmit="onSupplierFormSubmit"
      @input="onInputChange"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      finderSetting: {
        search: [
          {
            name: '账号',
            key: 'login_name'
          },
          {
            name: '手机号',
            key: 'mobile'
          },
          {
            name: '姓名',
            key: 'username'
          }
        ],
        columns: [
          { name: '账号', key: 'login_name' },
          { name: '手机号', key: 'mobile' },
          { name: '姓名', key: 'username' },
          {
            name: '禁用',
            key: 'is_disable',
            render: (h, { row }) =>
              h('el-switch', {
                props: {
                  'value': row.is_disable,
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
            name: '编辑',
            key: 'edit',
            type: 'button',
            buttonType: 'text',
            action: {
              type: 'link',
              handler: ([row]) => {
                this.supplierForm.id = row.operator_id
                this.supplierForm.mobile = row.mobile
                this.supplierForm.login_name = row.login_name
                this.supplierForm.username = row.username
                this.supplierForm.password = ''
                this.supplierFormList[0].disabled = true
                this.supplierFormList[1].disabled = true
                this.supplierDialog = true
              }
            }
          }
        ]
      },
      supplierDialog: false,
      supplierForm: {
        id: '',
        operator_type: 'supplier',
        mobile: '',
        login_name: '',
        username: '',
        password: ''
      },
      supplierFormList: [
        {
          label: '账号',
          key: 'login_name',
          type: 'input',
          required: true,
          message: '不能为空'
        },
        {
          label: '手机号',
          key: 'mobile',
          type: 'input',
          required: true,
          message: '不能为空'
        },
        {
          label: '姓名',
          key: 'username',
          type: 'input',
          required: true,
          message: '不能为空'
        },
        {
          label: '密码',
          key: 'password',
          type: 'input',
          // required: true,
          message: '不能为空',
          validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error('不能为空'))
            } else if (value.length < 6) {
              callback(new Error('密码长度不能小于6'))
            } else {
              callback()
            }
          }
        }
      ]
    }
  },
  methods: {
    beforeSearch(params) {
      params = {
        ...params,
        operator_type: 'supplier'
      }
      return params
    },
    addSupplier() {
      this.id = ''
      this.supplierDialog = true
      this.supplierFormList[0].disabled = false
      this.supplierFormList[1].disabled = false
      this.supplierForm = {id: '',
        operator_type: 'supplier',
        mobile: '',
        login_name: '',
        username: '',
        password: ''}
    },
    onInputChange () {
      // this.supplierDialog = false
      // this.supplierForm = {}
    },
    async onSupplierFormSubmit() {
      const { id: item_id } = this.supplierForm
      delete this.supplierForm.id
      if (item_id) {
        await this.$api.company.updateAccountInfo(item_id, this.supplierForm)
        this.$message.success('更新成功')
      } else {
        await this.$api.company.createAccount({ ...this.supplierForm })
        this.$message.success('添加成功')
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
