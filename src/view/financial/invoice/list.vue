<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <SpRouterView>
      <SpFilterForm :model="formData" @onSearch="onSearch" @onReset="onSearch">
        <SpFilterFormItem prop="distributor_id" :label="$t('364a6013.16f2bc')">
          <SpSelectShop
            ref="selectShop"
            v-model="formData.distributor_id"
            clearable
            :placeholder="$t('364a6013.708c9d')"
          />
        </SpFilterFormItem>
        <SpFilterFormItem prop="order_id" :label="$t('364a6013.070dce')">
          <el-input v-model="formData.order_id" :placeholder="$t('364a6013.e9e836')" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="invoice_apply_bn" :label="$t('364a6013.c6c698')">
          <el-input v-model="formData.invoice_apply_bn" :placeholder="$t('364a6013.242a19')" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="company_title" :label="$t('364a6013.5f4907')">
          <el-input v-model="formData.company_title" :placeholder="$t('364a6013.05274f')" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="invoice_source" :label="$t('364a6013.85c0f0')">
          <el-select
            v-model="formData.invoice_source"
            clearable
            :placeholder="$t('364a6013.708c9d')"
          >
            <el-option
              v-for="item in invoiceSourceList"
              :key="item.value"
              :label="$t(item.title)"
              size="mini"
              :value="item.value"
            />
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem prop="mobile" :label="$t('364a6013.44f683')">
          <el-input v-model="formData.mobile" :placeholder="$t('364a6013.89ca80')" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="email" :label="$t('364a6013.93335a')">
          <el-input v-model="formData.email" :placeholder="$t('364a6013.189880')" />
        </SpFilterFormItem>

        <SpFilterFormItem prop="invoice_type_code" :label="$t('364a6013.33e2c8')">
          <el-select
            v-model="formData.invoice_type_code"
            clearable
            :placeholder="$t('364a6013.708c9d')"
          >
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="$t(item.title)"
              size="mini"
              :value="item.value"
            />
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem prop="cycleTime" :label="$t('364a6013.e2a03f')" size="max">
          <el-date-picker
            v-model="formData.cycleTime"
            clearable
            type="datetimerange"
            format="yyyy-MM-dd HH:mm:ss"
            :range-separator="$t('364a6013.981cbe')"
            :start-placeholder="$t('364a6013.592c59')"
            :end-placeholder="$t('364a6013.f78277')"
            prefix-icon="null"
            :default-time="defaultTime"
          />
        </SpFilterFormItem>
      </SpFilterForm>
      <SpFinder
        ref="finder"
        url="/order/invoice/list"
        fixed-row-action
        row-actions-width="200px"
        :setting="tableSchema"
        :hooks="{
          beforeSearch
        }"
        row-actions-fixed-align="left"
        @select-all="handleSelectionChange"
        @selection-change="handleSelectionChange"
      >
        <template #tableTop>
          <!-- 选择tab -->
          <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane
              v-for="item in status"
              :key="item.value"
              :label="$t(item.label)"
              :name="item.value"
            />
          </el-tabs>
        </template>
      </SpFinder>

      <!-- 选择关联页面 -->
      <SpDialog
        ref="dialogRef"
        v-model="dialogShow"
        :title="$t('364a6013.bca2db')"
        :modal="false"
        class="base-form"
        :form="dialogForm"
        :form-list="dialogRuleForm"
        @onSubmit="onDialogFormSubmit"
      />

      <SpDialog
        ref="dialogRef1"
        v-model="remarkDialogShow"
        :title="$t('364a6013.2432b5')"
        :modal="false"
        class="base-form"
        :confirm-status="confirmStatus"
        :form="remarkForm"
        :form-list="remarkRuleForm"
        @onSubmit="onRemarkFormSubmit"
      />

      <!-- 请确认重发邮箱 -->
      <SpDialog
        ref="dialogRef2"
        v-model="confirmDialogShow"
        :title="$t('364a6013.6a91d7')"
        :confirm-btn-text="$t('364a6013.bd134b')"
        :modal="false"
        class="base-form"
        :confirm-status="confirmStatus"
        :form="confirmForm"
        :form-list="confirmRuleForm"
        @onSubmit="onConfirmFormSubmit"
      />

      <SpDrawer
        v-model="showLogInfoDrawer"
        class="config-drawer"
        :title="$t('364a6013.35cdc7')"
        :footer="false"
        :width="1000"
      >
        <SpFinder
          ref="finder"
          fixed-row-action
          row-actions-width="200px"
          no-selection
          :data="logListData"
          :setting="logTableSchema"
          row-actions-fixed-align="left"
          :show-pager="false"
        />
      </SpDrawer>
    </SpRouterView>
  </SpPage>
</template>

<script lang="js">
import { tableSchema, formSchema, remarkSchema, confirmSchema, logTableSchema, innerTableSchema } from './listSchema'
import moment from 'moment'
import { status, invoice_source_arr } from './constants'
import { generatorParams } from '@/utils/schemaHelper'
import { pageMixin } from '@/mixins'
import { VERSION_STANDARD } from '@/utils'
import { ORDER_CATEGORY } from '@/consts'
import api from '@/api'

