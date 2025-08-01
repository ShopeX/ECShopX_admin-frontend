<template>
  <div>
    <table
      v-if="show"
      width="100%"
      cellspacing="0"
      cellpadding="0"
      class="customTable"
      border-collapse="collapse"
    >
      <tr>
        <th v-for="(header, index) in columns" :key="index">
          <div class="customHeader">
            {{ header.name }}
          </div>
        </th>
        <th v-if="orderInfo.receipt_type === 'logistics'">
          <div class="customHeader">操作</div>
        </th>
      </tr>
      <template v-if="dataSource && dataSource.length">
        <tr v-for="(data, index) in dataSource" :key="index">
          <td v-for="(row, index) in columns" :key="index">
            <div class="customDataSource">
              {{ data[row.field] }}
            </div>
          </td>
          <td v-if="orderInfo.receipt_type === 'logistics'" style="text-align: center">
            <el-button type="text" size="small" @click="openDialog(dataSource[index])">
              编辑
            </el-button>
          </td>
        </tr>
      </template>
      <template v-if="!dataSource || !dataSource.length">
        <tr>
          <td :colspan="columns.length">
            <div class="customEmpty">暂无内容</div>
          </td>
        </tr>
      </template>
    </table>
    <el-dialog
      title="修改物流信息"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      width="30%"
      @closed="closeAddDialog"
    >
      <el-form ref="form" :model="form">
        <el-form-item
          prop="delivery_corp_name"
          label="物流公司"
          :label-width="formLabelWidth"
          :rules="{ required: true, message: '请选择物流公司', trigger: 'blur' }"
        >
          <el-select
            v-model="form.delivery_corp_name"
            placeholder="请选择物流公司"
            style="width: 90%"
          >
            <el-option
              v-for="(data, index) in logisticsList"
              :key="index"
              :label="data.corp_name"
              :value="data.corp_code"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="物流单号"
          prop="delivery_code"
          :label-width="formLabelWidth"
          :rules="{ required: true, message: '请输入物流单号', trigger: 'blur' }"
        >
          <el-input v-model="form.delivery_code" placeholder="请输入物流单号" style="width: 90%" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeAddDialog()"> 取 消 </el-button>
        <el-button type="primary" @click="addFormSumbit('form')"> 确 定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getLogisticsLists } from '@/api/logistics'
import { editLogisticsList } from '@/api/trade'
export default {
  props: ['columns', 'dataSource', 'show', 'orderInfo'],
  data() {
    return {
      logisticsList: [],
      dialogFormVisible: false, // 表单弹框的显示隐藏
      formLabelWidth: '90px',
      form: {
        delivery_corp_name: '',
        delivery_code: ''
      }
    }
  },
  mounted() {
    this.getLogisticsListData()
  },
  methods: {
    openDialog(row) {
      // 弹框打开事件
      this.form = row
      this.form.delivery_corp_name = row.delivery_corp
      this.form.delivery_code = row.delivery_code
      this.dialogFormVisible = true
      this.getLogisticsListData()
    },
    getLogisticsListData() {
      getLogisticsLists({ status: 1 }).then(response => {
        this.logisticsList = response.data.data.list
      })
    },
    closeAddDialog() {
      // 弹框关闭事件
      this.resetForm('form')
    },
    addFormSumbit(formName) {
      // 表单提交
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            delivery_corp: this.form.delivery_corp_name,
            delivery_code: this.form.delivery_code
          }
          editLogisticsList(this.form.orders_delivery_id, params).then(res => {
            this.$emit('update')
            this.resetForm(formName)
          })
        }
      })
    },
    resetForm(formName) {
      this.dialogFormVisible = false
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.customTable {
  border: 1px solid #ebeef5;
  border-collapse: collapse;

  .customHeader {
    padding: 5px;
    text-align: center;
    font-size: 14px;
    color: #666;
    font-weight: 400;
  }

  .customDataSource {
    padding: 5px;
    text-align: center;
    font-size: 14px;
    color: #666;
    font-weight: 400;
  }

  .customEmpty {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    padding: 20px 0;
  }

  tr {
    &:not(:nth-last-child(1)) {
      border-bottom: 1px solid #ebeef5;
    }
  }
}
</style>
