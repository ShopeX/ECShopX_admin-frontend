<style lang="scss"></style>
<template>
  <SpRouterView>
    <div class="action-container">
      <el-button type="primary" icon="iconfont icon-xinzengcaozuo-01" @click="addEmployee">
        添加员工
      </el-button>
      <el-button type="primary" icon="iconfont icon-daorucaozuo-01" @click="handleImportEmployee">
        导入员工
      </el-button>
      <el-button type="primary" plain @click="handleExport">
        导出
      </el-button>
    </div>

    <SpFilterForm :model="queryForm" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="mobile" label="手机号:">
        <el-input v-model="queryForm.mobile" placeholder="请输入手机号码" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="account" label="账号:">
        <el-input v-model="queryForm.account" placeholder="请输入账号" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="email" label="邮箱:">
        <el-input v-model="queryForm.email" placeholder="请输入邮箱" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="member_mobile" label="会员手机号:">
        <el-input v-model="queryForm.member_mobile" placeholder="请输入会员手机号" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="enterprise_id" label="企业:" size="max">
        <el-select
          v-model="queryForm.enterprise_id"
          v-scroll="() => pagesQuery.nextPage()"
          multiple
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in enterpriseList"
            :key="`enterprise-item__${index}`"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </SpFilterFormItem>
      <SpFilterFormItem
        prop="distributor_id"
        label="来源店铺:"
      >
        <SpSelectShop v-model="queryForm.distributor_id" clearable placeholder="请选择" />
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
      url="/employees"
    />

    <SpDialog
      ref="addDialogRef"
      v-model="addDialog"
      :title="employeeForm.id ? '编辑员工' : '添加员工'"
      :modal="false"
      :form="employeeForm"
      :form-list="employeeFormList"
      :confirmStatus="addDialogLoading"
      @onSubmit="onEmployeeFormSubmit"
    />
  </SpRouterView>
</template>

<script>
import { createSetting } from '@shopex/finder'
import Pages from '@/utils/pages'
import { VALIDATE_TYPES } from './consts'

