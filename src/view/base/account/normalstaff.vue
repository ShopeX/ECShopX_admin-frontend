<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<template>
  <SpPage>
    <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="login_name" label="登录账号:">
        <el-input v-model="params.login_name" placeholder="请输入账号名" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="mobile" label="手机号:">
        <el-input v-model="params.mobile" placeholder="请输入手机号" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="username" label="姓名:">
        <el-input v-model="params.username" placeholder="请输入姓名" />
      </SpFilterFormItem>
    </SpFilterForm>

    <div class="action-container">
      <el-button type="primary" icon="plus" @click="addLabels"> 添加账号 </el-button>
    </div>

    <el-table v-loading="loading" border :data="accountsList">
      <el-table-column prop="login_name" label="登录账号" />
      <el-table-column prop="mobile" label="手机号" />
      <el-table-column prop="username" label="姓名" />
      <el-table-column prop="roles" label="角色">
        <template slot-scope="scope">
          <el-tag
            v-for="item in scope.row.role_data"
            :key="item.role_id"
            size="mini"
            type="warning"
          >
            {{ item.role_name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="is_disable" label="禁用" width="80">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.is_disable"
            active-value="1"
            inactive-value="0"
            active-color="#ff4949"
            inactive-color="#ccc"
            @change="acitonDisabled(scope.$index, scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="editAction(scope.$index, scope.row)"> 编辑 </el-button>
          <!--<el-button
            size="mini"
            @click="deleteAccountAction(scope.$index, scope.row)"
          >
            删除
          </el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <div class="content-center content-top-padded">
      <el-pagination
        layout="prev, pager, next"
        :current-page.sync="page.pageIndex"
        :total="total_count"
        :page-size="page.pageSize"
        @current-change="onCurrentChange"
      />
    </div>
    <!-- 添加、编辑标识-开始 -->
    <el-dialog :title="editTitle" :visible.sync="editVisible" :before-close="handleCancel">
      <template>
        <el-form ref="form" :model="form" class="demo-ruleForm" label-width="120px">
          <el-form-item label="登录账号">
            <el-col :span="10">
              <el-input
                v-if="!editLoginName"
                v-model="form.login_name"
                :minlength="4"
                :maxlength="16"
                placeholder="请输入员工登录账号"
              />
              <el-input v-else v-model="form.login_name" :disabled="true" />
            </el-col>
            <p class="frm-tips">账号名称4-16位，名称使用字母开头，字符有有字母，数字，下划线</p>
          </el-form-item>
          <el-form-item label="手机号">
            <el-col :span="10">
              <el-input
                v-if="!isEdit"
                v-model="form.mobile"
                :maxlength="11"
                placeholder="请输入11位手机号"
              />
              <el-input v-else v-model="editMobile" :disabled="true" />
            </el-col>
          </el-form-item>
          <el-form-item label="姓名">
            <el-col :span="10">
              <el-input v-model="form.username" required placeholder="请填写姓名" />
            </el-col>
          </el-form-item>
          <el-form-item label="登录密码">
            <el-col :span="10">
              <el-input v-model="form.password" :maxlength="255" />
            </el-col>
          </el-form-item>
          <el-form-item label="所属店铺">
            <el-tag
              v-for="(item, index) in relDistributors"
              :key="item.distributor_id"
              class="new-tag"
              closable
              :disable-transitions="false"
              @close="handleClose(index)"
            >
              {{ item.name }}
            </el-tag>
            <el-button size="medium" class="button-new-tag" @click="addDistributoreAction">
              + 点击搜索店铺
            </el-button>
          </el-form-item>
          <el-form-item label="角色">
            <el-checkbox-group v-model="form.role_id">
              <el-checkbox
                v-for="role in rolesListData"
                :key="role.role_id"
                :label="role.role_id"
                :value="role.role_id"
              >
                {{ role.role_name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="handleCancel"> 取消 </el-button>
        <el-button type="primary" @click="submitAction"> 保存 </el-button>
      </div>
    </el-dialog>
    <DistributorSelect
      :store-visible="DistributorVisible"
      :is-valid="isValid"
      :rel-data-ids="relDistributors"
      :get-status="DistributorStatus"
      @chooseStore="DistributorChooseAction"
      @closeStoreDialog="closeDialogAction"
    />
    <ShopSelect
      :store-visible="ShopVisible"
      :is-valid="isValid"
      :rel-data-ids="relShops"
      :old-data="oldData"
      :get-status="ShopStatus"
      @chooseStore="ShopChooseAction"
      @closeStoreDialog="closeDialogAction"
    />
  </SpPage>
</template>
<script>
import {
  createAccount,
  getAccountInfo,
  getAccountList,
  updateAccountInfo,
  deleteAccountInfo,
  getRolesList
} from '../../../api/company'
import { getDistributorList } from '@/api/marketing'
import { changeOperatorStatus } from '@/api/login'
import { pageMixin } from '@/mixins'
import DistributorSelect from '@/components/function/distributorSelect'
import ShopSelect from '@/components/function/shopSelect'
export default {
  components: {
    DistributorSelect,
    ShopSelect
  },
  mixins: [pageMixin],
  props: {
    status: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      oldData: [],
      isValid: true,
      DistributorStatus: false,
      ShopStatus: false,
      relDistributors: [],
      relShops: [],
      DistributorVisible: false,
      ShopVisible: false,
      isEdit: false,
      editVisible: false,
      editTitle: '',

      form: {
        operator_type: 'staff',
        mobile: '',
        login_name: '',
        username: '',
        distributor_ids: [],
        password: '',
        role_id: []
      },
      activeName: 'staff',

      editLoginName: '',
      editMobile: '',
      accountsList: [],
      detailData: {},
      loading: false,
      total_count: 0,
      params: {
        mobile: '',
        operator_type: 'staff'
      },
      operator_id: 0,
      rolesListData: [],
      datapass_block: 0
    }
  },

  watch: {
    status(val) {
      if (val) {
        this.fetchList()
      }
    }
  },
  mounted() {
    this.fetchList()
    this.getRolesListData()
  },
  methods: {
    handleClose(index) {
      this.relDistributors.splice(index, 1)
      this.form.distributor_ids.splice(index, 1)
      //this.$forceUpdate()
    },
    storeHandleClose(index) {
      this.DistributorStatus = false
      this.form.shop_ids.splice(index, 1)
      this.relShops.splice(index, 1)
      //this.$forceUpdate()
    },
    addDistributoreAction() {
      this.DistributorVisible = true
      this.DistributorStatus = true
    },
    addStoreAction() {
      this.ShopVisible = true
      this.ShopStatus = true
    },
    getDistributor(ids) {
      let param = { distributor_id: ids }
      getDistributorList({ ...param, is_app: 1 }).then(res => {
        this.relDistributors = res.data.data.list
        this.oldData = [...res.data.data.list]
      })
    },
    handleCancel() {
      this.editVisible = false
      this.form.operator_type = 'staff'
      this.operator_id = ''
      this.form.login_name = ''
      this.form.mobile = ''
      this.form.username = ''
      this.form.password = ''
      this.form.role_id = []
      this.form.distributor_ids = []
      this.form.shop_ids = []
      this.relDistributors = []
      this.relShops = []
    },
    addLabels() {
      // 添加物料弹框
      this.handleCancel()
      this.editTitle = '添加账号信息'
      this.editVisible = true
      this.isEdit = false
      this.form.username = ''
      this.form.login_name = ''
      this.editLoginName = ''
      this.editMobile = ''
      this.operator_id = ''
      this.form.password = ''
      this.form.role_id = []
    },
    editAction(index, row) {
      // 编辑物料弹框
      this.handleCancel()
      this.editTitle = '编辑账号信息'
      this.editVisible = true
      this.isEdit = true
      this.form.username = row.username
      this.form.login_name = row.login_name
      this.editLoginName = row.login_name
      this.editMobile = row.mobile
      this.operator_id = row.operator_id
      this.form.password = ''
      row.role_data.forEach(item => {
        this.form.role_id.push(item.role_id)
      })
      if (row.distributor_ids && row.distributor_ids.length > 0) {
        let ids = []
        row.distributor_ids.forEach(item => {
          ids.push(item.distributor_id)
        })
        this.getDistributor(ids)
      }
    },
    submitAction() {
      // 提交物料
      this.form.shop_ids = []
      this.form.distributor_ids = []
      if (this.relShops.length > 0) {
        this.relShops.forEach(shop => {
          this.form.shop_ids.push({ name: shop.storeName, shop_id: shop.wxShopId })
        })
      }
      if (this.relDistributors.length > 0) {
        this.relDistributors.forEach(distributor => {
          this.form.distributor_ids.push({
            name: distributor.name,
            distributor_id: distributor.distributor_id
          })
        })
      }

      if (this.operator_id) {
        updateAccountInfo(this.operator_id, this.form).then(response => {
          this.detailData = response.data.data
          this.editVisible = false
          this.fetchList()
        })
      } else {
        createAccount(this.form).then(response => {
          this.detailData = response.data.data
          this.editVisible = false
          this.fetchList()
          this.handleCancel()
        })
      }
    },

    fetchList() {
      this.loading = true
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        ...this.params
      }
      getAccountList(params).then(response => {
        let list = response.data.data.list
        list.forEach(item => {
          if (item.is_disable == 1) {
            item.is_disable = '1'
          } else {
            item.is_disable = '0'
          }
        })

        this.accountsList = list
        this.total_count = response.data.data.total_count
        this.datapass_block = response.data.data.datapass_block
        this.loading = false
      })
    },
    deleteAccountAction(index, row) {
      this.$confirm('此操作将删除该账号, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteAccountInfo(row.operator_id)
            .then(response => {
              this.accountsList.splice(index, 1)
              this.$message({
                message: '删除成功',
                type: 'success',
                duration: 5 * 1000
              })
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: '删除失败'
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
    acitonDisabled(index, row) {
      if (row.is_disabled === true) {
        var msg = '此操作将会禁用该账号，是否继续?'
        this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            operator_id: row.operator_id,
            is_disable: row.is_disable
          }
          changeOperatorStatus(params).then(res => {
            // this.fetchList()
          })
        })
      } else {
        let params = {
          operator_id: row.operator_id,
          is_disable: row.is_disable
        }
        changeOperatorStatus(params).then(res => {
          // this.fetchList()
        })
      }
    },
    getRolesListData() {
      var params = { page: 1, pageSize: 100, version: 1 }
      getRolesList(params).then(res => {
        this.rolesListData = res.data.data.list
      })
    },
    DistributorChooseAction(data) {
      this.DistributorVisible = false
      this.DistributorStatus = false
      if (data === null || data.length <= 0) return
      this.relDistributors = data
    },
    ShopChooseAction(data) {
      this.ShopVisible = false
      this.ShopStatus = false
      if (data === null || data.length <= 0) return
      this.relShops = data
      this.relDistributors = data
    },
    closeDialogAction() {
      this.ShopVisible = false
      this.ShopStatus = false
      this.relDistributors = this.oldData
      this.DistributorStatus = false
      this.DistributorVisible = false
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
.sp-filter-form {
  margin-bottom: 16px;
}
</style>
