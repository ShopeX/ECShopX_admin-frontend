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
      <SpFilterFormItem prop="keywords" label="订单号:">
        <el-input v-model="formData.keywords" placeholder="请输入订单号" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="item_bn" label="开票申请流水:">
        <el-input v-model="formData.item_bn" placeholder="请输入开票申请流水" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="barcode" label="发票抬头:">
        <el-input v-model="formData.barcode" placeholder="请输入发票抬头" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="supplier_name" label="开票来源:">
        <el-input v-model="formData.supplier_name" placeholder="请输入开票来源" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="mobile" label="手机号:">
        <el-input v-model="formData.mobile" placeholder="请输入手机号" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="approve_status" label="发票类型:">
        <el-select v-model="formData.approve_status" clearable placeholder="请选择">
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.title"
            size="mini"
            :value="item.value"
          />
        </el-select>
      </SpFilterFormItem>
      <SpFilterFormItem prop="queryTime" label="创建时间:" size="max">
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
import { status } from './constants'
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
      confirmRuleForm: confirmSchema(this),
      showLogInfoDrawer: false,
      logListData: [],
      logTableSchema: logTableSchema(this),
      innerTableSchema: innerTableSchema(this),
      defaultTime: ['00:00:00', '23:59:59'],
      formData:{

      },
      typeList:[],
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
        start_time: params?.start_time?.map((el) => moment(el).unix()),
        end_time: params?.end_time?.map((el) => moment(el).unix())
      }
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
      this.confirmForm = generatorParams(confirmSchema(this), row)
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
      api.order.resendInvoiceEmail({
        invoice_id: this.editRow.id,
        confirm_email: this.confirmForm.email,
      }).then((res) => {
        this.$message.success('发送成功')
        this.confirmDialogShow = false
        this.refresh()
      })
    },
    onRemarkFormSubmit() {
      api.order.updateInvoiceRemark(this.editRow.id, this.remarkForm).then((res) => {
        this.$message.success('更新成功')
        this.remarkDialogShow = false
        this.refresh()
      })
    },
    onDialogFormSubmit() {
      api.order.updateInvoice(this.editRow.id, this.dialogForm).then((res) => {
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
