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
    <SpFilterForm :model="formData" @onSearch="dataSearch" @onReset="dataSearch">
      <SpFilterFormItem prop="mobile" label="手机号:">
        <el-input v-model="formData.mobile" placeholder="请输入手机号" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="account" label="账号:">
        <el-input v-model="formData.account" placeholder="请输入账号" />
      </SpFilterFormItem>
    </SpFilterForm>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-button type="primary" icon="plus" @click="addData"> 添加白名单 </el-button>
        <el-button v-if="!VERSION_IN_PURCHASE()" type="primary" icon="plus" @click="setTips">
          白名单提示
        </el-button>
      </el-col>
      <!-- <el-col :span="6">
        <el-input v-model="account" placeholder="账号" clearable />
      </el-col>
      <el-col :span="6">
        <el-input v-model="mobile" placeholder="手机号" clearable>
          <el-button slot="append" icon="el-icon-search" @click="dataSearch" />
        </el-input>
      </el-col> -->
    </el-row>
    <el-table v-loading="loading" :data="whitelistList" :height="wheight - 160">
      <el-table-column prop="mobile" label="手机号" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="account" label="账号" />
      <el-table-column prop="password" label="明文密码" />
      <!-- <el-table-column
        prop="email"
        label="邮箱"
      /> -->
      <el-table-column prop="enterprise_sn" label="企业编码" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="editAction(scope.$index, scope.row)"> 编辑 </el-button>
          <el-button size="mini" @click="deleteAction(scope.$index, scope.row)"> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="total_count > params.pageSize" class="content-center content-top-padded">
      <el-pagination
        layout="prev, pager, next"
        :current-page.sync="params.page"
        :total="total_count"
        :page-size="params.pageSize"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 添加、编辑标识-开始 -->
    <el-dialog :title="editTitle" :visible.sync="editVisible" :before-close="handleCancel">
      <template>
        <el-form ref="form" :model="form" class="demo-ruleForm" label-width="120px">
          <el-form-item el-form-item label="选择企业">
            <el-col :span="10">
              <el-select
                v-model="enterprise_sn_data"
                placeholder="请选择选择企业"
                style="width: 100%"
                :disabled="whitelist_id ? true : false"
                @change="selectChange"
              >
                <el-option
                  v-for="(item, index) in enterpriseList"
                  :key="`${item.enterprise_id}${index}`"
                  :label="item.enterprise_name"
                  :value="`${item.enterprise_sn}-${item.login_type}`"
                />
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item v-if="login_type" label="姓名">
            <el-col :span="10">
              <el-input
                v-model="form.name"
                required
                placeholder="请填写名称"
                :disabled="datapass_block == 1 && isEdit"
              />
            </el-col>
          </el-form-item>
          <el-form-item v-if="login_type == 'mobile'" label="手机号">
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
          <el-form-item v-if="login_type == 'account'" label="账号" prop="account">
            <el-col :span="10">
              <el-input v-model="form.account" :disabled="isEdit" placeholder="请输入帐号" />
            </el-col>
          </el-form-item>
          <el-form-item v-if="login_type == 'account'" label="密码" prop="password">
            <el-col :span="10">
              <el-input
                v-model="form.password"
                type="password"
                show-password
                placeholder="请输入密码"
              />
            </el-col>
          </el-form-item>
        </el-form>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="handleCancel"> 取消 </el-button>
        <el-button type="primary" @click="submitAction"> 保存 </el-button>
      </div>
    </el-dialog>
    <!-- 设置提示语句 -->
    <el-dialog :title="editTitle" :visible.sync="editTipsVisible" :before-close="handleCancelTips">
      <template>
        <el-form ref="form" :model="form" class="demo-ruleForm" label-width="120px">
          <el-form-item label="提示">
            <el-col :span="20">
              <el-input v-model="form.tips" required placeholder="请填写提示" />
            </el-col>
          </el-form-item>
        </el-form>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="handleCancelTips"> 取消 </el-button>
        <el-button type="primary" @click="submitTipsAction"> 保存 </el-button>
      </div>
    </el-dialog>
  </SpPage>
</template>
<script>
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import {
  getMembersWhitelistList,
  createMembersWhitelist,
  updateMembersWhitelist,
  deleteMembersWhitelist,
  getEnterpriseList
} from '@/api/member'
import { getWhitelistSetting, setWhitelistSetting } from '@/api/company'

