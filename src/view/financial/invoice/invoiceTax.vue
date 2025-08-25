<template>
  <div class="page-body">
      <SpFinder
        ref="finder"
        url="/order/category-taxrate/list"
        fixed-row-action
        row-actions-width="100px"
        :setting="tableSchema"
        :hooks="{
          beforeSearch
        }"
        row-actions-fixed-align="left"
        @select-all="handleSelectionChange"
        @selection-change="handleSelectionChange"
      >
        <template v-slot:tableTop>
          <el-button class="add-btn" type="primary" icon="iconfont icon-xinzengcaozuo-01" @click="handleAdd">添加新配置</el-button>
        </template>
      </SpFinder>

      <!-- 选择关联页面 -->
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

import { tableSchema, formSchema } from './invoiceTaxSchema'
import moment from 'moment'
import { status } from './constants'
import { generatorParams } from '@/utils/schemaHelper'
import { pageMixin } from '@/mixins'
import api from '@/api'
import { cloneDeep } from 'lodash'

export default {
  mixins: [pageMixin],
  data() {
    return {
      activeName: 'all',
      status,
      selectedRows: [],
      editRow: null,
      areas: [],
      dialogForm: {
        sales_party_id:'',
        tax_rate_type:'ALL',
        category_ids:[],
        invoice_tax_rate:''
      },
      dialogShow: false,
      dialogTitle:'',
      confirmStatus:false,
      itemCategoryList:[],
      invoiceSellerList:[]
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
    this.getInvoiceSellerList()
    this.getMainCategory()
  },
  methods: {
    
    async getInvoiceSellerList() {
      const {list} = await this.$api.financial.getInvoiceSellerList()
      console.log(list)
      this.invoiceSellerList = list.map(item=>({value:item.id,title:item.seller_company_name}))
    },
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
    handleTreeCheck(checkedNode, checkedKeys){
      this.$nextTick(()=>{
        console.log(checkedNode, checkedKeys,this.dialogForm.category_ids)
        this.dialogForm.category_ids = checkedKeys.checkedKeys
      })
    },
    getCategoryPaths(categories = [], targetIds = []) {
        // 存储每个目标ID的路径
        const paths = {};
        
        // 递归查找路径
        function findPath(node, currentPath) {
            const newPath = [...currentPath, node.category_id];
            
            // 如果当前节点是目标ID，记录路径
            if (targetIds.includes(node.category_id)) {
                paths[node.category_id] = newPath;
            }
            
            // 继续遍历子节点
            if (node.children && node.children.length > 0) {
                node.children.forEach(child => findPath(child, newPath));
            }
        }
        
        // 从根节点开始遍历
        categories.forEach(root => findPath(root, []));
        // 构建结果数组，按目标ID的顺序排列
        return targetIds.map(id => paths[id] || []);
    },
    getCategoryPathsName(categories = [], targetIds = []) {
        // 存储每个目标ID的路径
        const paths = {};
        
        // 递归查找路径
        function findPath(node, currentPath) {
            // 将当前节点的ID和名称添加到路径中
            const newPath = [...currentPath, {
                id: node.category_id,
                name: node.category_name
            }];
            
            // 如果当前节点是目标ID，记录路径
            if (targetIds.includes(node.category_id)) {
                paths[node.category_id] = newPath;
            }
            
            // 继续遍历子节点
            if (node.children && node.children.length > 0) {
                node.children.forEach(child => findPath(child, newPath));
            }
        }
        
        // 从根节点开始遍历
        categories.forEach(root => findPath(root, []));
        // 构建结果数组，按目标ID的顺序排列
        return targetIds?.map(id => paths[id] || [])?.map(item=>item?.map(item2=>item2.name).join(' > '))
    },
    editRowHandle(row) {
      console.log(row)
      this.dialogTitle = '编辑管理分类税率配置'
      this.editRow = row
      this.dialogShow = true
      const {id,sales_party_id,tax_rate_type,category_ids,invoice_tax_rate} = row
      const _category_ids = (category_ids && this.getCategoryPaths(this.itemCategoryList,JSON.parse(category_ids))) || [];
      this.dialogForm = {id, sales_party_id, tax_rate_type,category_ids:_category_ids,invoice_tax_rate}
    },
    handleSelectionChange(selection) {
      this.selectedRows = selection
    },
    onDialogFormSubmit() {
      
      const form = cloneDeep(this.dialogForm)
      if(form.tax_rate_type == "SPECIFIED"){
        form.category_ids = form.category_ids.map(item=>item[item.length - 1])
      }
      console.log(form)
      this.confirmStatus = true
      if(this.editRow.id){
        api.financial.updateInvoiceTax(this.editRow.id, form).then((res) => {
          this.$message.success('更新成功')
          this.dialogShow = false
          this.refresh()
        }).finally(()=>{
          this.confirmStatus = false
        })
      }else{
        api.financial.createInvoiceTax(form).then((res) => {
          this.$message.success('创建成功')
          this.dialogShow = false
          this.refresh()
        }).finally(()=>{
          this.confirmStatus = false
        })
      }
     
    },
    handleAdd(){
      this.dialogTitle = '新增管理分类税率配置'
      this.dialogShow = true
      this.editRow = {}
      this.dialogForm = {
        sales_party_id:'',
        tax_rate_type:'ALL',
        category_ids:[],
        invoice_tax_rate:''
      }
    },
    deleteRowHandle(row) {
      this.$confirm('确定删除该配置吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await api.trade.deleteCategoryTaxRate({ id: row.id })
          this.$message.success('删除成功')
          this.refresh()
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.add-btn{
  margin-bottom: 20px;
}

</style>
<style lang="scss" >

.invoice-cascader {
  .el-input {
    max-width: 320px !important;
  }
  .el-input__inner {
    width: 320px !important;
  }
}
</style>

