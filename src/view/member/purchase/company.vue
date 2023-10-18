<style lang="scss">
.dg-create-company {
  .sort-input {
    .el-input {
      margin-left: 0;
    }
    .suffix {
      font-size: 13px;
      color: #999;
    }
  }
}
</style>
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
      class="dg-create-company"
      :title="companyForm.id ? '编辑企业' : '添加企业'"
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
          },
          {
            name: '邮件发送测试',
            key: 'modify',
            type: 'button',
            buttonType: 'text',
            visible: (row) => {
              return row.auth_type == 'email'
            },
            action: {
              handler: async ([row]) => {
                await this.$api.member.sendEmployeeEmail({
                  enterprise_id: row.id,
                  email: row.email_user
                })
                this.$message.success('邮件已发送')
              }
            }
          }
        ],
        columns: [
          { name: 'ID', key: 'id' },
          {
            name: '企业Logo',
            key: 'logo',
            render: (h, { row }) => {
              if (row.logo) {
                return h('el-image', {
                  props: {
                    'src': row.logo
                  },
                  class: {
                    'company-logo': true
                  },
                  style: {
                    'width': '64px',
                    'display': 'block'
                  }
                })
              } else {
                return ''
              }
            }
          },
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
              icon: 'el-icon-edit',
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
        id: '',
        logo: '',
        name: '',
        enterprise_sn: '',
        sort: '',
        auth_type: 'mobile',
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
          label: '排序',
          key: 'sort',
          component: () => (
            <SpInput
              v-model={this.companyForm.sort}
              class='sort-input'
              width='100px'
              suffix='选择器中的企业展示顺序，数字越小越靠前'
            />
          )
        },
        {
          label: '登录类型',
          key: 'auth_type',
          type: 'radio',
          options: [
            { label: 'mobile', name: '手机号' },
            { label: 'account', name: '账号' },
            { label: 'email', name: '邮箱' }
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
        },
        {
          label: '企业Logo',
          key: 'logo',
          component: () => <SpImagePicker v-model={this.companyForm.logo} />,
          validator: (rule, value, callback) => {
            if (value) {
              callback()
            } else {
              callback('请选择企业')
            }
          },
          tip: '建议尺寸100*100，支持 png、jpg 格式，不超过2M'
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
      const {
        id,
        logo,
        name,
        enterprise_sn,
        auth_type,
        email_user,
        relay_host,
        smtp_port,
        email_password,
        sort
      } = this.companyForm
      const params = {
        logo,
        name,
        enterprise_sn,
        auth_type,
        relay_host,
        smtp_port,
        email_user,
        email_password,
        sort
      }
      if (id) {
        await this.$api.member.updatePurchaseCompany(id, params)
      } else {
        await this.$api.member.postPurchaseCompany(params)
      }

      this.addDialog = false
      this.onSearch()
    }
  }
}
</script>
