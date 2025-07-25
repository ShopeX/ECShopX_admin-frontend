<template>
  <div class="page-body">
      <SpFinder
        ref="finder"
        url="/order/invoice-seller/list"
        fixed-row-action
        row-actions-width="80px"
        :setting="tableSchema"
        :hooks="{
          beforeSearch
        }"
        row-actions-fixed-align="left"
        @select-all="handleSelectionChange"
        @selection-change="handleSelectionChange"
      >
        <template v-slot:tableTop>
          <el-button class="add-btn" type="primary" icon="iconfont icon-xinzengcaozuo-01" @click="handleAdd">添加销方信息</el-button>
        </template>
      </SpFinder>

      <SpDialog
        ref="dialogRef"
        v-model="dialogShow"
        :title="dialogTitle"
        :modal="false"
        label-width="130px"
        class="base-form"
        :form="dialogForm"
        :form-list="dialogRuleForm"
        :confirm-status="confirmStatus"
        @onSubmit="onDialogFormSubmit"
      />
    </SpRouterView>
  </div>
</template>

<script lang="js">

import { tableSchema, formSchema } from './informationSchema'
import moment from 'moment'
import { status } from './constants'
import { generatorParams } from '@/utils/schemaHelper'
import { pageMixin } from '@/mixins'
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
      dialogTitle:'',
      confirmStatus:false,
      itemCategoryList:[]
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
    this.getMainCategory()
  },
  methods: {
    async getMainCategory() {
      //管理分类
      const res = await this.$api.goods.getCategory({ is_main_category: true })
      this.itemCategoryList = res
    },
    refresh() {
      this.$refs.finder.refresh(true)
    },
    beforeSearch(params) {
      const _params = {
        ...params
      }
      return _params
    },
    editRowHandle(row) {
      this.dialogTitle = '编辑销方信息'
      this.editRow = row
      this.dialogShow = true
      this.dialogForm = generatorParams(formSchema(this), row)
    },
    handleSelectionChange(selection) {
      this.selectedRows = selection
    },
    onDialogFormSubmit() {
      this.confirmStatus = true
      if(this.editRow.id){
        api.financial.updateInvoiceSeller(this.editRow.id, this.dialogForm).then((res) => {
          this.$message.success('更新成功')
          this.dialogShow = false
          this.refresh()
        }).finally(()=>{
          this.confirmStatus = false
        })
      }else{
        api.financial.createInvoiceSeller(this.dialogForm).then((res) => {
          this.$message.success('创建成功')
          this.dialogShow = false
          this.refresh()
        }).finally(()=>{
          this.confirmStatus = false
        })
      }
    },
    handleAdd(){
      this.dialogTitle = '添加销方信息'
      this.editRow = {}
      this.dialogShow = true
      this.dialogForm = generatorParams(formSchema(this), {})
    }
  }
}
</script>
<style lang="scss" scoped>
.add-btn{
  margin-bottom: 20px;
}
</style>

