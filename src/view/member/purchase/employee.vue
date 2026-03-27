<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss"></style>
<template>
  <SpPage>
    <SpRouterView>
      <SpFilterForm :model="queryForm" @onSearch="onSearch" @onReset="onSearch">
        <SpFilterFormItem prop="mobile" :label="$t('5a5739e5.ce2bf3')">
          <el-input v-model="queryForm.mobile" :placeholder="$t('5a5739e5.ff95a4')" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="account" :label="$t('5a5739e5.9c3929')">
          <el-input v-model="queryForm.account" :placeholder="$t('5a5739e5.f821a7')" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="email" :label="$t('5a5739e5.cc8ae2')">
          <el-input v-model="queryForm.email" :placeholder="$t('5a5739e5.dbf6d0')" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="member_mobile" :label="$t('5a5739e5.468c2b')">
          <el-input v-model="queryForm.member_mobile" :placeholder="$t('5a5739e5.c0e45d')" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="enterprise_id" :label="$t('5a5739e5.3c0a34')" size="max">
          <el-select
            v-model="queryForm.enterprise_id"
            v-scroll="() => pagesQuery.nextPage()"
            multiple
            :placeholder="$t('5a5739e5.708c9d')"
          >
            <el-option
              v-for="(item, index) in enterpriseList"
              :key="`enterprise-item__${index}`"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem prop="distributor_id" :label="$t('5a5739e5.16f2bc')">
          <SpSelectShop
            v-model="queryForm.distributor_id"
            clearable
            :placeholder="$t('5a5739e5.708c9d')"
          />
        </SpFilterFormItem>
      </SpFilterForm>

      <div class="action-container">
        <el-button type="primary" icon="iconfont icon-xinzengcaozuo-01" @click="addEmployee">
          {{ $t('5a5739e5.2ef46a') }}
        </el-button>
        <el-button type="primary" icon="iconfont icon-daorucaozuo-01" @click="handleImportEmployee">
          {{ $t('5a5739e5.4580b9') }}
        </el-button>
        <el-button type="primary" plain @click="handleExport">
          {{ $t('5a5739e5.55405e') }}
        </el-button>
      </div>

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
        :title="employeeForm.id ? $t('5a5739e5.53f6b9') : $t('5a5739e5.2ef46a')"
        :modal="false"
        :form="employeeForm"
        :form-list="employeeFormList"
        :confirm-status="addDialogLoading"
        @onSubmit="onEmployeeFormSubmit"
      />
    </SpRouterView>
  </SpPage>
</template>

<script>
import { createSetting } from '@shopex-ui/finder'
import Pages from '@/utils/pages'
import { VALIDATE_TYPES } from './consts'
import { i18n } from '@/i18n'

