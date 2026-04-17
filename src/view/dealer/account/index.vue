<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-button type="primary" icon="plus" @click="addLabels">
          {{ $t('08833112.f0677c') }}
        </el-button>
      </el-col>
      <el-col :span="12">
        <el-input :placeholder="$t('08833112.8098e2')" v-model="mobile">
          <el-button slot="append" icon="el-icon-search" @click="handleSearch" />
        </el-input>
      </el-col>
    </el-row>
    <el-table :data="accountsList" v-loading="loading">
      <el-table-column prop="mobile" :label="$t('08833112.99359a')">
        <template slot-scope="scope">
          {{ scope.row.mobile
          }}<el-tag
            type="warning"
            v-if="scope.row.is_dealer_main == 1"
            size="small"
            style="margin-left: 10px"
          >
            {{ $t('08833112.302ff0') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="contact" :label="$t('08833112.60d045')" />
      <el-table-column :label="$t('08833112.2b6bc0')">
        <template slot-scope="scope">
          <el-button size="mini" @click="editAction(scope.$index, scope.row)">
            {{ $t('08833112.95b351') }}
          </el-button>
          <!--<el-button size="mini" @click="deleteAccountAction(scope.$index, scope.row)" v-if="scope.row.is_dealer_main == 0">删除</el-button
          >-->
        </template>
      </el-table-column>
    </el-table>
    <div v-if="total_count > params.pageSize" class="content-center content-top-padded">
      <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :current-page.sync="params.page"
        :total="total_count"
        :page-size="params.pageSize"
      />
    </div>
    <!-- 添加、编辑标识-开始 -->
    <el-dialog
      :title="editTitle"
      :visible.sync="editVisible"
      :before-close="handleCancel"
      :close-on-click-modal="false"
      width="700px"
    >
      <template>
        <el-form ref="form" :rules="rules" :model="form" class="demo-ruleForm" label-width="120px">
          <el-form-item :label="$t('08833112.bb2cdf')" prop="mobile">
            <el-col :span="12" style="margin-right: 10px">
              <el-input v-model="form.mobile" v-if="!isEdit" :maxlength="11" />
              <el-input v-model="edit_mobile" :disabled="true" v-else />
            </el-col>
            <p>{{ $t('08833112.23b6de') }}</p>
          </el-form-item>
          <el-form-item :label="$t('08833112.60d045')" prop="contact">
            <el-col :span="12">
              <el-input v-model="form.contact" :disabled="isEdit" />
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('08833112.2646b8')" prop="password">
            <el-col :span="12" style="margin-right: 10px">
              <el-input v-model="form.password" />
            </el-col>
            <p>{{ $t('08833112.c62756') }}</p>
          </el-form-item>
        </el-form>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="handleCancel">{{ $t('08833112.625fb2') }}</el-button>
        <el-button type="primary" @click="handleSumbit">{{ $t('08833112.be5fbb') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { isMobile } from '@/utils/validate'
import { addDealer } from '@/api/marketing'
import { editDealer, getDealerAccountList, deleteDealer, getOpeationId } from '@/api/adapay/dealer'

export default {
  data() {
    return {
      isEdit: false,
      editVisible: false,
      editTitle: '',
      form: {
        mobile: '',
        contact: '',
        password: ''
      },
      mobile: '',
      accountsList: [],
      loading: false,
      total_count: 0,
      params: {
        page: 1,
        pageSize: 20
      },
      operator_id: 0,
      dealer_parent_id: 0,
      rules: {
        contact: [{ required: true, message: this.$t('08833112.8093e3'), trigger: 'blur' }],
        mobile: [{ required: true, trigger: 'blur', validator: this.validateMobile }],
        password: [{ required: true, trigger: 'blur', validator: this.validateNumber }]
      }
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  methods: {
    handleCancel() {
      this.editVisible = false
      this.form.mobile = ''
      this.form.contact = ''
      this.form.password = ''
      this.edit_mobile = ''
      this.operator_id = ''
    },
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getAccountListData()
    },
    addLabels() {
      // 添加物料弹框
      this.handleCancel()
      this.editTitle = this.$t('08833112.f1333f')
      this.editVisible = true
      this.isEdit = false
    },
    editAction(index, row) {
      // 编辑物料弹框
      this.handleCancel()
      this.editTitle = this.$t('08833112.67b76a')
      this.editVisible = true
      this.isEdit = true
      this.form.mobile = row.mobile
      this.form.contact = row.contact
      this.operator_id = row.operator_id
      this.edit_mobile = row.mobile
      this.form.password = ''
    },
    validateMobile(rule, value, callback) {
      console.log(value)
      if (value.length <= 0 && !isMobile(value)) {
        callback(new Error(this.$t('08833112.e56e22')))
      } else {
        callback()
      }
    },
    validateNumber(rule, value, callback) {
      if (value.length < 6 || value.length > 16) {
        callback(new Error(this.$t('08833112.360bd6')))
      } else {
        callback()
      }
    },
    onGetsOpeationId() {
      getOpeationId().then((res) => {
        const {
          data: { data }
        } = res
        this.dealer_parent_id = data.dealer_parent_id
      })
    },
    handleSumbit() {
      this.$refs['form'].validate(async (vaild) => {
        if (vaild) {
          if (this.operator_id) {
            editDealer(this.operator_id, { password: this.form.password }).then((response) => {
              console.log(response)
              this.getAccountListData()
              this.handleCancel()
            })
          } else {
            addDealer({
              ...this.form,
              operator_type: 'dealer',
              is_dealer_main: '0',
              dealer_parent_id: this.dealer_parent_id
            }).then((response) => {
              this.$message.success(this.$t('08833112.3b1083'))
              this.getAccountListData()
              this.handleCancel()
            })
          }
        }
      })
    },
    handleSearch() {
      this.params.mobile = this.mobile
      this.params.page = 1
      this.getAccountListData()
    },
    getAccountListData() {
      this.loading = true
      getDealerAccountList({ params: JSON.stringify(this.params) }).then((response) => {
        this.accountsList = response.data.data.list
        this.total_count = response.data.data.total_count
        this.loading = false
      })
    },
    deleteAccountAction(index, row) {
      this.$confirm(this.$t('08833112.80ae2a'), this.$t('08833112.02d981'), {
        confirmButtonText: this.$t('08833112.38cf16'),
        cancelButtonText: this.$t('08833112.625fb2'),
        type: 'warning'
      })
        .then(() => {
          deleteDealer(row.operator_id)
            .then((response) => {
              this.$message({
                message: this.$t('08833112.0007d1'),
                type: 'success'
              })
              this.getAccountListData()
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: this.$t('08833112.acf066')
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('08833112.2111cc')
          })
        })
    }
  },
  mounted() {
    this.getAccountListData()
    this.onGetsOpeationId()
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
