<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-button
          type="primary"
          icon="plus"
          @click="addCurrency"
        >
          添加货币
        </el-button>
      </el-col>
      <el-col :span="12">
        <el-input
          v-model="params.currency"
          placeholder="货币名称，例子：RMB"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="dataSearch"
          />
        </el-input>
      </el-col>
    </el-row>
    <el-table
      v-loading="loading"
      :data="currencyList"
      :height="wheight - 160"
    >
      <el-table-column
        prop="title"
        label="货币名称(全名)"
      />
      <el-table-column
        prop="currency"
        label="货币名称(缩写)"
      />
      <el-table-column
        prop="symbol"
        label="货币符号"
      />
      <el-table-column
        prop="rate"
        label="货币汇率"
      />
      <el-table-column
        prop="is_default"
        label="是否为默认"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.is_default"
            :disabled="scope.row.is_default ? true : false"
            @change="setDefault(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="editAction(scope.$index, scope.row)"
          >
            编辑
          </el-button>
          <el-button
            v-if="!scope.row.is_default"
            size="mini"
            @click="deleteAction(scope.$index, scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div
      v-if="total_count > params.pageSize"
      class="content-center content-top-padded"
    >
      <el-pagination
        layout="prev, pager, next"
        :current-page.sync="params.page"
        :total="total_count"
        :page-size="params.pageSize"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 添加、编辑标识-开始 -->
    <el-dialog
      :title="editTitle"
      :visible.sync="editVisible"
      :before-close="handleCancel"
    >
      <template>
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          class="demo-ruleForm"
          label-width="220px"
        >
          <el-form-item
            label="货币名称（中文全名）"
            prop="title"
          >
            <el-col
              :span="10"
            >
              <el-input
                v-model="form.title"
                required
                placeholder="货币名称（中文全名），例子：中国人民币"
              />
            </el-col>
          </el-form-item>
          <el-form-item
            label="货币名称（英文缩写）"
            prop="currency"
          >
            <el-col
              :span="10"
            >
              <el-input
                v-model="form.currency"
                required
                placeholder="货币名称（英文缩写），例子：RMB"
              />
            </el-col>
          </el-form-item>
          <el-form-item
            label="货币符号"
            prop="symbol"
          >
            <el-col
              :span="10"
            >
              <el-input
                v-model="form.symbol"
                required
                placeholder="￥"
              />
            </el-col>
          </el-form-item>
          <el-form-item
            label="货币汇率"
            prop="rate"
          >
            <el-col
              :span="10"
            >
              <el-input
                v-model="form.rate"
                required
                placeholder="1"
              />
            </el-col>
            <el-col
              v-if="form.rate && form.title"
              :span="10"
            >
              1 {{ form.title }}({{ form.symbol }}) = {{ form.rate }} 人民币(￥)
            </el-col>
            <el-col
              v-else-if="form.rate && form.currency"
              :span="10"
            >
              1 {{ form.currency }} = {{ form.rate }} RMB
            </el-col>
          </el-form-item>

          <el-form-item
            label="适用端"
            prop="rate"
          >
            <el-col
              :span="10"
            >
              <el-radio
                v-model="form.use_platform"
                label="normal"
                value="normal"
              >
                实体类商城
              </el-radio>
            </el-col>
          </el-form-item>
        </el-form>
      </template>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click.native="handleCancel">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="submitAction"
        >
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import {
  createCurrencyInfo,
  getCurrencytLists,
  updateCurrencyInfo,
  deleteCurrencyInfo,
  setDefaultCurrency
} from '../../../api/company'
export default {
  data () {
    return {
      dynamicShopName: [],
      dynamicStoreName: [],
      inputVisible: false,
      inputStoreVisible: false,
      inputValue: '',
      editVisible: false,
      editTitle: '',
      form: {
        symbol: '',
        currency: '',
        title: '',
        rate: '',
        is_default: false,
        use_platform: 'normal'
      },
      activeName: 'first',
      currencyList: [],
      detailData: {},
      loading: false,
      total_count: 0,
      params: {
        page: 1,
        pageSize: 20,
        currency: ''
      },
      id: 0,
      rules: {
        title: [{ required: true, message: '请输入', trigger: 'blur' }],
        currency: [{ required: true, message: '请输入', trigger: 'blur' }],
        symbol: [{ required: true, message: '请输入', trigger: 'blur' }],
        rate: [{ required: true, message: '请输入', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted () {
    this.getCurrencytListData()
  },
  methods: {
    handleCancel () {
      this.editVisible = false
      this.form.symbol = ''
      this.form.currency = ''
      this.form.title = ''
      this.form.rate = ''
      this.form.is_default = false
      this.id = ''
    },
    handleCurrentChange (page_num) {
      this.params.page = page_num
      this.getCurrencytListData()
    },
    addCurrency () {
      // 添加物料弹框
      this.editTitle = '添加货币信息'
      this.editVisible = true
      this.form.symbol = ''
      this.form.currency = ''
      this.form.title = ''
      this.form.rate = ''
      this.form.is_default = false
      this.id = ''
    },
    editAction (index, row) {
      // 编辑物料弹框
      this.editTitle = '编辑货币信息'
      this.editVisible = true
      this.form.currency = row.currency
      this.form.title = row.title
      this.form.symbol = row.symbol
      this.form.rate = row.rate
      this.form.is_default = row.is_default
      this.form.use_platform = 'normal'
      this.id = row.id
    },
    submitAction () {
      // 提交物料
      if (!this.form.currency || !this.form.title || !this.form.symbol || !this.form.rate) {
        this.$message({
          type: 'error',
          message: '表单数据必填'
        })
        return
      }

      let reg = /^\d+(\.\d{1,4})?$/
      if (!reg.test(this.form.rate)) {
        this.$message({
          type: 'error',
          message: '货币汇率最多4位小数'
        })
        return
      }
      if (this.id) {
        updateCurrencyInfo(this.id, this.form).then((response) => {
          this.detailData = response.data.data
          this.editVisible = false
          this.getCurrencytListData()
          this.handleCancel()
        })
      } else {
        createCurrencyInfo(this.form).then((response) => {
          this.detailData = response.data.data
          this.editVisible = false
          this.getCurrencytListData()
          this.handleCancel()
        })
      }
    },
    dataSearch () {
      this.params.page = 1
      this.getCurrencytListData()
    },
    getCurrencytListData () {
      this.loading = true
      getCurrencytLists(this.params).then((response) => {
        this.currencyList = response.data.data.list
        this.total_count = response.data.data.total_count
        this.loading = false
      })
    },
    deleteAction (index, row) {
      this.$confirm('此操作将删除该账号, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteCurrencyInfo(row.id).then((response) => {
            this.currencyList.splice(index, 1)
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 5 * 1000
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    setDefault (row) {
      setDefaultCurrency(row.id).then((response) => {
        this.getCurrencytListData()
      })
    }
  }
}
</script>
<style scoped lang="scss">
.el-tag + .el-tag {
  margin-left: 5px;
}
.new-tag {
  height: 40px;
  line-height: 40px;
  padding-top: 0;
  padding-bottom: 0;
}
.button-new-tag {
  height: 40px;
  line-height: 40px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  height: 40px;
  line-height: 40px;
  width: 138px;
  vertical-align: bottom;
}

.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.grid-content {
  border-radius: 4px;
  min-height: 10px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