export default {
  mixins: [pageMixin],
  data() {
    return {
      activeName: 'all',
      status,
      selectedRows: [],
      editRow: null,
      areas: [],
      dialogForm: generatorParams(formSchema(this)),
      dialogShow: false,
      remarkDialogShow: false,
      remarkForm: generatorParams(remarkSchema(this)),
      remarkRuleForm: remarkSchema(this),
      confirmDialogShow: false,
      confirmForm: generatorParams(confirmSchema(this)),
      confirmStatus:false,
      confirmRuleForm: confirmSchema(this),
      showLogInfoDrawer: false,
      logListData: [],
      logTableSchema: logTableSchema(this),
      innerTableSchema: innerTableSchema(this),
      defaultTime: ['00:00:00', '23:59:59'],
      formData:{
        distributor_id:'',
        order_id:'',
        invoice_apply_bn:'',
        company_title:'',
        invoice_source:'',
        mobile:'',
        email:'',
        invoice_type_code:'',
        cycleTime:[]
      },
      invoiceSourceList:invoice_source_arr,
      orderCategory: this.VERSION_STANDARD()
        ? ORDER_CATEGORY.filter((item) => item.value != 'distributor')
        : ORDER_CATEGORY,
    }
  },
  computed: {
    tableSchema() {
      return tableSchema(this)
    },
    dialogRuleForm() {
      return formSchema(this)
    },
    typeList() {
      return [
        { value: '01', title: this.$t('364a6013.515a32') },
        { value: '02', title: this.$t('364a6013.8a487a') }
      ]
    }
  },
  mounted() {
    this.getAreas()
  },
  methods: {
    onSearch() {
      this.refresh()
    },
    getAreas() {
      api.regionauth.getRegionauth().then((res) => {
        this.areas = res?.list?.map((el) => ({
          value: el.regionauth_id,
          label: el.regionauth_name,
          title: el.regionauth_name,
        }))
      })
    },
    refresh() {
      this.$refs.finder.refresh(true)
    },
    onCopySuccess() {
      this.$notify.success({
        message: this.$t('364a6013.20a495'),
        showClose: true
      })
    },
    beforeSearch(params) {
      const _params = {
        ...params,
        ...this.formData
      }
      if(_params.cycleTime.length){
        _params.start_time =  moment(_params.cycleTime[0]).unix()
        _params.end_time =  moment(_params.cycleTime[1]).unix()
      }
      delete _params.cycleTime

      if (this.activeName === 'all') {
        delete _params.invoice_status
      } else {
        _params.invoice_status = this.activeName
      }
      return _params
    },
    editRowHandle(row) {
      this.editRow = row
      this.dialogShow = true
      this.dialogForm = generatorParams(formSchema(this), row)
    },
    handleClick() {
      this.refresh()
    },
    getOrderCategoryName(order_holder) {
      return this.orderCategory.find((item) => item.value == order_holder)?.title ?? ''
    },
    // 备注
    remarkHandle(row) {
      this.editRow = row
      this.remarkDialogShow = true
      this.remarkForm = generatorParams(remarkSchema(this), row)
    },
    // 重发邮箱
    pushEmailHandle(row) {
      this.editRow = row
      this.confirmDialogShow = true
      this.confirmForm = generatorParams(confirmSchema(this), {})
    },
    // 日志
    showLogHandle(row) {
      this.$router.push({path:`${this.$route.path}/process?id=${row.id}`})
      // this.editRow = row
      // this.showLogInfoDrawer = true
      // api.order.getInvoiceLog({ invoice_id: row.id }).then((res) => {
      //   this.logListData = res.list?.map((el) => {
      //     const _params = {
      //       ...el,
      //       operator_content: null
      //     }
      //     try {
      //       _params.operator_content = JSON.parse(el.operator_content)
      //     } catch (error) {
      //       console.log(error)
      //     }
      //     return _params
      //   })
      //   console.log(this.logListData)
      // })
    },
    handleSelectionChange(selection) {
      this.selectedRows = selection
    },
    onConfirmFormSubmit() {
      this.confirmStatus = true
      api.financial.resendInvoiceEmail({
        id: this.editRow.id,
        confirm_email: this.confirmForm.email,
      }).then((res) => {
        this.$message.success(this.$t('364a6013.9db9a7'))
        this.confirmDialogShow = false
        this.refresh()
      }).finally(()=>{
        this.confirmStatus = false
      })
    },
    onRemarkFormSubmit() {
      this.confirmStatus = true
      api.financial.updateInvoiceRemark(this.editRow.id, this.remarkForm).then((res) => {
        this.$message.success(this.$t('364a6013.55aa63'))
        this.remarkDialogShow = false
        this.refresh()
      }).finally(()=>{
        this.confirmStatus = false
      })
    },
    onDialogFormSubmit() {
      api.financial.updateInvoice(this.editRow.id, this.dialogForm).then((res) => {
        this.$message.success(this.$t('364a6013.55aa63'))
        this.dialogShow = false
        this.refresh()
      })
    },
    reInvoiceHandle(row) {
      this.$confirm(this.$t('364a6013.97adcd'), this.$t('364a6013.02d981'), {
          confirmButtonText: this.$t('364a6013.38cf16'),
          cancelButtonText: this.$t('364a6013.625fb2'),
          type: 'warning'
        }).then(async () => {
          await this.$api.trade.retryFailedInvoice({  invoice_id: row.id })
          this.$message.success(this.$t('364a6013.e76fce'))
          this.refresh()
        })
    }
  }
}
</script>

<style lang="scss">
.sp-filter-form-item.label .form-item__label {
  white-space: nowrap;
}
</style>