export default {
  name: '',
  data() {
    const t = (key) => i18n.t(key)
    const self = this
    return {
      queryForm: {
        mobile: '',
        account: '',
        email: '',
        member_mobile: '',
        distributor_id: '',
        enterprise_id: []
      },
      enterpriseList: [],
      setting: createSetting({
        actions: [
          {
            name: () => t('5a5739e5.95b351'),
            key: 'edit',
            type: 'button',
            buttonType: 'text',
            visible: (row) => {
              //平台：来源店铺是非平台则隐藏
              return !(self.IS_ADMIN() && row.distributor_id != '0')
            },
            action: {
              handler: async ([row]) => {
                Object.keys(self.employeeForm).forEach((key) => (self.employeeForm[key] = row[key]))
                self.addDialog = true
              }
            }
          },
          {
            name: () => t('5a5739e5.2f4aad'),
            key: 'delete',
            type: 'button',
            buttonType: 'text',
            //平台：来源店铺是非平台则隐藏
            visible: (row) => {
              return !(self.IS_ADMIN() && row.distributor_id != '0')
            },
            action: {
              handler: async ([row]) => {
                await self.$confirm(t('5a5739e5.f29cc1'), t('5a5739e5.02d981'), {
                  confirmButtonText: t('5a5739e5.38cf16'),
                  cancelButtonText: t('5a5739e5.625fb2')
                })
                await self.$api.member.deleteEmployee(row.id)
                self.$refs['finder'].refresh()
              }
            }
          }
        ],
        columns: [
          { name: t('5a5739e5.8098e2'), key: 'mobile' },
          { name: t('5a5739e5.60d045'), key: 'name' },
          {
            name: t('5a5739e5.78cbe8'),
            key: 'auth_type',
            formatter: (value, { auth_type }, col) => {
              const authType = self.validateTypeList.find((item) => item.value == auth_type)
              return authType ? authType.name : ''
            }
          },
          { name: t('5a5739e5.7035c6'), key: 'account' },
          { name: t('5a5739e5.a81052'), key: 'auth_code' },
          { name: t('5a5739e5.3bc5e6'), key: 'email' },
          { name: t('5a5739e5.53cc55'), key: 'distributor_name' },
          { name: t('5a5739e5.5a83cb'), key: 'enterprise_id' },
          { name: t('5a5739e5.f47e27'), key: 'enterprise_name' },
          { name: t('5a5739e5.705f0a'), key: 'enterprise_sn' },
          { name: t('5a5739e5.6a52ee'), key: 'member_mobile' }
        ]
      }),
      addDialog: false,
      companyList: [],
      addDialogLoading: false,
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
          label: t('5a5739e5.0067d7'),
          key: 'enterprise_id',
          component: () => (
            <el-select
              v-model={self.employeeForm.enterprise_id}
              v-scroll={() => self.pages.nextPage()}
              filterable
            >
              {self.companyList.map((item, index) => (
                <el-option key={`company-item__${index}`} label={item.name} value={item.id} />
              ))}
            </el-select>
          ),
          validator: (rule, value, callback) => {
            if (value) callback()
            else callback(t('5a5739e5.321fa5'))
          }
        },
        {
          label: t('5a5739e5.60d045'),
          key: 'name',
          type: 'input',
          required: true,
          message: t('5a5739e5.281bad')
        },
        {
          label: t('5a5739e5.8098e2'),
          key: 'mobile',
          type: 'input',
          isShow: () => self.authType == 'mobile' || self.authType == 'qr_code',
          validator: (rule, value, callback) => {
            if (self.authType == 'mobile' || self.authType == 'qr_code') {
              if (value) callback()
              else callback(t('5a5739e5.281bad'))
            } else callback()
          }
        },
        {
          label: t('5a5739e5.7035c6'),
          key: 'account',
          type: 'input',
          isShow: () => self.authType == 'account',
          validator: (rule, value, callback) => {
            if (self.authType == 'account') {
              if (value) callback()
              else callback(t('5a5739e5.281bad'))
            } else callback()
          }
        },
        {
          label: t('5a5739e5.a81052'),
          key: 'auth_code',
          type: 'input',
          isShow: () => self.authType == 'account',
          validator: (rule, value, callback) => {
            if (self.authType == 'account') {
              if (value) callback()
              else callback(t('5a5739e5.281bad'))
            } else callback()
          }
        },
        {
          label: t('5a5739e5.cc8ae2'),
          key: 'email',
          type: 'input',
          isShow: () => self.authType == 'email',
          validator: (rule, value, callback) => {
            if (self.authType == 'email') {
              if (value) callback()
              else callback(t('5a5739e5.281bad'))
            } else callback()
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
    },
    validateTypeList() {
      const keys = {
        '': '5a5739e5.a8b0c2',
        mobile: '5a5739e5.8098e2',
        account: '5a5739e5.bc1f2d',
        email: '5a5739e5.3bc5e6',
        qr_code: '5a5739e5.22b03c'
      }
      return VALIDATE_TYPES.map((item) => ({
        ...item,
        name: this.$t(keys[item.value] || '5a5739e5.a8b0c2')
      }))
    }
  },
  created() {
    this.pages = new Pages({
      fetch: this.getCompanyList
    }).nextPage()

    this.pagesQuery = new Pages({
      fetch: this.getEnterpriseList
    }).nextPage()

    if (this.$route.query.company_id) {
      this.queryForm.enterprise_id = [this.$route.query.company_id]
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
    async handleExport() {
      let params = {
        page: 1,
        pageSize: 20,
        ...this.queryForm
      }
      let response = await this.$api.member.exportEmployees(params)
      if (response.status) {
        this.$message({
          type: 'success',
          message: this.$t('5a5739e5.3e1ddd')
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
          message: this.$t('5a5739e5.89ae53')
        })
        return
      }
    },
    handleImportEmployee() {
      this.$router.push({ path: this.matchRoutePath('import') })
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
        is_employee_check_enabled: 'true'
      }
      if (this.IS_ADMIN()) {
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