export default {
  props: {
    status: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isValid: true,
      isEdit: false,
      editVisible: false,
      editTitle: '',
      editTipsVisible: false,
      form: {
        mobile: '',
        name: '',
        tips: '',
        enterprise_sn: '',
        account: '',
        password: ''
      },
      mobile: '',
      account: '',
      editMobile: '',
      editName: '',
      whitelistList: [],
      detailData: {},
      loading: false,
      total_count: 0,
      params: {
        page: 1,
        pageSize: 20
      },
      whitelist_id: '',
      datapass_block: 1,
      enterpriseList: [],
      login_type: '',
      enterprise_sn_data: '',
      formData: {
        mobile: '',
        account: ''
      }
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  watch: {
    status(val) {
      if (val) {
        this.getListData()
      }
    }
  },
  mounted() {
    this.getListData()
    this.fetchList()
  },
  methods: {
    selectChange(item) {
      const [enterprise_sn, login_type] = item.split('-')
      this.login_type = login_type
      this.form.enterprise_sn = enterprise_sn
    },
    handleClose(index) {
      this.relDistributors.splice(index, 1)
      this.form.distributor_ids.splice(index, 1)
    },
    handleCancel() {
      this.editVisible = false
      this.whitelist_id = ''
      this.editMobile = ''
      this.form.mobile = ''
      this.form.name = ''
      this.form.account = ''
      this.form.password = ''
      this.form.enterprise_sn = ''
      this.enterprise_sn_data = ''
      this.login_type = ''
    },
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getListData()
    },
    addData() {
      this.handleCancel()
      this.editTitle = '添加白名单'
      this.editVisible = true
      this.isEdit = false
    },
    fetchList() {
      getEnterpriseList({ page: 1, pageSize: 200 }).then(response => {
        this.enterpriseList = response.data.data.list
      })
    },
    editAction(index, row) {
      // 编辑物料弹框
      this.handleCancel()
      const fliterArr = this.enterpriseList.filter(el => el.enterprise_sn == row.enterprise_sn)
      const login_type =
        fliterArr.length > 0 ? fliterArr[0].login_type : this.enterpriseList[0].login_type
      const enterprise_sn =
        row.enterprise_sn || fliterArr.length > 0
          ? fliterArr[0].enterprise_sn
          : this.enterpriseList[0].enterprise_sn
      this.editTitle = '编辑白名单信息'
      this.editVisible = true
      this.isEdit = true
      this.editMobile = row.mobile
      this.form.mobile = row.mobile
      this.form.name = row.name
      this.whitelist_id = row.whitelist_id
      this.form.enterprise_sn = row.enterprise_sn
      this.form.password = row.password
      this.form.account = row.account
      this.enterprise_sn_data = enterprise_sn + '-' + login_type
      this.login_type = login_type
    },
    submitAction() {
      // 提交物料
      let params = this.form
      if (this.login_type == 'account') {
        delete params.mobile
      } else if (this.login_type == 'mobile') {
        delete params.password
        delete params.account
      }
      if (this.whitelist_id) {
        updateMembersWhitelist(this.whitelist_id, params).then(response => {
          this.detailData = response.data.data
          this.editVisible = false
          this.getListData()
        })
      } else {
        createMembersWhitelist(params).then(response => {
          this.detailData = response.data.data
          this.editVisible = false
          this.getListData()
          this.handleCancel()
        })
      }
    },
    dataSearch() {
      this.params.account = this.formData.account
      this.params.mobile = this.formData.mobile
      this.params.page = 1
      this.getListData()
    },
    getListData() {
      this.loading = true
      getMembersWhitelistList(this.params).then(response => {
        this.whitelistList = response.data.data.list
        this.total_count = response.data.data.total_count
        this.datapass_block = response.data.data.datapass_block
        this.loading = false
      })
    },
    deleteAction(index, row) {
      this.$confirm('此操作将删除该白名单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteMembersWhitelist(row.whitelist_id)
            .then(response => {
              this.whitelistList.splice(index, 1)
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
    setTips(data) {
      this.handleCancel()
      this.handleCancelTips()
      this.editTitle = '白名单提示'
      this.editTipsVisible = true
      getWhitelistSetting().then(response => {
        this.form.tips = response.data.data.whitelist_tips
      })
    },
    handleCancelTips() {
      this.editTipsVisible = false
      this.form.tips = ''
    },
    submitTipsAction() {
      // 提交物料
      const params = { whitelist_tips: this.form.tips }
      setWhitelistSetting(params).then(response => {
        this.editTipsVisible = false
        this.handleTipsCancel()
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
