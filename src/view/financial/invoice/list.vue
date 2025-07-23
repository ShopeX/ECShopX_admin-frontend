<template>
  <div class="page-body">
    <SpRouterView>
      <SpFilterForm :model="formData" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="distributor_id" label="来源店铺:">
        <SpSelectShop
          ref="selectShop"
          v-model="formData.distributor_id"
          clearable
          placeholder="请选择"
        />
      </SpFilterFormItem>
      <SpFilterFormItem prop="order_id" label="订单号:">
        <el-input v-model="formData.order_id" placeholder="请输入订单号" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="invoice_apply_bn" label="开票申请流水:">
        <el-input v-model="formData.invoice_apply_bn" placeholder="请输入开票申请流水" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="company_title" label="发票抬头:">
        <el-input v-model="formData.company_title" placeholder="请输入发票抬头" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="invoice_source" label="开票来源:">
        <el-select v-model="formData.invoice_source" clearable placeholder="请选择">
          <el-option
            v-for="item in invoiceSourceList"
            :key="item.value"
            :label="item.title"
            size="mini"
            :value="item.value"
          />
        </el-select>
      </SpFilterFormItem>
      <SpFilterFormItem prop="mobile" label="开票申请手机号:">
        <el-input v-model="formData.mobile" placeholder="请输入开票申请手机号" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="email" label="开票申请邮箱:">
        <el-input v-model="formData.email" placeholder="请输入开票申请邮箱" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="invoice_type_code" label="发票类型:">
        <el-select v-model="formData.invoice_type_code" clearable placeholder="请选择">
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.title"
            size="mini"
            :value="item.value"
          />
        </el-select>
      </SpFilterFormItem>
      <SpFilterFormItem prop="cycleTime" label="创建时间:" size="max">
        <el-date-picker
          v-model="formData.cycleTime"
          clearable
          type="datetimerange"
          format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
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
        <template v-slot:tableTop>
          <!-- 选择tab -->
          <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane
              v-for="item in status"
              :key="item.value"
              :label="item.label"
              :name="item.value"
            />
          </el-tabs>
        </template>
      </SpFinder>

      <!-- 选择关联页面 -->
      <SpDialog
        ref="dialogRef"
        v-model="dialogShow"
        title="编辑发票"
        :modal="false"
        class="base-form"
        :form="dialogForm"
        :form-list="dialogRuleForm"
        @onSubmit="onDialogFormSubmit"
      />

      <SpDialog
        ref="dialogRef1"
        v-model="remarkDialogShow"
        title="备注"
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
        title="请确认重发邮箱"
        confirm-btn-text="邮箱正确并发送"
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
        :title="'发票日志'"
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
  </div>
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
      typeList:[{value:'01',title:'专用发票'},{value:'02',title:'电子普通发票'}],
      orderCategory: this.VERSION_STANDARD
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
        message: '复制成功',
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
        this.$message.success('发送成功')
        this.confirmDialogShow = false
        this.refresh()
      }).finally(()=>{
        this.confirmStatus = false
      })
    },
    onRemarkFormSubmit() {
      this.confirmStatus = true
      api.financial.updateInvoiceRemark(this.editRow.id, this.remarkForm).then((res) => {
        this.$message.success('更新成功')
        this.remarkDialogShow = false
        this.refresh()
      }).finally(()=>{
        this.confirmStatus = false
      })
    },
    onDialogFormSubmit() {
      api.financial.updateInvoice(this.editRow.id, this.dialogForm).then((res) => {
        this.$message.success('更新成功')
        this.dialogShow = false
        this.refresh()
      })
    }
  }
}
</script>

<style lang="scss">
.sp-filter-form-item.label .form-item__label{
  white-space: nowrap;
}
</style>
