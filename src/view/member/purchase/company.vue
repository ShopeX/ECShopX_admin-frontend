<style lang="scss"></style>
<template>
  <div>
    <div class="action-container">
      <el-button type="primary" icon="iconfont icon-xinzengcaozuo-01" @click="addCompany">
        添加企业
      </el-button>
    </div>
    <SpFilterForm :model="queryForm" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="name" label="企业名称:">
        <el-input v-model="queryForm.name" placeholder="请输入企业名称" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="enterprise_sn" label="企业编码:">
        <el-input v-model="queryForm.enterprise_sn" placeholder="请输入企业编码" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="auth_type" label="验证方式:">
        <el-select v-model="queryForm.auth_type" placeholder="请选择验证方式">
          <el-option
            v-for="(item, index) in validateTypeList"
            :key="index"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </SpFilterFormItem>
    </SpFilterForm>

    <SpFinder
      ref="finder"
      no-selection
      :setting="setting"
      :row-actions-align="'left'"
      :hooks="{
        beforeSearch: beforeSearch
      }"
      url="/enterprise"
    />

    <SpDialog
      ref="addDialogRef"
      v-model="addDialog"
      title="添加分组"
      :modal="false"
      :form="companyForm"
      :form-list="companyFormList"
      @onSubmit="onCompanyFormSubmit"
    />
  </div>
</template>

<script>
import { createSetting } from '@shopex/finder'
import { VALIDATE_TYPES } from './consts'

export default {
  name: '',
  data() {
    const isShow = () => {
      return this.companyForm.auth_type == 'email'
    }

    const validator = (rule, value, callback) => {
      const { auth_type } = this.companyForm
      if (auth_type != 'email' || (auth_type == 'email' && !!value)) {
        callback()
      } else {
        callback('不能为空')
      }
    }

    return {
      queryForm: {
        name: '',
        enterprise_sn: '',
        auth_type: ''
      },
      setting: createSetting({
        actions: [
          {
            name: '编辑',
            key: 'modify',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: async ([row]) => {
                Object.keys(this.companyForm).forEach((key) => (this.companyForm[key] = row[key]))
                this.addDialog = true
              }
            }
          }
        ],
        columns: [
          { name: 'ID', key: 'id' },
          {
            name: '企业名称',
            key: 'name'
          },
          {
            name: '企业编码',
            key: 'enterprise_sn'
          },
          {
            name: '排序',
            key: 'sort',
            showType: 'pop-editable',
            componentProps: {
              icon: 'iconfont icon-edit',
              popperClass: 'sp-finder__popover-edit',
              change: async (v, row) => {
                await this.$api.member.updateCompanySort({
                  enterprise_id: row.id,
                  sort: v
                })
                this.$refs['finder'].refresh()
              }
            }
          },
          {
            name: '登录类型',
            key: 'auth_type',
            formatter: (value, { auth_type }, col) => {
              const authType = VALIDATE_TYPES.find((item) => item.value == auth_type).name
              return authType
            }
          },
          {
            name: '状态',
            key: 'disabled',
            render: (h, { row }) =>
              h('el-switch', {
                props: {
                  'value': row.disabled,
                  'active-value': '0',
                  'inactive-value': '1'
                },
                on: {
                  change: async (e) => {
                    await this.$api.member.updateCompanyStatus({
                      enterprise_id: row.id,
                      disabled: e
                    })
                    row.disabled = e
                  }
                }
              })
          }
        ]
      }),
      validateTypeList: VALIDATE_TYPES,
      addDialog: false,
      companyForm: {
        enterprise_id: '',
        name: '',
        enterprise_sn: '',
        auth_type: '',
        relay_host: '',
        smtp_port: '',
        email_user: '',
        email_password: ''
      },
      companyFormList: [
        {
          label: '企业名称',
          key: 'name',
          type: 'input',
          placeholder: '请输入企业名称',
          required: true,
          message: '不能为空'
        },
        {
          label: '企业编码',
          key: 'enterprise_sn',
          type: 'input',
          placeholder: '请输入企业编码',
          required: true,
          message: '不能为空'
        },
        {
          label: '登录类型',
          key: 'auth_type',
          type: 'select',
          options: [
            { value: 'mobile', title: '手机号' },
            { value: 'account', title: '账号' },
            { value: 'email', title: '邮箱' }
          ],
          validator: (rule, value, callback) => {
            if (value) {
              callback()
            } else {
              callback('不能为空')
            }
          }
        },
        {
          label: '发件邮箱',
          key: 'email_user',
          type: 'input',
          placeholder: '请输入发件邮箱',
          isShow,
          validator
        },
        {
          label: 'SMTP服务器',
          key: 'relay_host',
          type: 'input',
          placeholder: '请输入SMTP服务器',
          isShow,
          validator
        },
        {
          label: '端口',
          key: 'smtp_port',
          type: 'input',
          placeholder: '请输入邮箱端口',
          isShow,
          validator
        },
        {
          label: '密码',
          key: 'email_password',
          type: 'input',
          placeholder: '请输入邮箱密码',
          isShow,
          validator
        }
      ]
    }
  },
  created() {},
  methods: {
    beforeSearch(params) {
      return {
        ...params,
        ...this.queryForm
      }
    },
    onSearch() {
      this.$refs['finder'].refresh()
    },
    addCompany() {
      this.companyForm = this.$options.data().companyForm
      this.addDialog = true
    },
    async onCompanyFormSubmit() {
      const { name, enterprise_sn, auth_type, email_user, relay_host, smtp_port, email_password } =
        this.companyForm
      const params = {
        name,
        enterprise_sn,
        auth_type,
        relay_host,
        smtp_port,
        email_user,
        email_password,
        sort: 0
      }
      await this.$api.member.postPurchaseCompany(params)
      this.addDialog = false
      this.onSearch()
    }
  }
}
</script>