export default {
  name: '',
  data() {
    return {
      queryForm: {
        mobile: '',
        account: '',
        email: '',
        member_mobile: '',
        distributor_id:'',
        enterprise_id: []
      },
      enterpriseList: [],
      setting: createSetting({
        actions: [
          {
            name: '编辑',
            key: 'edit',
            type: 'button',
            buttonType: 'text',
            visible: (row) => {
              //平台：来源店铺是非平台则隐藏
              return !(this.IS_ADMIN() && row.distributor_id)
            },
            action: {
              handler: async ([row]) => {
                Object.keys(this.employeeForm).forEach((key) => (this.employeeForm[key] = row[key]))
                this.addDialog = true
              }
            }
          },
          {
            name: '删除',
            key: 'delete',
            type: 'button',
            buttonType: 'text',
             //平台：来源店铺是非平台则隐藏
            visible: (row) => {
              return !(this.IS_ADMIN() && row.distributor_id)
            },
            action: {
              handler: async ([row]) => {
                await this.$confirm(`确认是否删除？`, '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消'
                })
                await this.$api.member.deleteEmployee(row.id)
                this.$refs['finder'].refresh()
              }
            }
          }
        ],
        columns: [
          { name: '手机号', key: 'mobile' },
          {
            name: '姓名',
            key: 'name'
          },
          {
            name: '登录类型',
            key: 'auth_type',
            formatter: (value, { auth_type }, col) => {
              const authType = VALIDATE_TYPES.find((item) => item.value == auth_type)?.name
              return authType
            }
          },
          {
            name: '账号',
            key: 'account'
          },
          {
            name: '密码',
            key: 'auth_code'
          },
          {
            name: '邮箱',
            key: 'email'
          },
          {
            name: '来源店铺',
            key: 'distributor_name'
          },
          {
            name: '企业ID',
            key: 'enterprise_id'
          },
          {
            name: '企业名称',
            key: 'enterprise_name'
          },
          {
            name: '企业编码',
            key: 'enterprise_sn'
          },
          {
            name: '会员手机号',
            key: 'member_mobile'
          }
        ]
      }),
      addDialog: false,
      companyList: [],
      addDialogLoading:false,
      employeeForm: {
        id: '',
        enterprise_id: '',
        name: '',
        mobile: '',
        account: '',
        auth_code: '',
        email: ''
      },
      employeeFormList: [
        {
          label: '选择企业',
          key: 'enterprise_id',
          component: () => (
            <el-select
              v-model={this.employeeForm.enterprise_id}
              v-scroll={() => this.pages.nextPage()}
              filterable
            >
              {this.companyList.map((item, index) => (
                <el-option key={`company-item__${index}`} label={item.name} value={item.id} />
              ))}
            </el-select>
          ),
          validator: (rule, value, callback) => {
            if (value) {
              callback()
            } else {
              callback('请选择企业')
            }
          }
        },
        {
          label: '姓名',
          key: 'name',
          type: 'input',
          required: true,
          message: '不能为空'
        },
        {
          label: '手机号',
          key: 'mobile',
          type: 'input',
          isShow: () => {
            return this.authType == 'mobile' || this.authType == 'qr_code'
          },
          validator: (rule, value, callback) => {
            if (this.authType == 'mobile' || this.authType == 'qr_code') {
              if (value) {
                callback()
              } else {
                callback('不能为空')
              }
            } else {
              callback()
            }
          }
        },
        {
          label: '账号',
          key: 'account',
          type: 'input',
          isShow: () => {
            return this.authType == 'account'
          },
          validator: (rule, value, callback) => {
            if (this.authType == 'account') {
              if (value) {
                callback()
              } else {
                callback('不能为空')
              }
            } else {
              callback()
            }
          }
        },
        {
          label: '密码',
          key: 'auth_code',
          type: 'input',
          isShow: () => {
            return this.authType == 'account'
          },
          validator: (rule, value, callback) => {
            if (this.authType == 'account') {
              if (value) {
                callback()
              } else {
                callback('不能为空')
              }
            } else {
              callback()
            }
          }
        },
        {
          label: '邮箱',
          key: 'email',
          type: 'input',
          isShow: () => {
            return this.authType == 'email'
          },
          validator: (rule, value, callback) => {
            if (this.authType == 'email') {
              if (value) {
                callback()
              } else {
                callback('不能为空')
              }
            } else {
              callback()
            }
          }
        }
      ]
    }
  },
  computed: {
    authType() {
      const { auth_type } =
        this.companyList.find((item) => item.id == this.employeeForm.enterprise_id) || {}
      return auth_type
    }
  },
  created() {
    this.pages = new Pages({
      fetch: this.getCompanyList
    }).nextPage()

    this.pagesQuery = new Pages({
      fetch: this.getEnterpriseList
    }).nextPage()

    if (this.$route.query.company_id){
      this.queryForm.enterprise_id = [Number(this.$route.query.company_id)]
    }

  },
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
    async handleExport(){
      let params = {
        page: 1,
        pageSize: 20,
        ...this.queryForm
      }
      let response = await this.$api.member.exportEmployees(params)
      if (response.status) {
        this.$message({
          type: 'success',
          message: '已加入执行队列，请在设置-导出列表中下载'
        })
        this.$export_open('employee_purchase_employees')
        return
      } else if (response.url) {
        this.downloadUrl = response.url
        this.downloadName = response.filename
        this.downloadView = true
      } else {
        this.$message({
          type: 'error',
          message: '无内容可导出 或 执行失败，请检查重试'
        })
        return
      }
    },
    handleImportEmployee() {
      this.$router.push({ path: this.matchHidePage('import') })

    },
    addEmployee() {
      this.employeeForm = this.$options.data().employeeForm
      this.addDialog = true
    },
    async onEmployeeFormSubmit() {
      let params = JSON.parse(JSON.stringify(this.employeeForm))
      this.addDialogLoading = true
      try {
        if (params.id) {
          await this.$api.member.updateEmployee(params.id, params)
        } else {
          // delete params.id
          await this.$api.member.addEmployee(params)
        }
        this.addDialog = false
        this.addDialogLoading = false
        this.$refs['finder'].refresh()
      } catch (error) {
        this.addDialogLoading = false
      }

    },
    async getCompanyList({ page, pageSize }) {
      const params = {
        page,
        pageSize,
        is_employee_check_enabled:'true'
      }
      if(this.IS_ADMIN()){
        params.distributor_id = 0
      }
      const { list, total_count } = await this.$api.member.getPurchaseCompanyList(params)
      this.pages.setTotal(total_count)
      this.companyList = this.companyList.concat(list)
    },
    async getEnterpriseList({ page, pageSize }) {
      const { list, total_count } = await this.$api.member.getPurchaseCompanyList({
        page,
        pageSize
      })
      this.pagesQuery.setTotal(total_count)
      this.enterpriseList = this.enterpriseList.concat(list)
    }
  }
}
</script>
